import { Document, NodeIO } from "@gltf-transform/core";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const modelsDir = join(__dirname, "..", "public", "models");

// Create a simple box mesh (container-like shape)
function createBoxVertices(width, height, depth) {
  const w = width / 2;
  const h = height / 2;
  const d = depth / 2;

  // 24 vertices (4 per face for proper normals)
  const positions = new Float32Array([
    // Front face
    -w, -h, d,   w, -h, d,   w, h, d,   -w, h, d,
    // Back face
    w, -h, -d,  -w, -h, -d,  -w, h, -d,   w, h, -d,
    // Top face
    -w, h, d,    w, h, d,    w, h, -d,   -w, h, -d,
    // Bottom face
    -w, -h, -d,  w, -h, -d,  w, -h, d,  -w, -h, d,
    // Right face
    w, -h, d,    w, -h, -d,  w, h, -d,   w, h, d,
    // Left face
    -w, -h, -d, -w, -h, d,  -w, h, d,   -w, h, -d,
  ]);

  const normals = new Float32Array([
    // Front
    0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
    // Back
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    // Top
    0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
    // Bottom
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    // Right
    1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
    // Left
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
  ]);

  const indices = new Uint16Array([
    0, 1, 2, 0, 2, 3,       // Front
    4, 5, 6, 4, 6, 7,       // Back
    8, 9, 10, 8, 10, 11,    // Top
    12, 13, 14, 12, 14, 15, // Bottom
    16, 17, 18, 16, 18, 19, // Right
    20, 21, 22, 20, 22, 23, // Left
  ]);

  return { positions, normals, indices };
}

async function createContainerModel(name, width, height, depth, color) {
  const doc = new Document();
  const buffer = doc.createBuffer();

  const { positions, normals, indices } = createBoxVertices(width, height, depth);

  const positionAccessor = doc.createAccessor()
    .setType("VEC3")
    .setArray(positions)
    .setBuffer(buffer);

  const normalAccessor = doc.createAccessor()
    .setType("VEC3")
    .setArray(normals)
    .setBuffer(buffer);

  const indexAccessor = doc.createAccessor()
    .setType("SCALAR")
    .setArray(indices)
    .setBuffer(buffer);

  const material = doc.createMaterial()
    .setBaseColorFactor(color)
    .setMetallicFactor(0.7)
    .setRoughnessFactor(0.4);

  const prim = doc.createPrimitive()
    .setAttribute("POSITION", positionAccessor)
    .setAttribute("NORMAL", normalAccessor)
    .setIndices(indexAccessor)
    .setMaterial(material);

  const mesh = doc.createMesh().addPrimitive(prim);
  const node = doc.createNode().setMesh(mesh);
  const scene = doc.createScene().addChild(node);

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);

  const filePath = join(modelsDir, `${name}.glb`);
  await writeFile(filePath, Buffer.from(glb));
  console.log(`Created: ${filePath} (${(glb.byteLength / 1024).toFixed(1)} KB)`);
}

async function main() {
  await mkdir(modelsDir, { recursive: true });

  // Container models with different sizes and colors
  // Color format: [R, G, B, A] where values are 0-1
  const steelGray = [0.45, 0.48, 0.50, 1.0];
  const steelDark = [0.35, 0.38, 0.40, 1.0];
  const steelBlue = [0.30, 0.40, 0.55, 1.0];
  const yellow = [0.85, 0.65, 0.13, 1.0];
  const green = [0.20, 0.50, 0.30, 1.0];
  const red = [0.60, 0.20, 0.15, 1.0];

  await createContainerModel("container-small", 2.5, 1.2, 1.5, steelGray);
  await createContainerModel("container-standard", 3.5, 1.5, 1.8, steelBlue);
  await createContainerModel("container-extensions", 3.5, 2.0, 1.8, steelDark);
  await createContainerModel("container-hispalev", 5.0, 2.0, 2.2, yellow);
  await createContainerModel("cubicontainer", 1.2, 1.16, 1.0, green);
  await createContainerModel("bidon", 0.6, 0.9, 0.4, red);

  console.log("\nAll placeholder models created!");
}

main().catch(console.error);
