const esc = (value) => String(value)
  .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

export function createRenderer({ basePath, siteUrl, site, capabilities, effects, projects }) {
  const href = (path) => `${basePath}${path.startsWith('/') ? path : `/${path}`}` || '/';
  const media = (path) => href(`/${path.replace(/^\//,'')}`);
  const canonical = (route) => siteUrl ? `${siteUrl.replace(/\/$/,'')}${route}` : '';
  const og = siteUrl ? `${siteUrl.replace(/\/$/,'')}/og-image.png` : href('/og-image.png');

  const header = (dark = false) => `
    <header class="site-header${dark ? ' site-header--dark' : ''}" data-site-header>
      <div class="site-header__inner">
        <a class="site-brand" href="${href('/')}">Сергей Авдеев</a>
        <nav class="site-nav" data-shell-nav aria-label="Основная навигация">
          <a href="${href('/')}#work">Работа</a>
          <a href="${href('/')}#capabilities">Возможности</a>
          <a href="${href('/')}#process">Подход</a>
          <a href="${href('/')}#contact">Контакты</a>
        </nav>
        <button class="site-menu" type="button" aria-label="Открыть меню" aria-expanded="false" data-menu-toggle><span></span><span></span></button>
      </div>
    </header>`;

  const footer = () => `
    <footer class="site-footer"><div class="shell site-footer__inner">
      <small>© ${new Date().getUTCFullYear()} Сергей Авдеев · персональное портфолио</small>
      <a href="${site.github}" rel="noopener" target="_blank">GitHub</a>
    </div></footer>`;

  function document({ route, title, description, body, robots='index,follow', css=['portfolio.css'], bodyClass='' }) {
    const cssLinks = ['base.css', ...css].map((name) => `<link rel="stylesheet" href="${href(`/assets/css/${name}`)}">`).join('\n');
    const canonicalTag = canonical(route) ? `<link rel="canonical" href="${esc(canonical(route))}">` : '';
    return `<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${robots}">
<meta name="theme-color" content="#efeae0">
<meta name="app-base" content="${esc(basePath)}">
${canonicalTag}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(og)}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(og)}">
<link rel="icon" href="${href('/favicon.svg')}" type="image/svg+xml">
<link rel="manifest" href="${href('/site.webmanifest')}">
${cssLinks}
</head><body class="${bodyClass}">
<a class="skip-link" href="#main">К основному содержанию</a>
${body}
<script type="module" src="${href('/assets/js/main.js')}"></script>
</body></html>`;
  }

  function home() {
    const featured = projects.filter((p) => p.featured && p.status === 'SHOWCASE')[0];
    const caps = capabilities.map((cap, index) => `<article class="capability" data-reveal><span class="capability__n">0${index+1}</span><h3>${esc(cap.title)}</h3><p>${esc(cap.text)}</p></article>`).join('');
    const effectCards = effects.map((effect, index) => {
      const cls = ['preview-video','preview-story','preview-material','preview-type'][index] ?? 'preview-material';
      return `<a class="effect-card" href="${href(`/effects/${effect.slug}/`)}" data-effect-preview>
        <div class="effect-card__preview ${cls}" aria-hidden="true"></div>
        <div class="effect-card__top"><span>0${index+1}</span><span>Посмотреть эффект ↗</span></div>
        <h3>${esc(effect.title)}</h3><p>${esc(effect.text)}</p>
      </a>`;
    }).join('');
    const process = [
      ['Задача','Определяем, что должен делать продукт и для кого.'],
      ['Структура и визуальный язык','Проектируется сценарий, контент и интерфейс.'],
      ['Разработка','Собирается рабочий адаптивный продукт.'],
      ['Проверка и запуск','Тестирование, исправления и выпуск.']
    ].map((item,index)=>`<article class="process-step" data-reveal><span class="process-step__n">0${index+1}</span><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join('');
    const contacts = site.contacts.map((contact) => `<a href="${contact.href}"${contact.kind==='github'?' target="_blank" rel="noopener"':''}>${esc(contact.label)} ↗</a>`).join('');
    const cover = featured ? media(featured.cover) : '';
    const projectRoute = featured ? href(`/work/${featured.slug}/`) : '#work';
    const body = `${header()}
<main id="main">
<section class="hero-v2" data-hero>
  <div class="shell hero-v2__top"><span class="eyebrow">Сергей Авдеев · web development</span><span class="hero-v2__meta">Дизайн / frontend / interactive</span></div>
  <div class="shell hero-v2__body">
    <div class="hero-v2__copy">
      <h1 class="hero-v2__title"><span>Сайты и</span><span>веб-приложения</span><span>под ключ</span></h1>
      <p class="hero-v2__lead">Разработка сайтов и веб-интерфейсов от структуры и визуальной концепции до рабочего адаптивного продукта.</p>
    </div>
    <a class="digital-sheet" href="${projectRoute}" data-digital-sheet aria-label="Открыть проект «Разные люди»">
      <div class="digital-sheet__plane" data-sheet-plane>
        <div class="digital-sheet__grid" aria-hidden="true"></div><div class="noise" aria-hidden="true"></div><div class="digital-sheet__bar"></div>
        <div class="digital-sheet__brand">РАЗНЫЕ<br>ЛЮДИ</div><div class="digital-sheet__meta">01 / featured work<br>interactive website</div>
        ${cover ? `<img class="digital-sheet__image" src="${cover}" alt="" fetchpriority="high">` : ''}
        <div class="digital-sheet__caption">digital material → real project</div><div class="digital-sheet__pointer" aria-hidden="true">↗</div>
      </div>
    </a>
    <span class="hero-v2__scroll">Прокрутите ↓</span>
  </div>
</section>
<section class="featured" id="work">
  <div class="shell">
    <div class="featured__head" data-reveal><span class="eyebrow">Featured work / 01</span><div><h2>Не только экран.<br>Рабочий сайт.</h2><p>Проект можно изучить как кейс, а затем открыть полноценную portfolio-копию и пройти её как обычный сайт.</p></div></div>
    ${featured ? `<a class="featured__visual" href="${projectRoute}" data-reveal><img src="${cover}" alt="${esc(featured.title)} — фрагмент сайта" loading="lazy"><div class="featured__overlay"><h3>${esc(featured.title)}</h3><div class="featured__details">${esc(featured.type)}<br>${featured.year}</div></div></a><div class="featured__cta"><a class="button-link" href="${projectRoute}">Смотреть проект <span>↗</span></a></div>` : ''}
  </div>
</section>
<section class="capabilities" id="capabilities"><div class="shell"><div class="section-intro" data-reveal><span class="eyebrow">Возможности</span><div><h2>Что могу<br>разработать</h2><p>От промо-страницы до внутреннего сервиса — формат и сложность определяются задачей, а не готовым шаблоном.</p></div></div><div class="capability-list">${caps}</div></div></section>
<section class="effects-index" id="effects"><div class="shell"><div class="section-intro" data-reveal><span class="eyebrow">Интерактив</span><div><h2>Механики,<br>которые работают</h2><p>Несколько самостоятельных демонстраций — чтобы показать, как motion и интерактив могут усиливать подачу, а не просто украшать страницу.</p></div></div><div class="effects-grid">${effectCards}</div></div></section>
<section class="process" id="process"><div class="shell"><div class="section-intro" data-reveal><span class="eyebrow">Подход</span><div><h2>От задачи<br>до запуска</h2><p>Короткий процесс без лишней методологии.</p></div></div><div class="process-grid">${process}</div></div></section>
<section class="about-v2"><div class="shell about-v2__grid"><h2 data-reveal>Сергей<br>Авдеев</h2><div class="about-v2__copy" data-reveal><strong>Сайты и веб-приложения.</strong><p>Работаю со структурой, визуальной системой, frontend-логикой и интерактивом. Современные AI-assisted инструменты использую как часть процесса разработки, а не как замену продуктовой логике и проверке результата.</p><div class="about-v2__rule">Персональная работа · одна точка ответственности</div></div></div></section>
<section class="contact-v2" id="contact"><div class="shell"><span class="eyebrow" data-reveal>Контакты</span><h2 data-reveal>Есть проект —<br>обсудим задачу.</h2><div class="contact-v2__bottom" data-reveal><p>Расскажите, что нужно сделать: сайт, интерфейс или интерактивный проект. Начнём с задачи и нужного результата.</p><div class="contact-links">${contacts}</div></div></div></section>
</main>${footer()}`;
    return document({ route:'/', title:site.title, description:site.description, body, css:['portfolio.css'] });
  }

  function casePage(project) {
    const serviceHtml = project.services.map((s)=>`<span>${esc(s)}</span>`).join('');
    const images = project.caseMedia.filter((m)=>m.kind==='image');
    const video = project.caseMedia.find((m)=>m.kind==='video');
    const img = (index, cls='') => images[index] ? `<img class="${cls}" src="${media(images[index].src)}" alt="${esc(images[index].alt)}" loading="lazy">` : '';
    const body = `${header()}
<main id="main">
<section class="case-hero"><div class="shell"><div class="case-hero__meta"><span>${esc(project.type)}</span><span>${project.year} · ${esc(project.title)}</span></div><h1>${esc(project.title)}</h1><div class="case-hero__sub"><p>${esc(project.shortDescription)}</p><a class="button-link button-link--accent" href="${href(project.demoRoute)}">Смотреть сайт ↗</a></div></div></section>
<section class="case-key">${video ? `<video data-case-video muted loop playsinline preload="metadata" poster="${media(project.cover)}"><source src="${media(video.src)}" type="video/mp4"></video>` : img(0)}<span class="case-key__mark">Project / visual walkthrough</span></section>
<section class="case-story"><div class="shell"><article class="case-story__row" data-reveal><h2>Задача</h2><p>Создать атмосферный сайт страйкбольной команды, который показывает характер команды, знакомит посетителя с форматом и приводит к первому контакту.</p></article><article class="case-story__row" data-reveal><h2>Решение</h2><div><p>Сайт строится вокруг фото и видео, крупной типографики и последовательного сценария: от первого впечатления — к формату команды, тренировкам, критериям и контакту. Интерактив поддерживает историю, но не мешает навигации.</p><div class="case-services">${serviceHtml}</div></div></article></div></section>
<section class="walkthrough"><div class="shell"><div class="walkthrough__head" data-reveal><h2>Визуальный<br>маршрут</h2><p>Крупные медиа и разные композиции вместо повторяющейся сетки карточек.</p></div><figure class="media-wide" data-reveal>${img(0)}</figure><div class="media-split"><figure><div class="media-split__a" data-reveal>${img(1)}</div><figcaption class="media-caption">Динамика / игры и выезды</figcaption></figure><figure><div class="media-split__b" data-reveal>${img(2)}</div><figcaption class="media-caption">Сценарий / путь до первой тренировки</figcaption></figure></div><div class="media-editorial"><div class="media-editorial__text" data-reveal><strong>Фотография ведёт повествование.</strong><p>Текст остаётся коротким, а смена визуальных сцен задаёт ритм страницы и помогает быстро понять атмосферу команды.</p></div><div class="media-editorial__image" data-reveal>${img(3)}</div></div><figure class="media-wide" data-reveal>${img(4)}</figure></div></section>
<section class="case-cta"><div class="shell case-cta__inner"><h2>Смотреть<br>сайт</h2><a class="button-link" href="${href(project.demoRoute)}">Открыть полный demo ↗</a></div></section>
</main>${footer()}`;
    return document({ route:`/work/${project.slug}/`, title:`${project.title} — проект Сергея Авдеева`, description:`${project.title}: ${project.shortDescription}`, body, css:['case.css'] });
  }

  function effectPage(effect) {
    const commonHead = `<div class="shell effect-head"><div><a class="back-link" href="${href('/')}#effects">Назад в портфолио</a><h1>${esc(effect.title)}</h1></div><p>${esc(effect.text)}</p></div>`;
    let demo = '';
    if (effect.slug === 'digital-material') demo = `<section class="material-stage" data-material-stage><div class="material-object" data-material-object><div class="material-object__content"><div class="material-object__line"></div><span class="mono">pointer / depth / light</span><h2>Интерфейс<br>как материал</h2></div></div></section>`;
    if (effect.slug === 'video-scroll') demo = `<section class="video-scroll-scene" data-video-scroll-scene><div class="video-scroll-sticky"><video muted playsinline preload="auto" poster="${media('projects/raznye-ludi/assets/scene_01.webp')}"><source src="${media('projects/raznye-ludi/assets/final_hero.mp4')}" type="video/mp4"></video><div class="video-scroll-copy"><h2>Движение страницы управляет сценой.</h2><p>Прокрутка становится монтажной шкалой: движение вперёд и назад меняет момент видео.</p></div><div class="video-progress" data-video-progress></div></div></section>`;
    if (effect.slug === 'scroll-story') demo = `<section class="shell scroll-story" data-scroll-story><div class="story-visual" data-story-visual data-scene="0"><span class="story-visual__label">scene / 01</span></div><div class="story-steps"><article class="story-step is-active" data-story-step="0"><span>01</span><h2>Вход в историю</h2><p>Один визуальный объект остаётся в фокусе, пока содержание меняется вокруг него.</p></article><article class="story-step" data-story-step="1"><span>02</span><h2>Смена контекста</h2><p>Композиция реагирует на следующую смысловую точку без перезагрузки и тяжёлого scroll hijacking.</p></article><article class="story-step" data-story-step="2"><span>03</span><h2>Финальный акцент</h2><p>Последняя сцена перестраивает форму и цвет, чтобы закрыть историю сильным визуальным действием.</p></article></div></section>`;
    if (effect.slug === 'type-reveal') demo = `<section class="shell type-field" data-type-field><div class="type-line"><span class="type-word" data-type-word>Текст</span><span class="type-word" data-type-word>может</span></div><div class="type-line"><span class="type-word" data-type-word>реагировать</span></div><div class="type-line"><span class="type-word" data-type-word>на</span><span class="type-word" data-type-word>движение</span></div><div class="type-note"><span>Проведите указателем по типографике</span><span>На touch — статичная доступная версия</span></div></section>`;
    const body = `${header()}<main id="main" class="effect-page">${commonHead}${demo}<div class="shell effect-end"><span class="mono">focused demo / noindex</span><a class="back-link" href="${href('/')}#effects">К другим возможностям</a></div></main>`;
    return document({ route:`/effects/${effect.slug}/`, title:`${effect.title} — интерактивная демонстрация`, description:effect.text, body, robots:'noindex,nofollow', css:['effects.css'] });
  }

  function notFound() {
    const body = `${header()}<main id="main" class="effect-page"><div class="shell effect-head" style="min-height:80svh;align-items:center"><div><span class="eyebrow">404</span><h1>Страница<br>не найдена</h1><a class="button-link" href="${href('/')}">На главную</a></div></div></main>${footer()}`;
    return document({ route:'/404.html', title:'404 — Сергей Авдеев', description:'Страница не найдена.', body, robots:'noindex,nofollow', css:['effects.css'] });
  }

  return { href, media, document, home, casePage, effectPage, notFound };
}
