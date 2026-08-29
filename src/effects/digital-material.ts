import { prefersReducedMotion } from '../shared/motion.js';

export function initDigitalMaterialEffect(): void {
  const stage = document.querySelector<HTMLElement>('[data-material-stage]');
  const material = stage?.querySelector<HTMLElement>('[data-material-object]');
  if (!stage || !material || prefersReducedMotion()) return;

  stage.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const r = stage.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - 0.5;
    const y = (event.clientY - r.top) / r.height - 0.5;
    material.style.setProperty('--mat-x', `${x * 18}px`);
    material.style.setProperty('--mat-y', `${y * 14}px`);
    material.style.setProperty('--mat-rx', `${y * -13}deg`);
    material.style.setProperty('--mat-ry', `${x * 15}deg`);
    material.style.setProperty('--light-x', `${50 + x * 32}%`);
    material.style.setProperty('--light-y', `${45 + y * 28}%`);
  });
  stage.addEventListener('pointerleave', () => {
    for (const [name, value] of [['--mat-x','0px'],['--mat-y','0px'],['--mat-rx','2deg'],['--mat-ry','-7deg'],['--light-x','50%'],['--light-y','45%']]) {
      material.style.setProperty(name, value);
    }
  });
}
