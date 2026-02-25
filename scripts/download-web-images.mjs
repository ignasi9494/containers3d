import https from 'https';
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://vilavilaserveisambientals.com/wp-content/uploads';

const images = [
  { url: `${baseUrl}/2020/10/Logo-VVSA-OK.png`, name: '00-logo-vilavila.png' },
  { url: `${baseUrl}/2021/09/Contenidor_nostreweb.jpg`, name: '01-contenedor-metalico.jpg' },
  { url: `${baseUrl}/2021/08/Compactadoraweb1.jpg`, name: '02-compactadora.jpg' },
  { url: `${baseUrl}/2020/10/Autovoltejador_novaimatge.png`, name: '03-autovolteador.png' },
  { url: `${baseUrl}/2020/10/Cisternaweb.jpg`, name: '04-cisterna.jpg' },
  { url: `${baseUrl}/2021/09/3contenidors.jpg`, name: '05-contenedores-plastico.jpg' },
  { url: `${baseUrl}/2021/09/ConfidencialMUNTATGE-scaled.jpg`, name: '06-confidencial.jpg' },
  { url: `${baseUrl}/2021/08/Caixa1m3_21.jpg`, name: '07-caja-palet.jpg' },
  { url: `${baseUrl}/2021/08/Selectivaretoc-1.jpg`, name: '08-papelera-selectiva.jpg' },
  { url: `${baseUrl}/2021/08/Bidonsperillosos.jpg`, name: '09-bidones-grgs.jpg' },
  { url: `${baseUrl}/2021/09/Sacnetweb3.jpg`, name: '10-sac-net.jpg' },
  { url: `${baseUrl}/2021/08/BigBagsol.jpg`, name: '11-big-bags.jpg' },
  { url: `${baseUrl}/2021/08/Rotocompactadoraweb4.jpg`, name: '12-rotocompactadora.jpg' },
  { url: `${baseUrl}/2021/09/1-4.png`, name: '13-contenedores-selectiva.png' },
  { url: `${baseUrl}/2021/09/2-4.png`, name: '14-compactadoras-banner.png' },
];

const outDir = path.resolve('reference/web-images');
fs.mkdirSync(outDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const size = fs.statSync(dest).size;
        console.log(`OK: ${path.basename(dest)} (${(size / 1024).toFixed(1)}KB)`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      console.error(`FAIL: ${path.basename(dest)} - ${err.message}`);
      reject(err);
    });
  });
}

console.log(`Downloading ${images.length} images to ${outDir}...`);
for (const img of images) {
  await download(img.url, path.join(outDir, img.name));
}
console.log('Done!');
