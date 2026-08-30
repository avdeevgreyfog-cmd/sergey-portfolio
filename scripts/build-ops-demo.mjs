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
const html = Buffer.from(encoded, 'base64');
if (!html.toString('utf8', 0, 32).toLowerCase().includes('<!doctype html>')) {
  throw new Error('Operations OS demo payload failed integrity check');
}

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`Operations OS demo built: ${html.length} bytes -> dist/demo/operations-os/index.html`);
