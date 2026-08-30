import { getBasePath, routePath } from '../shared/base-path.js';

function mountLivePreview(host: HTMLElement, eager = false) {
  if (host.dataset.livePreviewMounted === 'true') return;
  const base = getBasePath();
  const frame = document.createElement('iframe');
  frame.className = 'live-project-frame';
  frame.src = `${base}/demo/raznye-ludi/`;
  frame.title = 'Рабочий интерфейс проекта «Разные люди»';
  frame.tabIndex = -1;
  frame.setAttribute('aria-hidden', 'true');
  frame.setAttribute('loading', eager ? 'eager' : 'lazy');
  frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  host.prepend(frame);
  host.dataset.livePreviewMounted = 'true';
  frame.addEventListener('load', () => host.classList.add('live-preview-ready'), { once: true });
}

export function initProjectProof() {
  const route = routePath();
  if (route === '/works/' || route === '/works') {
    document.querySelectorAll<HTMLElement>('.work-entry__media').forEach((el) => mountLivePreview(el));
    return;
  }
  if (route === '/work/raznye-ludi/' || route === '/work/raznye-ludi') {
    const film = document.querySelector<HTMLElement>('.case-film');
    if (film) mountLivePreview(film, true);
  }
}
