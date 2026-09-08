import fs from 'node:fs';
import path from 'node:path';
import {createEditorial} from './editorial/pages.mjs';
export function applyEditorial({out,basePath,site,projects,siteUrl}){
 const r=createEditorial({basePath,site,projects,siteUrl});
 const write=(route,html)=>{const target=path.join(out,route);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,html)};
 write('index.html',r.home());write('projects/index.html',r.works());write('works/index.html',r.works('/works/'));
 for(const p of projects)write(`work/${p.slug}/index.html`,r.casePage(p));
 write('services/index.html',r.services());write('process/index.html',r.process());write('contact/index.html',r.contact());
}
