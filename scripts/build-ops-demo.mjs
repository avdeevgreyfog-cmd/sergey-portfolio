import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, '.opsdemo');
const out = path.join(root, 'dist', 'demo', 'operations-os');

const parts = fs.readdirSync(src)
  .filter((name) => /^\d{2}\.b64$/.test(name))
  .sort();

if (parts.length !== 7) {
  throw new Error(`Operations OS demo payload incomplete: expected 7 parts, got ${parts.length}`);
}

const encoded = parts.map((name) => fs.readFileSync(path.join(src, name), 'utf8').trim()).join('');
let html = Buffer.from(encoded, 'base64').toString('utf8');
if (!html.slice(0, 64).toLowerCase().includes('<!doctype html>')) {
  throw new Error('Operations OS demo payload failed integrity check');
}
if (!html.toLowerCase().includes('name="description"')) {
  html = html.replace('<head>', '<head>\n<meta name="description" content="Интерактивная демонстрация Operations OS для управления аутсорсингом: заявки, расчёты, объекты, подбор, табели, финансы и аналитика.">');
}

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html, 'utf8');
console.log(`Operations OS demo built: ${Buffer.byteLength(html)} bytes -> dist/demo/operations-os/index.html`);
