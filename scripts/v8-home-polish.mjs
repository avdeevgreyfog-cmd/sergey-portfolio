import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
const base=(process.env.BASE_PATH||'').trim().replace(/\/+$/,'');
const href=(p='/')=>`${base}${p.startsWith('/')?p:`/${p}`}`||'/';
const file=path.join(out,'index.html');
let html=fs.readFileSync(file,'utf8');
html=html.replace(/<filter id="v8grain"[\s\S]*?<\/filter>/,'');
html=html.replace(/\s*<circle cx="380" cy="380" r="212" fill="url\(#v8core\)" filter="url\(#v8grain\)" opacity="\.9"\/>/,'');
html=html.replace('</head>',`<link rel="stylesheet" href="${href('/assets/css/v8-home-polish.css')}"></head>`);
fs.writeFileSync(file,html,'utf8');
console.log('Portfolio V8 homepage polish applied.');
