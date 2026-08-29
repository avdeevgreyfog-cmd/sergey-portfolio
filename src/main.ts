import { routePath } from './shared/base-path.js';
import { observeReveals } from './shared/motion.js';
import { initNavigation } from './portfolio/navigation.js';
import { initProjectProof } from './portfolio/project-proof.js';

initNavigation(); observeReveals(); initProjectProof();
const route=routePath();
if(route==='/') import('./portfolio/home.js').then((m)=>m.initHome());
if(route==='/works/'||route==='/works') import('./portfolio/works.js').then((m)=>m.initWorks());
if(route==='/contact/'||route==='/contact') import('./portfolio/contact.js').then((m)=>m.initContact());
if(route==='/work/raznye-ludi/'||route==='/work/raznye-ludi') import('./portfolio/case-raznye.js').then((m)=>m.initRaznyeCase());
if(route.includes('/effects/video-scroll')) import('./effects/video-scroll.js').then((m)=>m.initVideoScroll());
if(route.includes('/effects/scroll-story')) import('./effects/scroll-story.js').then((m)=>m.initScrollStory());
if(route.includes('/effects/kinetic-type')) import('./effects/kinetic-type.js').then((m)=>m.initKineticType());
