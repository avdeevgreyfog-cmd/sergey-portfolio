import { reducedMotion } from '../shared/motion.js';

export function initHome() {
  const hero = document.querySelector<HTMLElement>('[data-live-hero]');
  const stage = document.querySelector<HTMLElement>('[data-live-window]');
  const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  const label = stage?.querySelector<HTMLElement>('.live-window__label');
  const titleLine = hero?.querySelector<HTMLElement>('.home-hero__title span:nth-child(2)');
  const media = stage ? [...stage.querySelectorAll<HTMLElement>('img,video')] : [];
  if (!hero || !stage) return;

  let loaded = false;
  let pointerX = 0;
  let pointerY = 0;
  let scale = 1.07;
  const lerp = (start: number, end: number, p: number) => start + (end - start) * p;
  const paintMedia = () => media.forEach((node) => {
    node.style.transform = `translate(${pointerX.toFixed(2)}px,${pointerY.toFixed(2)}px) scale(${scale.toFixed(4)})`;
  });

  const update = () => {
    const rect = hero.getBoundingClientRect();
    const range = Math.max(1, hero.offsetHeight - innerHeight);
    const p = Math.min(1, Math.max(0, -rect.top / range));
    const mobile = innerWidth <= 800;
    const geometry = mobile
      ? { left:[38,4], top:[45,36], width:[57,92], height:[29,57] }
      : { left:[58,2], top:[41,10], width:[27,96], height:[31,82] };

    hero.style.setProperty('--hero-p', p.toFixed(4));
    stage.style.left = `${lerp(geometry.left[0], geometry.left[1], p).toFixed(3)}vw`;
    stage.style.top = `${lerp(geometry.top[0], geometry.top[1], p).toFixed(3)}vh`;
    stage.style.width = `${lerp(geometry.width[0], geometry.width[1], p).toFixed(3)}vw`;
    stage.style.height = `${lerp(geometry.height[0], geometry.height[1], p).toFixed(3)}vh`;
    stage.style.transform = `rotate(${lerp(-3, 0, p).toFixed(3)}deg)`;
    stage.style.clipPath = `polygon(${lerp(7,0,p).toFixed(2)}% ${lerp(2,0,p).toFixed(2)}%,100% ${lerp(10,0,p).toFixed(2)}%,${lerp(94,100,p).toFixed(2)}% 100%,0 ${lerp(88,100,p).toFixed(2)}%)`;
    stage.style.boxShadow = `0 ${lerp(35,20,p).toFixed(1)}px ${lerp(90,48,p).toFixed(1)}px rgba(0,0,0,.22)`;
    if (titleLine) titleLine.style.transform = `translateX(${lerp(0, mobile ? -1.2 : -3, p).toFixed(3)}vw)`;
    if (label) label.style.opacity = String(Math.max(0, Math.min(1, (p - .42) * 2.5)));
    scale = lerp(1.07, 1.02, p);
    media.forEach((node) => node.style.filter = `saturate(.72) contrast(1.07) brightness(${lerp(.82,.95,p).toFixed(4)})`);
    paintMedia();
    if (video) video.style.opacity = String(Math.max(0, Math.min(1, (p - .48) * 2.2)));

    if (video && p > .48 && !loaded) {
      const src = video.dataset.src;
      if (src) {
        video.src = src;
        video.load();
        if (!reducedMotion()) video.play().catch(() => {});
        loaded = true;
      }
    }
  };

  let ticking = false;
  const request = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  };
  addEventListener('scroll', request, { passive:true });
  addEventListener('resize', request, { passive:true });
  update();

  if (!reducedMotion()) {
    stage.addEventListener('pointermove', (event) => {
      const r = stage.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX-r.left)/Math.max(1,r.width)));
      const y = Math.min(1, Math.max(0, (event.clientY-r.top)/Math.max(1,r.height)));
      pointerX = (.5-x)*12;
      pointerY = (.5-y)*9;
      paintMedia();
    });
    stage.addEventListener('pointerleave', () => { pointerX=0; pointerY=0; paintMedia(); });
  }
}
