import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
const base=(process.env.BASE_PATH||'').trim().replace(/\/+$/,'');
const site=(process.env.SITE_URL||'https://avdeevgreyfog-cmd.github.io/sergey-portfolio').trim().replace(/\/$/,'');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
fs.cpSync(path.join(root,'public'),out,{recursive:true});fs.mkdirSync(path.join(out,'assets','js'),{recursive:true});fs.cpSync(path.join(root,'.build'),path.join(out,'assets','js'),{recursive:true});
const pages=[['/','home.html'],['/works/','works.html'],['/work/raznye-ludi/','raznye-ludi.html'],['/work/operations-os/','operations-os.html'],['/about/','about.html'],['/contact/','contact.html'],['/services/','services.html'],['/process/','process.html']];
const src=path.join(root,'public','v7-pages');
for(const [route,file] of pages){const html=fs.readFileSync(path.join(src,file),'utf8').replaceAll('__BASE__',base).replaceAll('__SITE__',site).replaceAll('__YEAR__',String(new Date().getUTCFullYear()));const dir=route==='/'?out:path.join(out,route.replace(/^\//,'').replace(/\/$/,''));fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);}
fs.writeFileSync(path.join(out,'404.html'),fs.readFileSync(path.join(src,'404.html'),'utf8').replaceAll('__BASE__',base).replaceAll('__SITE__',site));fs.writeFileSync(path.join(out,'.nojekyll'),'');
const indexed=pages.slice(0,6).map(x=>x[0]);fs.writeFileSync(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: ${base}/demo/\nSitemap: ${site}/sitemap.xml\n`);fs.writeFileSync(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexed.map(route=>`<url><loc>${site}${route}</loc></url>`).join('')}</urlset>`);console.log('Portfolio V7 built');
