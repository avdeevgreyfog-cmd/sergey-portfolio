export function initRaznyeCase(): void {
  const video = document.querySelector<HTMLVideoElement>('[data-case-video]');
  if (!video) return;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) void video.play().catch(() => undefined);
      else video.pause();
    }
  }, { threshold: 0.15 });
  observer.observe(video);
}
