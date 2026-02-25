/**
 * Script para generar modelos 3D de los 30 contenedores via Meshy.ai API
 * Usa Image-to-3D con texturas (colores) y Meshy-6
 *
 * Usage: node scripts/meshy-generate.mjs
 *
 * Con plan Pro: 1000 créditos/mes, Meshy-6 = 20 créditos (sin textura) o 30 con textura
 * 30 modelos x 30 créditos = 900 créditos
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const API_KEY = 'msy_iqOJfxjc3KlT9T1oQ3LrqqQHccVXvVepU2mE';
const API_BASE = 'https://api.meshy.ai/openapi/v1';
const IMAGES_DIR = path.join(PROJECT_ROOT, 'imagenes_del_pdf');
const MODELS_DIR = path.join(PROJECT_ROOT, 'public', 'models');
const STATUS_FILE = path.join(PROJECT_ROOT, 'scripts', 'meshy-status.json');

// Ensure models directory exists
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

// All 30 container products with their image mappings
const CONTAINERS = [
  // Embalajes y contenedores pequeños
  { slug: 'ecopil', image: '16.png', name: '1. Contenidors Piles (Ecopil)' },
  { slug: 'fluorescents', image: '21.png', name: '2. Contenidors Fluorescents' },
  { slug: 'toners', image: '21.png', name: '3. Papereres Selectiva (Tòners)' },
  { slug: 'ibc-1000l', image: '18.png', name: '4. IBC 1000L' },
  { slug: 'sac-net', image: '10.png', name: '5. Sac Net' },
  { slug: 'big-bag', image: '11.png', name: '6. Big Bag 1m³' },
  { slug: 'boxs-bateries', image: '12.png', name: '7. Boxs Bateries' },
  { slug: 'sacs-fibrociment', image: '19.png', name: '8. Sacs Fibrociment (Amianto)' },
  { slug: 'bido-especials', image: '25.png', name: '9. Bidons Residus Especials' },
  { slug: 'caixa-perillosos', image: '24.png', name: '10. Caixes Residus Perillosos' },
  // Plásticos
  { slug: 'plastic-240l', image: '29.png', name: '11. Selectiva Plàstic 240L' },
  { slug: 'selectiva-1100l', image: '26.png', name: '12. Selectiva Plàstic 1100L' },
  { slug: 'iglu-vidre', image: '28.png', name: '13. Iglú Vidre' },
  // Metálicos
  { slug: 'skip-2m3', image: '13.png', name: '14. Contenidor 2m³' },
  { slug: 'skip-3m3', image: '14.png', name: '15. Contenidor 3m³' },
  { slug: 'skip-5m3', image: '27.png', name: '16. Contenidor 5m³' },
  { slug: 'skip-6m3-tapat', image: '30.png', name: '17. Contenidor 6m³ (Tapat)' },
  { slug: 'skip-9m3', image: '23.png', name: '18. Contenidor 9m³' },
  { slug: 'skip-9m3-estanc', image: '32.png', name: '19. Contenidor 9m³ Estanc' },
  { slug: 'rolloff-10-13m3', image: '15.png', name: '20. Contenidor 10-13m³' },
  { slug: 'rolloff-12m3', image: '22.png', name: '21. Contenidor 12m³' },
  { slug: 'rolloff-15-40m3', image: '31.png', name: '22. Contenidor 15-40m³' },
  { slug: 'estancs-15-25m3', image: '33.png', name: '23. Contenidors Estancs 15-25m³' },
  { slug: 'confidencial', image: '34.png', name: '24. Confidencial' },
  // Maquinaria
  { slug: 'compactadora', image: '48.png', name: '25. Compactadora' },
  { slug: 'autovoltejador', image: '40.png', name: '26. Autovoltejador' },
  { slug: 'autobasculant', image: '42.png', name: '27. Autobasculant' },
  { slug: 'roll-paker', image: '41.png', name: '28. Roll Paker' },
  { slug: 'rotocompactador', image: '43.png', name: '29. Rotocompactador' },
  { slug: 'cisterna', image: '47.png', name: '30. Cisterna' },
];

// Load previous status to resume if needed
function loadStatus() {
  if (fs.existsSync(STATUS_FILE)) {
    return JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
  }
  return {};
}

function saveStatus(status) {
  fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
}

function imageToDataUri(imagePath) {
  const data = fs.readFileSync(imagePath);
  const base64 = data.toString('base64');
  const ext = path.extname(imagePath).slice(1).toLowerCase();
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${base64}`;
}

async function createTask(container) {
  const imagePath = path.join(IMAGES_DIR, container.image);
  if (!fs.existsSync(imagePath)) {
    console.error(`  [SKIP] Image not found: ${container.image}`);
    return null;
  }

  const dataUri = imageToDataUri(imagePath);

  const body = {
    image_url: dataUri,
    ai_model: 'meshy-4',
    topology: 'triangle',
    target_polycount: 30000,
    should_remesh: true,
    should_texture: true,
  };

  const res = await fetch(`${API_BASE}/image-to-3d`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`  [ERROR] ${container.slug}: ${res.status} - ${err}`);
    return null;
  }

  const data = await res.json();
  console.log(`  [CREATED] ${container.slug} -> Task ID: ${data.result}`);
  return data.result;
}

async function checkTask(taskId) {
  const res = await fetch(`${API_BASE}/image-to-3d/${taskId}`, {
    headers: { 'Authorization': `Bearer ${API_KEY}` },
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  [ERROR] Check task ${taskId}: ${res.status} - ${err}`);
    return null;
  }
  return await res.json();
}

async function waitForTask(taskId, slug) {
  let lastProgress = -1;
  let retries = 0;
  const maxRetries = 120; // 10 minutes max (5s * 120)

  while (retries < maxRetries) {
    const task = await checkTask(taskId);
    if (!task) {
      retries++;
      await new Promise(r => setTimeout(r, 5000));
      continue;
    }

    if (task.progress !== lastProgress) {
      lastProgress = task.progress;
      const timestamp = new Date().toLocaleTimeString();
      process.stdout.write(`\r  [${timestamp}] [${slug}] ${task.status} ${task.progress}%          `);
    }

    if (task.status === 'SUCCEEDED') {
      console.log(`\r  [${slug}] SUCCEEDED 100%                              `);
      return task;
    }
    if (task.status === 'FAILED' || task.status === 'CANCELED') {
      console.log(`\r  [${slug}] ${task.status}                              `);
      return null;
    }

    await new Promise(r => setTimeout(r, 5000));
    retries++;
  }

  console.log(`\r  [${slug}] TIMEOUT after ${maxRetries * 5}s                `);
  return null;
}

async function downloadModel(url, outputPath) {
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  [ERROR] Download failed: ${res.status}`);
    return false;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
  console.log(`  [SAVED] ${path.basename(outputPath)} (${sizeMB} MB)`);
  return true;
}

async function processContainer(container, status) {
  const glbPath = path.join(MODELS_DIR, `${container.slug}.glb`);

  // Skip if already downloaded
  if (fs.existsSync(glbPath)) {
    console.log(`  [SKIP] Already exists: ${container.slug}.glb`);
    return true;
  }

  // Check if we have a task in progress
  let taskId = status[container.slug]?.taskId;
  let taskStatus = status[container.slug]?.status;

  if (taskId && taskStatus !== 'FAILED' && taskStatus !== 'CANCELED') {
    console.log(`  Resuming task ${taskId}...`);
  } else {
    // Create new task
    console.log('  Creating 3D model with textures...');
    taskId = await createTask(container);
    if (!taskId) return false;

    status[container.slug] = { taskId, status: 'PENDING' };
    saveStatus(status);
  }

  // Wait for completion
  const task = await waitForTask(taskId, container.slug);
  if (!task) {
    status[container.slug].status = 'FAILED';
    saveStatus(status);
    return false;
  }

  status[container.slug].status = 'SUCCEEDED';
  saveStatus(status);

  // Download GLB
  if (task.model_urls?.glb) {
    const ok = await downloadModel(task.model_urls.glb, glbPath);
    if (ok) {
      status[container.slug].glbFile = `${container.slug}.glb`;
      saveStatus(status);
    }
    return ok;
  }

  console.error(`  [ERROR] No GLB URL in response for ${container.slug}`);
  return false;
}

async function main() {
  console.log('=====================================================');
  console.log('  Meshy.ai 3D Model Generator - Vila Vila Containers');
  console.log(`  Containers to process: ${CONTAINERS.length}`);
  console.log(`  Output directory: ${MODELS_DIR}`);
  console.log(`  AI Model: meshy-4 + textures + PBR`);
  console.log('=====================================================\n');

  const status = loadStatus();
  const results = { success: [], failed: [], skipped: [] };

  for (let i = 0; i < CONTAINERS.length; i++) {
    const container = CONTAINERS[i];
    console.log(`\n[${i + 1}/${CONTAINERS.length}] ${container.name} (${container.slug})`);

    try {
      const ok = await processContainer(container, status);
      if (ok) {
        results.success.push(container.slug);
      } else {
        results.failed.push(container.slug);
      }
    } catch (err) {
      console.error(`  [FATAL] ${container.slug}: ${err.message}`);
      results.failed.push(container.slug);
    }

    // Small delay between tasks to be nice to the API
    if (i < CONTAINERS.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\n=====================================================');
  console.log('  RESULTS');
  console.log(`  Success: ${results.success.length} / ${CONTAINERS.length}`);
  console.log(`  Failed:  ${results.failed.length}`);
  if (results.failed.length > 0) {
    console.log(`  Failed: ${results.failed.join(', ')}`);
  }
  console.log('=====================================================');

  // Generate mapping file for the project
  const mapping = {};
  for (const container of CONTAINERS) {
    const glbPath = path.join(MODELS_DIR, `${container.slug}.glb`);
    if (fs.existsSync(glbPath)) {
      mapping[container.slug] = {
        name: container.name,
        model: `/models/${container.slug}.glb`,
        image: container.image,
      };
    }
  }
  const mappingPath = path.join(PROJECT_ROOT, 'src', 'lib', 'model-mapping.json');
  fs.mkdirSync(path.dirname(mappingPath), { recursive: true });
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`\nModel mapping saved to: ${mappingPath}`);
}

main().catch(console.error);
