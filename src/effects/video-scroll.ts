import { prefersReducedMotion } from '../shared/motion.js';

export function initVideoScrollEffect(): void {
  const scene = document.querySelector<HTMLElement>('[data-video-scroll-scene]');
  const video = scene?.querySelector<HTMLVideoElement>('video');
  const progress = scene?.querySelector<HTMLElement>('[data-video-progress]');
  if (!scene || !video) return;

  video.pause();
  video.muted = true;
  video.playsInline = true;
  if (prefersReducedMotion()) {
    video.controls = true;
    return;
  }

  let duration = 0;
  video.addEventListener('loadedmetadata', () => { duration = Math.max(0, video.duration || 0); });

  let raf = 0;
  const update = () => {
    raf = 0;
    const rect = scene.getBoundingClientRect();
    const total = Math.max(1, scene.offsetHeight - window.innerHeight);
    const y = Math.max(0, Math.min(total, -rect.top));
    const ratio = y / total;
    if (duration > 0 && Number.isFinite(duration)) {
      const target = Math.min(Math.max(0, duration - 0.05), ratio * duration);
      if (Math.abs(video.currentTime - target) > 0.035) video.currentTime = target;
    }
    if (progress) progress.style.setProperty('--progress', `${Math.round(ratio * 100)}%`);
  };
  window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  video.addEventListener('loadeddata', update, { once: true });
  update();
}
