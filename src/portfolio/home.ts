import { prefersReducedMotion } from '../shared/motion.js';

function initDigitalSheet(): void {
  const host = document.querySelector<HTMLElement>('[data-digital-sheet]');
  const plane = host?.querySelector<HTMLElement>('[data-sheet-plane]');
  if (!host || !plane || prefersReducedMotion()) return;

  let raf = 0;
  const reset = () => {
    plane.style.setProperty('--rx', '2deg');
    plane.style.setProperty('--ry', '-9deg');
    plane.style.setProperty('--mx', '0px');
    plane.style.setProperty('--my', '0px');
  };

  host.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = host.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      plane.style.setProperty('--rx', `${2 + y * -7}deg`);
      plane.style.setProperty('--ry', `${-9 + x * 9}deg`);
      plane.style.setProperty('--mx', `${x * 12}px`);
      plane.style.setProperty('--my', `${y * 10}px`);
    });
  });
  host.addEventListener('pointerleave', reset);
  reset();
}

function initHeroScroll(): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero || prefersReducedMotion()) return;
  let raf = 0;
  const update = () => {
    raf = 0;
    const rect = hero.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height * 0.7)));
    hero.style.setProperty('--hero-progress', progress.toFixed(3));
  };
  window.addEventListener('scroll', () => {
    if (!raf) raf = requestAnimationFrame(update);
  }, { passive: true });
  update();
}

function initEffectPreviews(): void {
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-effect-preview]').forEach((card) => {
    card.addEventListener('pointerenter', () => card.classList.add('is-previewing'));
    card.addEventListener('pointerleave', () => card.classList.remove('is-previewing'));
  });
}

export function initHome(): void {
  initDigitalSheet();
  initHeroScroll();
  initEffectPreviews();
}
