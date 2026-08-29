import { reducedMotion } from '../shared/motion.js';
export function initHome(){
 const stage=document.querySelector<HTMLElement>('[data-hero-reel]'); const video=document.querySelector<HTMLVideoElement>('[data-hero-video]'); if(!stage||!video)return;
 if(reducedMotion()){video.pause();return;}
 const observer=new IntersectionObserver((entries)=>{for(const e of entries){if(e.isIntersecting){stage.classList.add('is-playing');video.play().catch(()=>{});}else{video.pause();}}},{threshold:.25}); observer.observe(stage);
}
