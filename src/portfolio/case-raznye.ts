import { reducedMotion } from '../shared/motion.js';
export function initRaznyeCase() {
  const video=document.querySelector<HTMLVideoElement>('[data-case-video]');
  if(!video||reducedMotion())return;
  const io=new IntersectionObserver((entries)=>entries.forEach((entry)=>entry.isIntersecting?video.play().catch(()=>{}):video.pause()),{threshold:.25});
  io.observe(video);
}
