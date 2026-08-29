import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRenderer } from './render.mjs';
import { site, capabilities, effects } from '../.build/config/site.js';
import { publicProjects } from '../.build/projects/registry.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const basePath = (process.env.BASE_PATH || '').trim().replace(/\/+$/,'');
const siteUrl = (process.env.SITE_URL || '').trim().replace(/\/$/,'');
if (basePath && !basePath.startsWith('/')) throw new Error('BASE_PATH must start with /');
fs.mkdirSync(out,{recursive:true});

function cp(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive:true });
  fs.cpSync(source,target,{recursive:true});
}
cp(path.join(root,'public'), out);
cp(path.join(root,'.build'), path.join(out,'assets','js'));

const renderer = createRenderer({ basePath, siteUrl, site, capabilities, effects, projects:publicProjects });
function writeRoute(route, html) {
  const dir = route === '/' ? out : path.join(out, route.replace(/^\//,'').replace(/\/$/,''));
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'), html);
}
writeRoute('/', renderer.home());
for (const project of publicProjects) writeRoute(`/work/${project.slug}/`, renderer.casePage(project));
for (const effect of effects) writeRoute(`/effects/${effect.slug}/`, renderer.effectPage(effect));
fs.writeFileSync(path.join(out,'404.html'), renderer.notFound());
fs.writeFileSync(path.join(out,'.nojekyll'),'');

const PIN = 'a566c822170ff8eb27e83e08937e5a37bbb8e8e5';
const RAW = `https://raw.githubusercontent.com/avdeevgreyfog-cmd/raznye-ludi-site/${PIN}`;
const rlAssets = ['final_hero.mp4','final_logo.png',...Array.from({length:11},(_,i)=>`scene_${String(i+1).padStart(2,'0')}.webp`)];
const rlDir = path.join(out,'projects','raznye-ludi','assets');
fs.mkdirSync(rlDir,{recursive:true});

async function get(url, binary=false) {
  let last;
  for (let i=0;i<3;i++) {
    try {
      const res = await fetch(url,{headers:{'user-agent':'sergey-portfolio-build/2'}});
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return binary ? Buffer.from(await res.arrayBuffer()) : await res.text();
    } catch (error) { last=error; await new Promise((r)=>setTimeout(r,500*(i+1))); }
  }
  throw last;
}

function placeholderSvg(label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000"><rect width="1600" height="1000" fill="#0b0e0b"/><text x="80" y="920" font-family="Arial" font-size="42" fill="#c9a55d">${label}</text></svg>`;
}

async function importRaznye() {
  const offline = process.env.ALLOW_PROJECT_PLACEHOLDERS === '1';
  let source;
  try { source = await get(`${RAW}/index.html`); }
  catch (error) {
    if (!offline) throw new Error(`Failed to import pinned Raznye Ludi landing: ${error}`);
    source = '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Разные люди — offline QA placeholder</title></head><body style="margin:0;background:#070a07;color:#eee;font-family:Arial"><main style="min-height:100vh;display:grid;place-items:center"><h1>Разные люди</h1></main></body></html>';
  }

  if (!offline) {
    for (const name of rlAssets) {
      const data = await get(`${RAW}/assets/${name}`, true);
      if (data.length < 1000) throw new Error(`Imported asset too small: ${name}`);
      fs.writeFileSync(path.join(rlDir,name),data);
    }
  } else {
    for (const name of rlAssets.filter((n)=>n.endsWith('.webp')||n.endsWith('.png'))) fs.writeFileSync(path.join(rlDir,`${name}.svg`),placeholderSvg(name));
  }

  const assetPrefix = `${basePath}/projects/raznye-ludi/assets/`;
  source = source
    .replace(/<script[^>]+kaspersky-labs\.com[^>]*><\/script>/gi,'')
    .replace(/assets\//g, assetPrefix)
    .replace('if(params.get(\'fogdebug\')===\'1\'){','if(false){')
    .replace('<head>','<head><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="strict-origin-when-cross-origin">')
    .replace('<body class="final-site">','<body class="final-site" data-portfolio-safe-demo="true">')
    .replace('</body>',`<script>document.addEventListener('submit',function(e){e.preventDefault();const f=e.target;if(!(f instanceof HTMLFormElement))return;const b=f.querySelector('button[type="submit"],input[type="submit"]');if(b){b.disabled=true;b.dataset.oldLabel=b.textContent||'';b.textContent='Готово — демо';setTimeout(()=>{b.disabled=false;b.textContent=b.dataset.oldLabel||'Отправить'},1800)}});</script></body>`);
  const demoDir = path.join(out,'demo','raznye-ludi');
  fs.mkdirSync(demoDir,{recursive:true});
  fs.writeFileSync(path.join(demoDir,'index.html'),source);
}
await importRaznye();

const robots = `User-agent: *\nAllow: /\nDisallow: ${basePath}/demo/\nDisallow: ${basePath}/effects/\nSitemap: ${siteUrl || 'https://avdeevgreyfog-cmd.github.io/sergey-portfolio'}/sitemap.xml\n`;
fs.writeFileSync(path.join(out,'robots.txt'),robots);
const urls = ['/',...publicProjects.map((p)=>`/work/${p.slug}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((r)=>`<url><loc>${siteUrl || 'https://avdeevgreyfog-cmd.github.io/sergey-portfolio'}${r}</loc></url>`).join('')}</urlset>`;
fs.writeFileSync(path.join(out,'sitemap.xml'),sitemap);
console.log(`Portfolio V2 built: ${1+publicProjects.length+effects.length} portfolio routes + autonomous Raznye Ludi demo.`);
