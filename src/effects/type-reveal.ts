import { prefersReducedMotion } from '../shared/motion.js';

export function initTypeRevealEffect(): void {
  const field = document.querySelector<HTMLElement>('[data-type-field]');
  if (!field) return;
  const words = [...field.querySelectorAll<HTMLElement>('[data-type-word]')];
  if (prefersReducedMotion()) {
    words.forEach((word) => word.style.setProperty('--type-strength', '1'));
    return;
  }
  field.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    words.forEach((word) => {
      const r = word.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const distance = Math.hypot(event.clientX - cx, event.clientY - cy);
      const strength = Math.max(0, Math.min(1, 1 - distance / 520));
      word.style.setProperty('--type-strength', strength.toFixed(3));
    });
  });
  field.addEventListener('pointerleave', () => words.forEach((word) => word.style.setProperty('--type-strength', '.38')));
}
