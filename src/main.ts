import { getBasePath, routePath } from './shared/base-path.js';
import { observeReveals } from './shared/motion.js';
import { initNavigation } from './portfolio/navigation.js';

initNavigation();
observeReveals();
const route=routePath();
const base=getBasePath();

function addPreviewStyles(){
  if(document.querySelector('link[data-v6-preview]')) return;
  const link=document.createElement('link');
  link.rel='stylesheet';link.href=`${base}/assets/css/v6-preview.css`;link.dataset.v6Preview='true';document.head.append(link);
}
function projectFrame(className:string,title:string){
  const frame=document.createElement('iframe');
  frame.className=className;frame.src=`${base}/demo/raznye-ludi/`;frame.title=title;frame.tabIndex=-1;
  frame.setAttribute('aria-hidden','true');frame.setAttribute('sandbox','allow-scripts allow-same-origin');frame.setAttribute('loading','eager');
  return frame;
}

if(route==='/works/'||route==='/works') {
  addPreviewStyles();
  document.querySelectorAll<HTMLElement>('.v6-project__media').forEach((host)=>host.prepend(projectFrame('v6-project-frame','Превью сайта Разные люди')));
  import('./portfolio/works.js').then((m)=>m.initWorks());
}
if(route==='/work/raznye-ludi/'||route==='/work/raznye-ludi') {
  addPreviewStyles();
  const cover=document.querySelector<HTMLElement>('.v6-case-cover');
  if(cover) cover.append(projectFrame('v6-case-cover-frame','Главный экран сайта Разные люди'));
}
if(route==='/contact/'||route==='/contact') import('./portfolio/contact.js').then((m)=>m.initContact());
if(route.includes('/effects/video-scroll')) import('./effects/video-scroll.js').then((m)=>m.initVideoScroll());
if(route.includes('/effects/scroll-story')) import('./effects/scroll-story.js').then((m)=>m.initScrollStory());
if(route.includes('/effects/kinetic-type')) import('./effects/kinetic-type.js').then((m)=>m.initKineticType());
