import { prefersReducedMotion } from '../shared/motion.js';

export function initScrollStoryEffect(): void {
  const story = document.querySelector<HTMLElement>('[data-scroll-story]');
  if (!story || prefersReducedMotion()) return;
  const steps = [...story.querySelectorAll<HTMLElement>('[data-story-step]')];
  const visual = story.querySelector<HTMLElement>('[data-story-visual]');
  if (!steps.length || !visual) return;

  const observer = new IntersectionObserver((entries) => {
    const active = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!active) return;
    const step = active.target as HTMLElement;
    const index = Number(step.dataset.storyStep ?? 0);
    steps.forEach((node) => node.classList.toggle('is-active', node === step));
    visual.dataset.scene = String(index);
  }, { threshold: [0.35, 0.55, 0.75], rootMargin: '-18% 0px -25% 0px' });
  steps.forEach((step) => observer.observe(step));
}
