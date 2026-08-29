import { stripBase } from './shared/base-path.js';
import { initReveal } from './shared/motion.js';
import { initNavigation } from './portfolio/navigation.js';
import { initHome } from './portfolio/home.js';
import { initRaznyeCase } from './portfolio/case-raznye.js';

initNavigation();
initReveal();

const route = stripBase().replace(/\/index\.html$/, '/');

if (route === '/' || route === '') initHome();
if (route === '/work/raznye-ludi/' || route === '/work/raznye-ludi') initRaznyeCase();

if (route.startsWith('/effects/')) {
  const slug = route.split('/').filter(Boolean)[1];
  const loaders: Record<string, () => Promise<{ default?: unknown } | unknown>> = {
    'video-scroll': () => import('./effects/video-scroll.js').then((m) => { m.initVideoScrollEffect(); return m; }),
    'scroll-story': () => import('./effects/scroll-story.js').then((m) => { m.initScrollStoryEffect(); return m; }),
    'digital-material': () => import('./effects/digital-material.js').then((m) => { m.initDigitalMaterialEffect(); return m; }),
    'type-reveal': () => import('./effects/type-reveal.js').then((m) => { m.initTypeRevealEffect(); return m; })
  };
  void loaders[slug]?.();
}
