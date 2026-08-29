import { reducedMotion } from '../shared/motion.js';
export function initVideoScroll() {
  const scene=document.querySelector<HTMLElement>('[data-video-scene]');
  const video=document.querySelector<HTMLVideoElement>('[data-video-scroll]');
  const progress=document.querySelector<HTMLElement>('[data-video-progress]');
  if(!scene||!video)return;
  if(reducedMotion()){video.controls=true;return;}
  let duration=0; video.addEventListener('loadedmetadata',()=>duration=video.duration||0,{once:true});
  let ticking=false;
  const update=()=>{
    const r=scene.getBoundingClientRect(); const range=Math.max(1,scene.offsetHeight-innerHeight); const p=Math.min(1,Math.max(0,-r.top/range));
    if(duration && Number.isFinite(duration)) video.currentTime=Math.min(duration-.05,Math.max(0,duration*p));
    progress?.style.setProperty('--progress',`${(p*100).toFixed(2)}%`); scene.style.setProperty('--scene-p',p.toFixed(4));
  };
  addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{update();ticking=false;});},{passive:true}); update();
}
