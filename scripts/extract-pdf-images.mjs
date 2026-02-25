import fs from 'node:fs';
import path from 'node:path';
import { PDFDocument, PDFName, PDFStream, PDFRawStream, PDFArray, PDFDict, PDFRef, PDFNumber } from 'pdf-lib';
import pako from 'pako';
import sharp from 'sharp';

const PDF_PATH = 'C:/Proyectos_ignasi/containers3d/cataleg-contenidors.pdf';
const OUTPUT_DIR = 'C:/Proyectos_ignasi/containers3d/extracted-images';
const MIN_DIM = 50;

function res(o,d){if(o instanceof PDFRef)return d.context.lookup(o);return o;}
function gn(o,d){const r=res(o,d);if(r instanceof PDFNumber)return r.asNumber();return undefined;}

function decStream(stream,dict,doc){
  let data;
  if(stream instanceof PDFRawStream) data=new Uint8Array(stream.contents);
  else if(stream.contents) data=new Uint8Array(stream.contents);
  else return null;
  let fObj=dict.get(PDFName.of("Filter"));
  fObj=res(fObj,doc);
  const filters=[];
  if(fObj instanceof PDFName) filters.push(fObj.decodeText());
  else if(fObj instanceof PDFArray){
    for(let i=0;i<fObj.size();i++){
      const ff=res(fObj.get(i),doc);
      if(ff instanceof PDFName) filters.push(ff.decodeText());
    }
  }
  if(filters.length===1&&filters[0]==="DCTDecode") return {data,format:"jpeg"};
  if(filters.length===1&&filters[0]==="JPXDecode") return {data,format:"jp2"};
  for(const ff of filters){
    if(ff==="FlateDecode"){try{data=pako.inflate(data);}catch(e){console.warn("  FlateDecode fail:",e.message);return null;}}
    else if(ff==="DCTDecode") return {data,format:"jpeg"};
    else if(ff==="JPXDecode") return {data,format:"jp2"};
    else{console.warn("  Unsupported filter:",ff);return null;}
  }
  return {data,format:"raw"};
}

function resolveCS(csObj,doc){
  csObj=res(csObj,doc);
  if(csObj instanceof PDFName){
    const n=csObj.decodeText();
    if(n==="DeviceRGB") return {ch:3};
    if(n==="DeviceGray") return {ch:1};
    if(n==="DeviceCMYK") return {ch:4};
    return {ch:3};
  }
  if(csObj instanceof PDFArray){
    const t=res(csObj.get(0),doc);
    const tn=t instanceof PDFName?t.decodeText():"";
    if(tn==="ICCBased"){
      const ss=res(csObj.get(1),doc);
      if(ss){const d=ss instanceof PDFDict?ss:ss.dict;const n=d?gn(d.get(PDFName.of("N")),doc):3;return {ch:n||3};}
      return {ch:3};
    }
    if(tn==="Indexed"){
      const base=resolveCS(csObj.get(1),doc);
      let lookup=res(csObj.get(3),doc);
      let pal;
      if(lookup instanceof PDFRawStream||lookup instanceof PDFStream){const dec=decStream(lookup,lookup.dict||lookup,doc);pal=dec?dec.data:null;}
      else if(lookup&&lookup.encodedBytes) pal=lookup.encodedBytes;
      else if(lookup&&lookup.decodeText){const raw=lookup.decodeText();pal=Uint8Array.from(raw,c=>c.charCodeAt(0));}
      return {ch:1,indexed:true,baseCh:base.ch,pal};
    }
    if(tn==="CalRGB"||tn==="Lab") return {ch:3};
    if(tn==="CalGray") return {ch:1};
    return {ch:3};
  }
  return {ch:3};
}

async function main(){
  console.log("Reading PDF...");
  const pdfBytes=fs.readFileSync(PDF_PATH);
  const pdfDoc=await PDFDocument.load(pdfBytes,{ignoreEncryption:true});
  fs.mkdirSync(OUTPUT_DIR,{recursive:true});
  const objects=pdfDoc.context.enumerateIndirectObjects();
  let idx=0,saved=0;

  for(const [ref,obj] of objects){
    if(!(obj instanceof PDFRawStream)&&!(obj instanceof PDFStream)) continue;
    const dict=obj.dict||obj;
    if(!dict.get) continue;
    const sub=dict.get(PDFName.of("Subtype"));
    if(!sub||!(sub instanceof PDFName)||sub.decodeText()!=="Image") continue;
    idx++;
    const w=gn(dict.get(PDFName.of("Width")),pdfDoc);
    const h=gn(dict.get(PDFName.of("Height")),pdfDoc);
    const bpc=gn(dict.get(PDFName.of("BitsPerComponent")),pdfDoc)||8;
    console.log("#"+idx+" ref="+ref+" "+w+"x"+h+" bpc="+bpc);
    if(!w||!h) continue;
    if(w<MIN_DIM&&h<MIN_DIM){console.log("  skip: too small");continue;}
    const cs=resolveCS(dict.get(PDFName.of("ColorSpace")),pdfDoc);
    console.log("  cs: ch="+cs.ch+" indexed="+!!cs.indexed);
    const dec=decStream(obj,dict,pdfDoc);
    if(!dec||!dec.data||dec.data.length===0){console.log("  skip: no data");continue;}
    const base="image-"+String(idx).padStart(3,"0")+"-"+w+"x"+h;

    if(dec.format==="jpeg"){
      const jp=path.join(OUTPUT_DIR,base+".jpg");
      fs.writeFileSync(jp,dec.data);
      console.log("  saved "+jp+" ("+dec.data.length+" bytes JPEG)");
      saved++;
      try{
        const pp=path.join(OUTPUT_DIR,base+".png");
        await sharp(Buffer.from(dec.data)).png().toFile(pp);
        console.log("  saved "+pp);
      }catch(e){console.warn("  JPEG->PNG err:",e.message);}
      continue;
    }
    if(dec.format==="jp2"){
      const jp=path.join(OUTPUT_DIR,base+".jp2");
      fs.writeFileSync(jp,dec.data);
      console.log("  saved "+jp);
      saved++;
      continue;
    }

    try{
      let px=Buffer.from(dec.data);
      let ch=cs.ch;
      if(cs.indexed&&cs.pal){
        const bc=cs.baseCh||3;
        const exp=Buffer.alloc(w*h*bc);
        for(let i=0;i<w*h;i++){const ix=px[i]||0;for(let c=0;c<bc;c++) exp[i*bc+c]=cs.pal[ix*bc+c]||0;}
        px=exp;ch=bc;
      }
      if(bpc<8){var ppb=8/bpc;var mask=(1<<bpc)-1;var tot=w*h*ch;
        var up=Buffer.alloc(tot);var pi=0;
        for(var bi=0;bi<px.length&&pi<tot;bi++){var byt=px[bi];
          for(var ss=ppb-1;ss>=0;ss--){if(pi<tot){up[pi]=Math.round(((byt>>>(ss*bpc))&mask)/mask*255);pi++;}}
        }px=up;}
      if(ch===4&&!cs.indexed){
        var rgb=Buffer.alloc(w*h*3);
        for(var i=0;i<w*h;i++){
          var cc=px[i*4]/255,mm=px[i*4+1]/255,yy=px[i*4+2]/255,kk=px[i*4+3]/255;
          rgb[i*3]=Math.round(255*(1-cc)*(1-kk));
          rgb[i*3+1]=Math.round(255*(1-mm)*(1-kk));
          rgb[i*3+2]=Math.round(255*(1-yy)*(1-kk));
        }px=rgb;ch=3;}
      var expLen=w*h*ch;
      if(px.length<expLen){var pd=Buffer.alloc(expLen);px.copy(pd);px=pd;}
      else if(px.length>expLen) px=px.subarray(0,expLen);
      var pp=path.join(OUTPUT_DIR,base+".png");
      await sharp(px,{raw:{width:w,height:h,channels:ch}}).png().toFile(pp);
      console.log("  saved "+pp+" ("+w+"x"+h+" "+ch+"ch)");
      saved++;
    }catch(e){console.error("  sharp err:"+e.message);}
  }
  console.log("Done: "+saved+" images from "+idx+" image objects.");
}

main().catch(e=>{console.error("Fatal:",e);process.exit(1);});
