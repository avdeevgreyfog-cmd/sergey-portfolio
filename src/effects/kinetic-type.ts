import { reducedMotion } from '../shared/motion.js';
export function initKineticType() {
  const field=document.querySelector<HTMLElement>('[data-kinetic-field]'); if(!field||reducedMotion())return;
  field.addEventListener('pointermove',(event)=>{ const r=field.getBoundingClientRect(); const x=(event.clientX-r.left)/r.width*100; const y=(event.clientY-r.top)/r.height*100; field.style.setProperty('--kx',`${x.toFixed(1)}%`); field.style.setProperty('--ky',`${y.toFixed(1)}%`); field.style.setProperty('--kr',`${((x-50)/50*4).toFixed(2)}deg`); });
}
