import { capabilities, publicProjects } from './data.js';
const state = {
    favorites: new Set(),
    cart: {},
    crmStatus: { 'REQ-1042': 'На согласовании', 'REQ-1041': 'Черновик', 'REQ-1038': 'Согласован', 'REQ-1034': 'Отказ' }
};
const products = [
    {
        id: 'm1', name: 'Mira 01', category: 'Table', price: 24900, material: 'Алюминий',
        image: 'https://images.unsplash.com/photo-1756474215990-a18a9a0521d5?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=72&w=1600',
        imageAlt: 'Жёлтая скульптурная настольная лампа', colors: ['Ochre', 'Graphite'],
        description: 'Скульптурная настольная лампа с направленным мягким светом.'
    },
    {
        id: 'p2', name: 'Arc 22', category: 'Pendant', price: 18900, material: 'Сталь',
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=72&w=1600',
        imageAlt: 'Белый минималистичный подвесной светильник', colors: ['Chalk', 'Teal'],
        description: 'Лаконичный подвес с широким световым пятном для стола или острова.'
    },
    {
        id: 'p3', name: 'Weave 04', category: 'Pendant', price: 32600, material: 'Ротанг',
        image: 'https://images.unsplash.com/photo-1578678809569-1a8ead9cb802?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=72&w=1600',
        imageAlt: 'Плетёный подвесной светильник', colors: ['Natural', 'Smoke'],
        description: 'Ритмичная плетёная оболочка создаёт мягкую графику света и тени.'
    },
    {
        id: 't4', name: 'Nocturne 11', category: 'Table', price: 21500, material: 'Стекло / текстиль',
        image: 'https://images.unsplash.com/photo-1735838997528-ede45869233a?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=72&w=1600',
        imageAlt: 'Настольная лампа в тёмном интерьере', colors: ['Smoke', 'Sand'],
        description: 'Камерный локальный свет для спальни, гостиной или lounge-зоны.'
    },
    {
        id: 'p5', name: 'Halo 03', category: 'Pendant', price: 27400, material: 'Сталь / стекло',
        image: 'https://images.unsplash.com/photo-1475584681345-8503b2f13841?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=72&w=1600',
        imageAlt: 'Светящийся подвесной светильник в интерьере', colors: ['Bronze', 'Black'],
        description: 'Тёплый подвес для акцентной зоны и вечернего сценария освещения.'
    }
];
const crmRequests = [
    { id: 'REQ-1042', client: 'Север Проект', city: 'Москва', role: 'Комплектовщик', people: 18, wage: 420, date: '28.08.2026' },
    { id: 'REQ-1041', client: 'Альта Сервис', city: 'Подольск', role: 'Грузчик', people: 12, wage: 390, date: '27.08.2026' },
    { id: 'REQ-1038', client: 'Пром Лайн', city: 'Калуга', role: 'Оператор линии', people: 24, wage: 430, date: '25.08.2026' },
    { id: 'REQ-1034', client: 'Логика Склад', city: 'Домодедово', role: 'Сборщик', people: 10, wage: 410, date: '21.08.2026' }
];
const app = document.querySelector('#app');
if (!app)
    throw new Error('App root not found');
const root = app;
const testPath = window.__PORTFOLIO_TEST_PATH__;
const configuredBasePath = document.querySelector('meta[name="app-base"]')?.content || '';
const basePath = configuredBasePath === '/' ? '' : configuredBasePath.replace(/\/+$/, '');
const rawPath = testPath || window.location.pathname;
const appPath = !testPath && basePath && rawPath.startsWith(basePath) ? (rawPath.slice(basePath.length) || '/') : rawPath;
const currentPath = appPath.replace(/\/+/g, '/');
function applyInternalBasePath() {
    if (!basePath)
        return;
    root.querySelectorAll('a[href^="/"]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === basePath || href.startsWith(basePath + '/'))
            return;
        link.setAttribute('href', basePath + href);
    });
}
const escapeHtml = (value) => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const money = (value) => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
function icon(name) {
    const icons = {
        arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5"/></svg>',
        menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
        close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
        heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
        bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8Zm3 0a3 3 0 0 1 6 0"/></svg>',
        search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
        check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
        play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 7 8 5-8 5V7Z"/></svg>',
        grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></svg>',
        filter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
        back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H6M10 7l-5 5 5 5"/></svg>',
        plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
        minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>'
    };
    return icons[name];
}
function shellHeader(active = '') {
    return `
    <header class="shell-header" data-shell-header>
      <a class="shell-mark" href="/" aria-label="Сергей — главная"><span>С</span><strong>Сергей</strong></a>
      <button class="mobile-menu" type="button" data-menu-toggle aria-expanded="false" aria-label="Открыть меню">${icon('menu')}</button>
      <nav class="shell-nav" data-shell-nav aria-label="Основная навигация">
        <a class="${active === 'works' ? 'is-active' : ''}" href="/works/">Работы</a>
        <a class="${active === 'lab' ? 'is-active' : ''}" href="/lab/">Interactive Lab</a>
        <a href="/#about">Обо мне</a>
        <a class="shell-contact" href="https://github.com/avdeevgreyfog-cmd" target="_blank" rel="noreferrer">Обсудить проект ${icon('arrow')}</a>
      </nav>
    </header>`;
}
function shellFooter() {
    return `
    <footer class="shell-footer">
      <div><strong>Сергей</strong><span>Сайты и веб-приложения под ключ</span></div>
      <div class="shell-footer-links"><a href="/works/">Работы</a><a href="/lab/">Interactive Lab</a><a href="https://github.com/avdeevgreyfog-cmd" target="_blank" rel="noreferrer">GitHub</a></div>
      <small>Портфолио · 2026</small>
    </footer>`;
}
function projectPreview(project) {
    const generated = project.cover.startsWith('generated://');
    return `
    <article class="project-row" style="--project-accent:${project.accent}">
      <a class="project-media ${generated ? 'project-media--generated' : ''}" href="/work/${project.slug}/" aria-label="Открыть проект ${escapeHtml(project.title)}">
        ${generated ? `<div class="crm-cover"><div class="crm-cover-nav"></div><div class="crm-cover-side"></div><div class="crm-cover-grid"><i></i><i></i><i></i><i></i></div><div class="crm-cover-table"></div></div>` : `<img src="${project.cover}" alt="Превью проекта ${escapeHtml(project.title)}" loading="lazy">`}
        <span class="project-index">0${project.order}</span>
      </a>
      <div class="project-copy">
        <div class="project-type">${escapeHtml(project.type)}</div>
        <h3><a href="/work/${project.slug}/">${escapeHtml(project.title)}</a></h3>
        <p>${escapeHtml(project.summary)}</p>
        <div class="project-tags">${project.features.slice(0, 4).map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>
        <a class="text-link" href="/work/${project.slug}/">Открыть mini-case ${icon('arrow')}</a>
      </div>
    </article>`;
}
function renderHome() {
    document.title = 'Сергей — сайты и веб-приложения под ключ';
    root.innerHTML = `
    ${shellHeader()}
    <main class="shell-main">
      <section class="portfolio-hero">
        <div class="hero-kicker">Web design + development</div>
        <h1>Сайты и веб-приложения <em>под ключ</em></h1>
        <div class="hero-bottom">
          <p>От визуального лендинга до CRM и интернет-магазина. Проектирую интерфейс, собираю рабочий продукт и довожу его до состояния, которое можно показывать клиентам и пользователям.</p>
          <a class="hero-cta" href="/works/">Смотреть работы ${icon('arrow')}</a>
        </div>
        <div class="hero-line" aria-hidden="true"><span></span></div>
      </section>

      <section class="featured-projects" aria-labelledby="featured-title">
        <div class="section-intro"><span>01 — Selected work</span><h2 id="featured-title">Четыре разных типа продукта</h2><p>Каждый проект показывает отдельную задачу и открывается как рабочая демонстрация внутри портфолио.</p></div>
        <div class="project-list">${publicProjects.map(projectPreview).join('')}</div>
      </section>

      <section class="capabilities" id="capabilities">
        <div class="section-intro"><span>02 — Что можно разработать</span><h2>Не каталог услуг, а диапазон задач</h2></div>
        <div class="capability-grid">${capabilities.map((item, index) => `<div><span>${String(index + 1).padStart(2, '0')}</span><strong>${item}</strong></div>`).join('')}</div>
      </section>

      <section class="process-section">
        <div class="process-statement">Проект начинается не с шаблона. Сначала задача, структура и сценарий пользователя — потом визуальный язык и реализация.</div>
        <div class="process-steps">
          <article><span>01</span><h3>Разобраться</h3><p>Цель, аудитория, контент, ограничения и критерии готовности.</p></article>
          <article><span>02</span><h3>Спроектировать</h3><p>Архитектура, UX, визуальное направление и интерактивные механики.</p></article>
          <article><span>03</span><h3>Собрать</h3><p>Frontend, логика, состояния, адаптив, интеграции и reusable foundation.</p></article>
          <article><span>04</span><h3>Проверить</h3><p>Build, функциональные сценарии, mobile, accessibility и release gate.</p></article>
        </div>
      </section>

      <section class="about-section" id="about">
        <div class="about-label">03 — Сергей</div>
        <div class="about-copy"><h2>Разработка как цельный продукт, а не набор экранов.</h2><p>Работаю с сайтами и веб-приложениями: от структуры и интерфейса до интерактивной логики и выпуска. Современные AI-assisted инструменты использую как часть инженерного процесса — клиенту важен итоговый продукт, а не способ набора кода.</p><a class="text-link" href="/lab/">Посмотреть Interactive Lab ${icon('arrow')}</a></div>
      </section>

      <section class="contact-section">
        <p>Есть задача?</p><h2>Покажите, что нужно сделать.</h2><a href="https://github.com/avdeevgreyfog-cmd" target="_blank" rel="noreferrer">GitHub / avdeevgreyfog-cmd ${icon('arrow')}</a><small>Публичный контакт в текущем релизе — подтверждённый GitHub-профиль.</small>
      </section>
    </main>
    ${shellFooter()}`;
    bindShell();
}
function renderWorks() {
    document.title = 'Работы — Сергей';
    root.innerHTML = `
    ${shellHeader('works')}
    <main class="shell-main shell-main--inner">
      <section class="page-headline"><span>Работы</span><h1>Разные задачи.<br>Разный визуальный язык.</h1><p>Все четыре работы доступны не только как кейсы, но и как интерактивные demo-среды.</p></section>
      <section class="project-list project-list--works">${publicProjects.map(projectPreview).join('')}</section>
      <section class="contact-inline"><span>Нужен похожий формат?</span><a href="https://github.com/avdeevgreyfog-cmd" target="_blank" rel="noreferrer">Обсудить проект ${icon('arrow')}</a></section>
    </main>${shellFooter()}`;
    bindShell();
}
function renderWork(project) {
    document.title = `${project.title} — кейс Сергея`;
    const media = project.media.length ? project.media : [project.cover];
    root.innerHTML = `
    ${shellHeader('works')}
    <main class="case-main">
      <section class="case-hero" style="--case-accent:${project.accent}">
        <a class="case-back" href="/works/">${icon('back')} Все работы</a>
        <div class="case-title"><span>0${project.order} / ${escapeHtml(project.type)}</span><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(project.summary)}</p></div>
        <a class="case-demo-cta" href="${project.demo.route}"><span>Interactive Demo</span>${icon('arrow')}</a>
      </section>
      <section class="case-facts">
        <div><span>Задача</span><p>${escapeHtml(project.challenge)}</p></div>
        <div><span>Реализация</span><p>${escapeHtml(project.implementation)}</p></div>
      </section>
      <section class="case-feature-grid">
        ${project.features.map((f, i) => `<article><span>${String(i + 1).padStart(2, '0')}</span><h3>${escapeHtml(f)}</h3></article>`).join('')}
      </section>
      <section class="case-media ${project.slug === 'r-kadry-demo' ? 'case-media--crm' : ''}">
        ${project.slug === 'r-kadry-demo' ? `<div class="crm-case-shot">${renderCrmDashboard(false)}</div>` : media.slice(0, 3).map((url, index) => `<figure><img src="${url}" alt="${escapeHtml(project.title)} — демонстрационный экран ${index + 1}" loading="lazy"></figure>`).join('')}
      </section>
      <section class="case-tech"><div><span>Основа</span><p>${project.technologies.map(escapeHtml).join(' · ')}</p></div><a class="case-demo-large" href="${project.demo.route}">Открыть рабочее demo ${icon('arrow')}</a></section>
    </main>${shellFooter()}`;
    bindShell();
}
function demoToolbar(project) {
    return `<div class="demo-toolbar" data-demo-toolbar>
    <a href="/work/${project.slug}/" class="demo-exit">${icon('back')} Portfolio</a>
    <div class="demo-name"><strong>${escapeHtml(project.title)}</strong><span>${escapeHtml(project.type)}</span></div>
    <div class="viewport-controls" aria-label="Размер демонстрации"><button type="button" data-viewport="desktop" class="is-active">Desktop</button><button type="button" data-viewport="tablet">Tablet</button><button type="button" data-viewport="mobile">Mobile</button></div>
  </div>`;
}
function renderDemo(project) {
    document.title = `${project.title} — Interactive Demo`;
    let content = '';
    if (project.slug === 'raznye-ludi')
        content = renderRaznyeDemo();
    if (project.slug === 'b2b-engineering')
        content = renderB2BDemo();
    if (project.slug === 'design-light-store')
        content = renderShopDemo();
    if (project.slug === 'r-kadry-demo')
        content = renderCrmDemo();
    root.innerHTML = `${demoToolbar(project)}<div class="demo-stage" data-demo-stage>${content}</div>`;
    bindDemoToolbar();
    if (project.slug === 'raznye-ludi')
        bindRaznyeDemo();
    if (project.slug === 'b2b-engineering')
        bindB2BDemo();
    if (project.slug === 'design-light-store')
        bindShopDemo();
    if (project.slug === 'r-kadry-demo')
        bindCrmDemo();
}
function renderRaznyeDemo() {
    const base = 'https://raw.githubusercontent.com/avdeevgreyfog-cmd/raznye-ludi-site/main/assets';
    return `<div class="raznye-demo">
    <header class="rz-nav"><a href="#rz-top" class="rz-logo">РАЗНЫЕ / ЛЮДИ</a><nav><a href="#rz-about">Команда</a><a href="#rz-actions">Что делаем</a><a href="#rz-join">Как попасть</a></nav><a href="#rz-join" class="rz-join">На тренировку</a></header>
    <section class="rz-hero" id="rz-top">
      <video autoplay loop muted playsinline preload="metadata" poster="${base}/scene_01.webp"><source src="${base}/final_hero.mp4" type="video/mp4"></video>
      <div class="rz-overlay"></div>
      <div class="rz-hero-copy"><span>Страйкбольная команда</span><h1>Разные<br>люди</h1><p>Тренируемся, участвуем в играх и выездах, развиваем командное взаимодействие.</p><a href="#rz-join">Хочу на тренировку ${icon('arrow')}</a></div>
      <div class="rz-scroll">Листай дальше ↓</div>
    </section>
    <section class="rz-split" id="rz-about"><div class="rz-photo" data-reveal><img src="${base}/scene_01.webp" alt="Команда в лесу"></div><div class="rz-copy"><span>О команде</span><h2>Одна команда.<br>Разные люди.</h2><p>Тёмная фотографичная композиция строится вокруг реального контента, а не декоративных UI-паттернов.</p><div class="rz-mini"><i>Тренировки</i><i>Игры</i><i>Выезды</i></div></div></section>
    <section class="rz-actions" id="rz-actions"><div class="rz-section-title"><span>Направления</span><h2>Что<br>делаем</h2></div><div class="rz-cards">
      ${[['scene_02.webp', '01', 'Тренировки'], ['scene_04.webp', '02', 'Игры'], ['scene_06.webp', '03', 'Выезды'], ['scene_03.webp', '04', 'Подготовка']].map(([img, n, title]) => `<article><img src="${base}/${img}" alt=""><div><span>${n}</span><h3>${title}</h3><p>Короткий маршрут в нужное направление без перегрузки главной.</p></div></article>`).join('')}
    </div></section>
    <section class="rz-gear"><img src="${base}/gear/loadout-01.webp" alt="Экипировка бойца" loading="lazy"><div><span>Снаряжение</span><h2>Разобрать<br>комплект</h2><p>Интерактивный visual-story: экипировка раскрывается слоями при движении по странице.</p><div class="rz-loadout" data-loadout><button data-loadout-step="0" class="active">Защита</button><button data-loadout-step="1">Разгрузка</button><button data-loadout-step="2">Связь</button><button data-loadout-step="3">Мобильность</button></div><div class="rz-hud" data-rz-hud>Шлем / очки / защита лица</div></div></section>
    <section class="rz-join-section" id="rz-join"><span>Первый шаг</span><h2>Посмотреть команду в деле.</h2><form class="rz-form" data-demo-form novalidate><label>Имя<input name="name" autocomplete="name" required placeholder="Как к вам обращаться"></label><label>Контакт<input name="contact" required placeholder="Telegram или телефон"></label><button type="submit">Оставить demo-заявку ${icon('arrow')}</button><p class="form-message" data-form-message aria-live="polite"></p></form><small>Форма демонстрационная и никуда не отправляет данные.</small></section>
  </div>`;
}
function renderB2BDemo() {
    return `<div class="b2b-demo">
    <header class="b2b-nav"><a href="#b2b-top" class="b2b-brand"><span>V</span><strong>VECTOR</strong><small>engineering</small></a><nav><a href="#services">Услуги</a><a href="#objects">Объекты</a><a href="#process">Как работаем</a><a href="#brief">Расчёт</a></nav><a class="b2b-call" href="#brief">Получить расчёт</a></header>
    <main>
      <section class="b2b-hero" id="b2b-top"><div class="b2b-hero-copy"><div class="b2b-eyebrow">Инженерные системы для коммерческих и промышленных объектов</div><h1>Проектируем. Монтируем. <em>Отвечаем за результат.</em></h1><p>Вентиляция, кондиционирование, отопление и автоматизация — единый подрядчик от обследования до сервисного обслуживания.</p><div class="b2b-actions"><a href="#brief">Рассчитать проект</a><a href="#objects">Посмотреть объекты</a></div><div class="b2b-trust"><span>Проектирование</span><span>Монтаж</span><span>Пусконаладка</span><span>Сервис</span></div></div><div class="b2b-hero-media"><img src="https://images.unsplash.com/photo-1776279876113-514976038186?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=72&w=2200" alt="Промышленная система вентиляции" fetchpriority="high"><div class="b2b-media-note">Demo / concept content</div></div></section>
      <section class="b2b-services" id="services"><div class="b2b-section-head"><span>01 / Услуги</span><h2>Одна инженерная команда на весь жизненный цикл системы.</h2></div><div class="b2b-service-grid">
        ${[['Вентиляция', 'Расчёт воздухообмена, проект, оборудование, монтаж и балансировка.'], ['Кондиционирование', 'VRF/VRV, чиллер-фанкойл, прецизионное и локальное охлаждение.'], ['Отопление', 'Тепловые пункты, разводка, приборы, автоматика и пусконаладка.'], ['Автоматизация', 'Шкафы управления, диспетчеризация, датчики, сценарии и мониторинг.']].map((s, i) => `<article><span>0${i + 1}</span><h3>${s[0]}</h3><p>${s[1]}</p><button type="button" data-service="${s[0]}">Уточнить задачу ${icon('arrow')}</button></article>`).join('')}
      </div></section>
      <section class="b2b-objects" id="objects"><div class="b2b-section-head"><span>02 / Объекты</span><h2>Сценарии, под которые проектируется система.</h2></div><div class="b2b-object-grid"><article><div class="engineering-visual engineering-visual--office"><i></i><i></i><i></i><i></i></div><span>Бизнес-центр / demo</span><h3>Комфортный климат при переменной загрузке этажей</h3><p>Зональное управление, учёт эксплуатации и понятная сервисная схема.</p></article><article><div class="engineering-visual engineering-visual--plant"><i></i><i></i><i></i><i></i><i></i></div><span>Производство / demo</span><h3>Воздухообмен с учётом тепловыделений и технологических зон</h3><p>Расчёт режимов, резервирование критичных участков и диспетчеризация.</p></article></div><p class="b2b-demo-note">Все названия объектов и описания в этом showcase — демонстрационные и не являются кейсами реальной компании.</p></section>
      <section class="b2b-process" id="process"><div class="b2b-section-head"><span>03 / Процесс</span><h2>Понятный маршрут от вводных до работающей системы.</h2></div><ol>${['Обследование и бриф', 'Расчёт и концепция', 'Проектирование', 'Комплектация и монтаж', 'Пусконаладка', 'Сервис'].map((x, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><strong>${x}</strong><p>${['Собираем параметры объекта и ограничения.', 'Формируем техническое решение и бюджетный диапазон.', 'Выпускаем рабочую документацию и спецификацию.', 'Организуем поставку, монтаж и контроль этапов.', 'Настраиваем режимы и передаём исполнительную документацию.', 'Поддерживаем регламент и изменения в эксплуатации.'][i]}</p></li>`).join('')}</ol></section>
      <section class="b2b-brief" id="brief"><div class="b2b-brief-copy"><span>04 / Бриф</span><h2>Получить предварительный диапазон проекта</h2><p>Выберите параметры — интерфейс сформирует демо-оценку и затем покажет форму заявки.</p><div class="b2b-estimate" data-b2b-estimate>Ориентир: от 640 000 ₽</div></div><form class="b2b-form" data-b2b-form novalidate><label>Тип объекта<select name="object"><option value="office">Офис / БЦ</option><option value="retail">Ритейл</option><option value="plant">Производство</option></select></label><label>Площадь, м²<input name="area" type="number" min="100" max="50000" value="1200" required></label><label>Что требуется<select name="scope"><option value="full">Проект + монтаж</option><option value="design">Только проект</option><option value="service">Сервис / аудит</option></select></label><label>Имя<input name="name" required placeholder="Ваше имя"></label><label>Email<input name="email" type="email" required placeholder="name@company.ru"></label><button type="submit">Получить demo-расчёт ${icon('arrow')}</button><p class="form-message" data-form-message aria-live="polite"></p><small>Для проверки error-state укажите email с словом “error”. Данные никуда не отправляются.</small></form></section>
    </main>
    <footer class="b2b-footer"><div class="b2b-brand"><span>V</span><strong>VECTOR</strong><small>demo concept</small></div><p>Демонстрационный сайт. Компания, контакты и объекты вымышлены.</p></footer>
  </div>`;
}
function renderProductCard(product) {
    return `<article class="shop-product" data-product-card="${product.id}" data-category="${product.category}" data-name="${product.name.toLowerCase()}" data-price="${product.price}">
    <button class="favorite-btn ${state.favorites.has(product.id) ? 'is-active' : ''}" type="button" data-favorite="${product.id}" aria-label="Добавить ${escapeHtml(product.name)} в избранное">${icon('heart')}</button>
    <button class="product-media" type="button" data-product-open="${product.id}" aria-label="Открыть ${escapeHtml(product.name)}"><img src="${product.image}" alt="${escapeHtml(product.imageAlt)}" loading="lazy"></button>
    <div class="product-meta"><span>${product.category} / ${product.material}</span><h3><button type="button" data-product-open="${product.id}">${product.name}</button></h3><div>${money(product.price)}</div></div>
  </article>`;
}
function renderShopDemo() {
    return `<div class="shop-demo">
    <header class="shop-nav"><a class="shop-logo" href="#shop-top">LUMA<span>OBJECTS</span></a><nav><a href="#catalog">Свет</a><a href="#story">Коллекция</a><a href="#catalog">Новинки</a></nav><div class="shop-actions"><button type="button" data-shop-search aria-label="Поиск">${icon('search')}</button><button type="button" data-shop-favorites aria-label="Избранное">${icon('heart')}<span data-fav-count>${state.favorites.size}</span></button><button type="button" data-shop-cart aria-label="Корзина">${icon('bag')}<span data-cart-count>${cartCount()}</span></button></div></header>
    <main>
      <section class="shop-hero" id="shop-top"><div class="shop-hero-copy"><span>Demo collection / 2026</span><h1>Свет как<br>часть архитектуры.</h1><p>Редакционная подача, функциональный каталог и полный demo checkout.</p><a href="#catalog">Открыть коллекцию ${icon('arrow')}</a></div><div class="shop-hero-img"><img src="${products[0].image}" alt="Скульптурная лампа Mira 01" fetchpriority="high"><div class="shop-hero-caption">Mira 01 / concept product</div></div></section>
      <section class="shop-story" id="story"><div class="story-copy"><span>Interactive light scene</span><h2>Меняйте атмосферу, а не просто цвет корпуса.</h2><p>Один premium interactive moment — демонстрация характера света. На слабых устройствах остаётся статичная композиция.</p><div class="light-controls" role="group" aria-label="Сценарий освещения"><button class="active" data-light="warm">Warm</button><button data-light="neutral">Neutral</button><button data-light="focus">Focus</button></div></div><div class="light-scene" data-light-scene><div class="scene-wall"><span></span></div><div class="scene-lamp"><i></i><b></b></div><div class="scene-table"></div></div></section>
      <section class="shop-catalog" id="catalog"><div class="catalog-head"><div><span>Каталог / demo products</span><h2>Коллекция света</h2></div><div class="catalog-tools"><label class="catalog-search">${icon('search')}<input data-catalog-search placeholder="Поиск"></label><button type="button" data-filter-toggle>${icon('filter')} Фильтры</button><select data-sort aria-label="Сортировка"><option value="default">По умолчанию</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option></select></div></div><div class="filter-row" data-filter-row><button class="active" data-category-filter="all">Все</button><button data-category-filter="Pendant">Подвесные</button><button data-category-filter="Table">Настольные</button><button data-category-filter="Floor">Напольные</button></div><div class="shop-product-grid" data-product-grid>${products.map(renderProductCard).join('')}</div><p class="catalog-empty" data-catalog-empty hidden>Ничего не найдено. Измените поиск или фильтр.</p></section>
    </main>
    <footer class="shop-footer"><div class="shop-logo">LUMA<span>OBJECTS</span></div><p>Все товары, цены и бренд — demo/concept content. Платежи не подключены.</p></footer>
    <div class="shop-drawer" data-shop-drawer hidden><button class="drawer-backdrop" type="button" data-drawer-close aria-label="Закрыть"></button><aside role="dialog" aria-modal="true" aria-label="Корзина"><div class="drawer-head"><strong data-drawer-title>Корзина</strong><button type="button" data-drawer-close>${icon('close')}</button></div><div data-drawer-body></div></aside></div>
    <div class="product-modal" data-product-modal hidden><button class="modal-backdrop" type="button" data-product-close aria-label="Закрыть"></button><div class="product-dialog" role="dialog" aria-modal="true" aria-label="Карточка товара"><button class="product-close" type="button" data-product-close>${icon('close')}</button><div data-product-dialog-body></div></div></div>
  </div>`;
}
function renderCrmDashboard(includeTitle = true) {
    return `<div class="crm-dashboard-view">${includeTitle ? `<div class="crm-page-head"><div><span>Dashboard</span><h1>Операционный обзор</h1></div><button type="button" data-crm-nav="requests">Открыть заявки ${icon('arrow')}</button></div>` : ''}<div class="crm-kpis"><article><span>Активные заявки</span><strong>12</strong><small>demo dataset</small></article><article><span>Людей в подборе</span><strong>64</strong><small>в 7 заявках</small></article><article><span>Требуют действия</span><strong>4</strong><small>сегодня</small></article><article><span>Ориентир маржи</span><strong>16.8%</strong><small>демо-расчёт</small></article></div><div class="crm-dashboard-grid"><section><div class="crm-panel-head"><strong>Заявки в работе</strong><span>Последние</span></div>${renderCrmTable(crmRequests.slice(0, 3))}</section><section class="crm-activity"><div class="crm-panel-head"><strong>Действия</strong><span>Demo</span></div><ul><li><i></i><div><b>REQ-1042</b><span>Статус: На согласовании</span></div><time>10:24</time></li><li><i></i><div><b>Север Проект</b><span>Обновлены условия заявки</span></div><time>09:40</time></li><li><i></i><div><b>REQ-1038</b><span>Расчёт сохранён</span></div><time>вчера</time></li></ul></section></div></div>`;
}
function renderCrmTable(rows = crmRequests) {
    return `<div class="crm-table-wrap"><table><thead><tr><th>ID</th><th>Клиент</th><th>Специальность</th><th>Людей</th><th>Статус</th><th></th></tr></thead><tbody>${rows.map(r => `<tr><td>${r.id}</td><td><b>${r.client}</b><small>${r.city}</small></td><td>${r.role}</td><td>${r.people}</td><td><span class="crm-status">${state.crmStatus[r.id]}</span></td><td><button type="button" data-request-open="${r.id}">${icon('arrow')}</button></td></tr>`).join('')}</tbody></table></div>`;
}
function renderCrmDemo() {
    return `<div class="crm-demo"><aside class="crm-sidebar"><a class="crm-brand" href="#"><span>Р</span><strong>Р-Кадры</strong><small>Showcase Demo</small></a><nav><button class="active" type="button" data-crm-nav="dashboard">Обзор</button><button type="button" data-crm-nav="clients">Клиенты</button><button type="button" data-crm-nav="requests">Заявки</button><button type="button" data-crm-nav="calculator">Расчёт</button></nav><div class="crm-user"><span>СД</span><div><b>Сергей</b><small>Демо-режим</small></div></div></aside><div class="crm-main"><header class="crm-top"><button class="crm-menu-button" data-crm-menu type="button">${icon('menu')}</button><label>${icon('search')}<input placeholder="Поиск по демо"></label><div class="crm-mode">SAFE DEMO DATA</div></header><main class="crm-content" data-crm-content>${renderCrmDashboard(true)}</main></div></div>`;
}
function renderLab() {
    document.title = 'Interactive Lab — Сергей';
    root.innerHTML = `${shellHeader('lab')}<main class="lab-main"><section class="page-headline"><span>Interactive Lab</span><h1>Механики, которые работают на впечатление и сценарий.</h1><p>Короткие демонстрации отдельных приёмов. В коммерческом проекте они применяются только там, где усиливают задачу.</p></section><section class="lab-grid">
    <article class="lab-card lab-video"><div class="lab-demo-area"><div class="video-scroll-scene" data-video-scroll><div class="vs-bg"></div><div class="vs-object"></div><div class="vs-copy">Сцена развивается<br>вместе с прокруткой</div></div><input type="range" min="0" max="100" value="30" data-video-range aria-label="Положение сцены"></div><div><span>01</span><h2>Интерактивное видео</h2><p>Контент привязывается к прогрессу пользователя и может объяснять продукт по шагам.</p></div></article>
    <article class="lab-card lab-story"><div class="lab-demo-area"><div class="story-stack" data-story-stack><div>Сцена 01</div><div>Сцена 02</div><div>Сцена 03</div></div><button type="button" data-story-next>Следующая сцена ${icon('arrow')}</button></div><div><span>02</span><h2>Scroll storytelling</h2><p>История раскрывается последовательными композициями, а не длинной стеной текста.</p></div></article>
    <article class="lab-card lab-3d"><div class="lab-demo-area"><div class="lab-product-3d" data-3d-object><i></i><b></b></div><input type="range" min="-50" max="50" value="0" data-3d-range aria-label="Поворот 3D-объекта"></div><div><span>03</span><h2>3D-презентация товара</h2><p>Пользователь сам меняет угол обзора. Здесь — лёгкий CSS prototype без тяжёлого WebGL.</p></div></article>
    <article class="lab-card lab-type"><div class="lab-demo-area"><div class="kinetic-type" data-kinetic>MOVE<br>WITH<br>ME</div><input type="range" min="0" max="100" value="20" data-type-range aria-label="Положение типографики"></div><div><span>04</span><h2>Кинетическая типографика</h2><p>Текст становится частью движения и визуального ритма страницы.</p></div></article>
    <article class="lab-card lab-reveal"><div class="lab-demo-area"><div class="reveal-demo" data-reveal-demo><img src="https://raw.githubusercontent.com/avdeevgreyfog-cmd/raznye-ludi-site/main/assets/scene_04.webp" alt="Лесная сцена"><div></div></div><input type="range" min="10" max="100" value="54" data-reveal-range aria-label="Раскрытие изображения"></div><div><span>05</span><h2>Image reveal / parallax</h2><p>Изображение раскрывается управляемо и поддерживает драматургию блока.</p></div></article>
    <article class="lab-card lab-transition"><div class="lab-demo-area"><div class="transition-panels" data-transition-panels><section class="active"><span>A</span><p>Главная</p></section><section><span>B</span><p>Проект</p></section></div><button type="button" data-transition-toggle>Перейти на другой экран ${icon('arrow')}</button></div><div><span>06</span><h2>Page transition / microinteractions</h2><p>Переход между состояниями помогает сохранить контекст и ощущение цельного продукта.</p></div></article>
  </section></main>${shellFooter()}`;
    bindShell();
    bindLab();
}
function bindShell() {
    const toggle = document.querySelector('[data-menu-toggle]');
    const nav = document.querySelector('[data-shell-nav]');
    toggle?.addEventListener('click', () => {
        const open = nav?.classList.toggle('is-open') ?? false;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.innerHTML = open ? icon('close') : icon('menu');
    });
    const header = document.querySelector('[data-shell-header]');
    window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 24), { passive: true });
}
function bindDemoToolbar() {
    const stage = document.querySelector('[data-demo-stage]');
    document.querySelectorAll('[data-viewport]').forEach(button => button.addEventListener('click', () => {
        document.querySelectorAll('[data-viewport]').forEach(b => b.classList.remove('is-active'));
        button.classList.add('is-active');
        const viewport = button.dataset.viewport;
        stage?.classList.remove('viewport-desktop', 'viewport-tablet', 'viewport-mobile');
        stage?.classList.add(`viewport-${viewport}`);
    }));
}
function bindRaznyeDemo() {
    const hud = document.querySelector('[data-rz-hud]');
    const labels = ['Шлем / очки / защита лица', 'Плитоносец / подсумки / магазины', 'Рация / гарнитура / PTT', 'Пояс / рюкзак / вспомогательное снаряжение'];
    document.querySelectorAll('[data-loadout-step]').forEach(btn => btn.addEventListener('click', () => {
        document.querySelectorAll('[data-loadout-step]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (hud)
            hud.textContent = labels[Number(btn.dataset.loadoutStep)];
    }));
    const form = document.querySelector('[data-demo-form]');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = form.querySelector('[data-form-message]');
        if (!form.checkValidity()) {
            form.reportValidity();
            if (msg) {
                msg.textContent = 'Заполните имя и контакт.';
                msg.className = 'form-message error';
            }
            return;
        }
        const submit = form.querySelector('button[type=submit]');
        submit.disabled = true;
        submit.textContent = 'Отправляем…';
        await delay(650);
        submit.disabled = false;
        submit.innerHTML = `Готово ${icon('check')}`;
        if (msg) {
            msg.textContent = 'Demo-заявка обработана локально. Ничего не отправлено.';
            msg.className = 'form-message success';
        }
    });
}
function bindB2BDemo() {
    const form = document.querySelector('[data-b2b-form]');
    const estimate = document.querySelector('[data-b2b-estimate]');
    const recalc = () => {
        if (!form || !estimate)
            return;
        const data = new FormData(form);
        const area = Math.max(100, Number(data.get('area')) || 100);
        const scope = String(data.get('scope'));
        const object = String(data.get('object'));
        const baseRate = object === 'plant' ? 920 : object === 'retail' ? 660 : 540;
        const factor = scope === 'full' ? 1 : scope === 'design' ? .22 : .14;
        const value = Math.round(area * baseRate * factor / 10000) * 10000;
        estimate.textContent = `Ориентир: от ${money(value)}`;
    };
    form?.querySelectorAll('select,input[name=area]').forEach(el => el.addEventListener('input', recalc));
    recalc();
    document.querySelectorAll('[data-service]').forEach(btn => btn.addEventListener('click', () => { document.querySelector('#brief')?.scrollIntoView({ behavior: 'smooth' }); const scope = form?.querySelector('select[name=scope]'); if (scope) {
        scope.value = 'full';
        recalc();
    } }));
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = form.querySelector('[data-form-message]');
        if (!form.checkValidity()) {
            form.reportValidity();
            if (msg) {
                msg.textContent = 'Проверьте обязательные поля.';
                msg.className = 'form-message error';
            }
            return;
        }
        const email = form.elements.namedItem('email').value;
        const button = form.querySelector('button[type=submit]');
        button.disabled = true;
        button.textContent = 'Считаем…';
        await delay(750);
        button.disabled = false;
        if (email.toLowerCase().includes('error')) {
            button.innerHTML = `Повторить ${icon('arrow')}`;
            if (msg) {
                msg.textContent = 'Demo error-state: расчёт временно недоступен. Попробуйте ещё раз.';
                msg.className = 'form-message error';
            }
            return;
        }
        button.innerHTML = `Готово ${icon('check')}`;
        if (msg) {
            msg.textContent = `Demo-расчёт сформирован: ${estimate?.textContent?.replace('Ориентир: ', '')}. Заявка не отправлялась.`;
            msg.className = 'form-message success';
        }
    });
}
function cartCount() { return Object.values(state.cart).reduce((sum, qty) => sum + qty, 0); }
function cartTotal() { return products.reduce((sum, p) => sum + (state.cart[p.id] || 0) * p.price, 0); }
function bindShopDemo() {
    bindShopCatalog();
    bindShopActions();
    bindProductButtons();
    bindLightScene();
    updateShopCounters();
}
function bindShopCatalog() {
    const grid = document.querySelector('[data-product-grid]');
    const search = document.querySelector('[data-catalog-search]');
    const sort = document.querySelector('[data-sort]');
    const empty = document.querySelector('[data-catalog-empty]');
    let category = 'all';
    const apply = () => {
        if (!grid)
            return;
        const query = (search?.value || '').trim().toLowerCase();
        let items = [...products].filter(p => (category === 'all' || p.category === category) && (!query || p.name.toLowerCase().includes(query) || p.material.toLowerCase().includes(query)));
        if (sort?.value === 'price-asc')
            items.sort((a, b) => a.price - b.price);
        if (sort?.value === 'price-desc')
            items.sort((a, b) => b.price - a.price);
        grid.innerHTML = items.map(renderProductCard).join('');
        if (empty)
            empty.hidden = items.length > 0;
        bindProductButtons();
    };
    search?.addEventListener('input', apply);
    sort?.addEventListener('change', apply);
    document.querySelectorAll('[data-category-filter]').forEach(btn => btn.addEventListener('click', () => { category = btn.dataset.categoryFilter; document.querySelectorAll('[data-category-filter]').forEach(b => b.classList.remove('active')); btn.classList.add('active'); apply(); }));
    document.querySelector('[data-filter-toggle]')?.addEventListener('click', () => document.querySelector('[data-filter-row]')?.classList.toggle('is-open'));
}
function bindProductButtons() {
    document.querySelectorAll('[data-favorite]').forEach(btn => { btn.onclick = () => { const id = btn.dataset.favorite; state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id); btn.classList.toggle('is-active', state.favorites.has(id)); updateShopCounters(); }; });
    document.querySelectorAll('[data-product-open]').forEach(btn => { btn.onclick = () => openProduct(btn.dataset.productOpen); });
}
function updateShopCounters() { document.querySelectorAll('[data-fav-count]').forEach(el => el.textContent = String(state.favorites.size)); document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = String(cartCount())); }
function openProduct(id) { const p = products.find(x => x.id === id); const modal = document.querySelector('[data-product-modal]'); const body = document.querySelector('[data-product-dialog-body]'); if (!p || !modal || !body)
    return; body.innerHTML = `<div class="product-detail-media"><img src="${p.image}" alt="${escapeHtml(p.imageAlt)}"></div><div class="product-detail-copy"><span>${p.category} / Demo product</span><h2>${p.name}</h2><p>${p.description}</p><div class="product-price">${money(p.price)}</div><fieldset><legend>Цвет</legend>${p.colors.map((c, i) => `<label><input type="radio" name="color" value="${c}" ${i === 0 ? 'checked' : ''}><span>${c}</span></label>`).join('')}</fieldset><button type="button" data-add-cart="${p.id}">Добавить в корзину ${icon('bag')}</button><small>Товар и цена демонстрационные.</small></div>`; modal.hidden = false; document.body.classList.add('modal-open'); body.querySelector('[data-add-cart]')?.addEventListener('click', () => { state.cart[p.id] = (state.cart[p.id] || 0) + 1; updateShopCounters(); body.querySelector('[data-add-cart]').innerHTML = `Добавлено ${icon('check')}`; }); document.querySelectorAll('[data-product-close]').forEach(el => el.onclick = () => closeProduct()); }
function closeProduct() { const modal = document.querySelector('[data-product-modal]'); if (modal)
    modal.hidden = true; document.body.classList.remove('modal-open'); }
function bindShopActions() { document.querySelector('[data-shop-cart]')?.addEventListener('click', () => openDrawer('cart')); document.querySelector('[data-shop-favorites]')?.addEventListener('click', () => openDrawer('favorites')); document.querySelector('[data-shop-search]')?.addEventListener('click', () => { document.querySelector('#catalog')?.scrollIntoView({ behavior: 'smooth' }); setTimeout(() => document.querySelector('[data-catalog-search]')?.focus(), 500); }); document.querySelectorAll('[data-drawer-close]').forEach(el => el.onclick = () => closeDrawer()); }
function openDrawer(mode) { const drawer = document.querySelector('[data-shop-drawer]'); const title = document.querySelector('[data-drawer-title]'); const body = document.querySelector('[data-drawer-body]'); if (!drawer || !body || !title)
    return; title.textContent = mode === 'cart' ? 'Корзина' : 'Избранное'; drawer.hidden = false; document.body.classList.add('modal-open'); if (mode === 'favorites') {
    const fav = products.filter(p => state.favorites.has(p.id));
    body.innerHTML = fav.length ? `<div class="drawer-products">${fav.map(p => `<article><img src="${p.image}" alt=""><div><b>${p.name}</b><span>${money(p.price)}</span><button type="button" data-product-open="${p.id}">Открыть</button></div></article>`).join('')}</div>` : `<div class="drawer-empty">В избранном пока ничего нет.</div>`;
    bindProductButtons();
    return;
} renderCartDrawer(body); }
function renderCartDrawer(body) { const entries = products.filter(p => state.cart[p.id]); body.innerHTML = entries.length ? `<div class="drawer-products">${entries.map(p => `<article><img src="${p.image}" alt=""><div><b>${p.name}</b><span>${money(p.price)} · ${state.cart[p.id]} шт.</span><div class="qty"><button type="button" data-qty="minus" data-id="${p.id}">${icon('minus')}</button><strong>${state.cart[p.id]}</strong><button type="button" data-qty="plus" data-id="${p.id}">${icon('plus')}</button></div></div></article>`).join('')}</div><div class="cart-total"><span>Итого</span><strong>${money(cartTotal())}</strong><button type="button" data-checkout>Перейти к checkout ${icon('arrow')}</button><small>Оплата не подключена.</small></div>` : `<div class="drawer-empty">Корзина пуста.</div>`; body.querySelectorAll('[data-qty]').forEach(btn => btn.onclick = () => { const id = btn.dataset.id; if (btn.dataset.qty === 'plus')
    state.cart[id] = (state.cart[id] || 0) + 1;
else
    state.cart[id] = Math.max(0, (state.cart[id] || 0) - 1); updateShopCounters(); renderCartDrawer(body); }); body.querySelector('[data-checkout]')?.addEventListener('click', () => renderCheckout(body)); }
function renderCheckout(body) { body.innerHTML = `<form class="checkout-form" data-checkout-form novalidate><div class="checkout-step">Checkout / Demo</div><h2>Данные для доставки</h2><label>Имя<input name="name" required autocomplete="name"></label><label>Email<input name="email" type="email" required autocomplete="email"></label><label>Город<input name="city" required></label><label>Адрес<input name="address" required autocomplete="street-address"></label><div class="checkout-summary"><span>Сумма</span><strong>${money(cartTotal())}</strong></div><button type="submit">Подтвердить demo-заказ ${icon('arrow')}</button><p class="form-message" data-form-message aria-live="polite"></p><small>Платёжные данные не запрашиваются. Транзакция не выполняется.</small></form>`; const form = body.querySelector('[data-checkout-form]'); form.addEventListener('submit', async (e) => { e.preventDefault(); const msg = form.querySelector('[data-form-message]'); if (!form.checkValidity()) {
    form.reportValidity();
    if (msg) {
        msg.textContent = 'Заполните поля доставки.';
        msg.className = 'form-message error';
    }
    return;
} const btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Создаём demo-заказ…'; await delay(800); state.cart = {}; updateShopCounters(); body.innerHTML = `<div class="checkout-success">${icon('check')}<span>Demo order complete</span><h2>Заказ создан локально.</h2><p>Никаких платежей и реальных заявок не было. Корзина очищена, сценарий завершён.</p><button type="button" data-drawer-close-finish>Вернуться в каталог</button></div>`; body.querySelector('[data-drawer-close-finish]')?.addEventListener('click', () => { closeDrawer(); document.querySelector('#catalog')?.scrollIntoView({ behavior: 'smooth' }); }); }); }
function closeDrawer() { const drawer = document.querySelector('[data-shop-drawer]'); if (drawer)
    drawer.hidden = true; document.body.classList.remove('modal-open'); }
function bindLightScene() { const scene = document.querySelector('[data-light-scene]'); document.querySelectorAll('[data-light]').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('[data-light]').forEach(b => b.classList.remove('active')); btn.classList.add('active'); scene?.setAttribute('data-mode', btn.dataset.light); })); }
function bindCrmDemo() { bindCrmNavigation(); document.querySelector('[data-crm-menu]')?.addEventListener('click', () => document.querySelector('.crm-sidebar')?.classList.toggle('is-open')); }
function bindCrmNavigation() { document.querySelectorAll('[data-crm-nav]').forEach(btn => btn.onclick = () => renderCrmView(btn.dataset.crmNav)); document.querySelectorAll('[data-request-open]').forEach(btn => btn.onclick = () => renderRequestDetail(btn.dataset.requestOpen)); }
function activateCrmNav(view) { document.querySelectorAll('[data-crm-nav]').forEach(b => b.classList.toggle('active', b.dataset.crmNav === view)); document.querySelector('.crm-sidebar')?.classList.remove('is-open'); }
function renderCrmView(view) { const content = document.querySelector('[data-crm-content]'); if (!content)
    return; activateCrmNav(view); if (view === 'dashboard')
    content.innerHTML = renderCrmDashboard(true); if (view === 'clients')
    content.innerHTML = `<div class="crm-page-head"><div><span>Клиенты</span><h1>Клиентская база</h1></div><button type="button">+ Новый клиент</button></div><div class="crm-client-grid">${[['Север Проект', 'Москва', '2 активные заявки'], ['Альта Сервис', 'Подольск', '1 черновик'], ['Пром Лайн', 'Калуга', '3 объекта'], ['Логика Склад', 'Домодедово', 'архив']].map((c, i) => `<article><span>${String(i + 1).padStart(2, '0')}</span><h3>${c[0]}</h3><p>${c[1]}</p><small>${c[2]}</small></article>`).join('')}</div>`; if (view === 'requests')
    content.innerHTML = `<div class="crm-page-head"><div><span>Заявки</span><h1>Рабочие заявки</h1></div><div class="crm-filter"><input data-crm-filter placeholder="Фильтр по клиенту или роли"><select data-status-filter><option value="all">Все статусы</option>${['Черновик', 'На согласовании', 'Согласован', 'Отказ'].map(x => `<option>${x}</option>`).join('')}</select></div></div><div data-crm-table-host>${renderCrmTable()}</div>`; if (view === 'calculator')
    content.innerHTML = renderCalculator(); bindCrmNavigation(); if (view === 'requests')
    bindCrmFilters(); if (view === 'calculator')
    bindCalculator(); }
function bindCrmFilters() { const input = document.querySelector('[data-crm-filter]'); const select = document.querySelector('[data-status-filter]'); const host = document.querySelector('[data-crm-table-host]'); const apply = () => { const q = (input?.value || '').toLowerCase(); const s = select?.value || 'all'; const rows = crmRequests.filter(r => (!q || r.client.toLowerCase().includes(q) || r.role.toLowerCase().includes(q)) && (s === 'all' || state.crmStatus[r.id] === s)); if (host)
    host.innerHTML = rows.length ? renderCrmTable(rows) : `<div class="crm-empty">По фильтру ничего не найдено.</div>`; bindCrmNavigation(); }; input?.addEventListener('input', apply); select?.addEventListener('change', apply); }
function renderRequestDetail(id) { const r = crmRequests.find(x => x.id === id); const content = document.querySelector('[data-crm-content]'); if (!r || !content)
    return; activateCrmNav('requests'); content.innerHTML = `<button class="crm-back" type="button" data-crm-nav="requests">${icon('back')} К заявкам</button><div class="crm-request-head"><div><span>${r.id} · ${r.date}</span><h1>${r.client}</h1><p>${r.role} · ${r.city} · ${r.people} человек</p></div><label>Статус<select data-request-status="${r.id}">${['Черновик', 'На согласовании', 'Согласован', 'Отказ'].map(x => `<option ${state.crmStatus[r.id] === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label></div><div class="crm-request-grid"><section><h2>Условия</h2><dl><div><dt>Ставка сотруднику</dt><dd>${r.wage} ₽/ч</dd></div><div><dt>Численность</dt><dd>${r.people}</dd></div><div><dt>График</dt><dd>6/1 · 11 оплачиваемых часов</dd></div><div><dt>Проживание</dt><dd>Включить в расчёт</dd></div></dl></section><section><h2>Быстрый расчёт</h2><p>Перейдите в калькулятор, чтобы проверить коммерческую ставку для этой заявки.</p><button type="button" data-crm-nav="calculator">Открыть расчёт ${icon('arrow')}</button></section></div>`; content.querySelector('[data-request-status]')?.addEventListener('change', e => { state.crmStatus[r.id] = e.target.value; }); bindCrmNavigation(); }
function renderCalculator() { return `<div class="crm-page-head"><div><span>Расчёт</span><h1>Экономика ставки</h1><p>Упрощённая showcase-модель без реальных финансовых данных.</p></div></div><div class="crm-calc-grid"><form data-crm-calc><label>Зарплата на руки, ₽/ч<input name="wage" type="number" min="200" max="2000" value="420"></label><label>Оплачиваемых часов в смену<input name="hours" type="number" min="4" max="16" value="11"></label><label>Налоговая и обязательная нагрузка, %<input name="tax" type="number" min="0" max="80" value="34"></label><label>Проживание, ₽/смена<input name="housing" type="number" min="0" max="5000" value="400"></label><label>Целевая маржа, %<input name="margin" type="number" min="0" max="50" value="15"></label></form><section class="calc-result" data-calc-result></section></div>`; }
function bindCalculator() { const form = document.querySelector('[data-crm-calc]'); const result = document.querySelector('[data-calc-result]'); const calc = () => { if (!form || !result)
    return; const d = new FormData(form); const wage = Number(d.get('wage')) || 0, hours = Number(d.get('hours')) || 1, tax = (Number(d.get('tax')) || 0) / 100, housing = Number(d.get('housing')) || 0, margin = (Number(d.get('margin')) || 0) / 100; const labour = wage * (1 + tax); const housingHourly = housing / hours; const cost = labour + housingHourly; const client = margin >= .95 ? cost : cost / (1 - margin); const day = client * hours; result.innerHTML = `<span>Рекомендуемая ставка</span><strong>${Math.round(client)} ₽/ч</strong><p>${money(Math.round(day))} за смену</p><dl><div><dt>Затраты с нагрузкой</dt><dd>${Math.round(labour)} ₽/ч</dd></div><div><dt>Проживание</dt><dd>${Math.round(housingHourly)} ₽/ч</dd></div><div><dt>Целевая маржа</dt><dd>${Math.round(margin * 100)}%</dd></div></dl><small>Демо-формула предназначена только для демонстрации интерфейса.</small>`; }; form?.querySelectorAll('input').forEach(i => i.addEventListener('input', calc)); calc(); }
function bindLab() { const videoRange = document.querySelector('[data-video-range]'); const video = document.querySelector('[data-video-scroll]'); videoRange?.addEventListener('input', () => video?.style.setProperty('--progress', videoRange.value)); video?.style.setProperty('--progress', videoRange?.value || '30'); let story = 0; document.querySelector('[data-story-next]')?.addEventListener('click', () => { story = (story + 1) % 3; document.querySelectorAll('[data-story-stack] > div').forEach((el, i) => el.classList.toggle('active', i === story)); }); document.querySelectorAll('[data-story-stack] > div')[0]?.classList.add('active'); const r3 = document.querySelector('[data-3d-range]'); const o3 = document.querySelector('[data-3d-object]'); r3?.addEventListener('input', () => o3?.style.setProperty('--rot', `${r3.value}deg`)); const tr = document.querySelector('[data-type-range]'); const kt = document.querySelector('[data-kinetic]'); tr?.addEventListener('input', () => kt?.style.setProperty('--move', `${Number(tr.value) - 50}px`)); const rr = document.querySelector('[data-reveal-range]'); const rd = document.querySelector('[data-reveal-demo]'); rr?.addEventListener('input', () => rd?.style.setProperty('--reveal', `${rr.value}%`)); const panels = document.querySelectorAll('[data-transition-panels] section'); document.querySelector('[data-transition-toggle]')?.addEventListener('click', () => panels.forEach(p => p.classList.toggle('active'))); }
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
function route() {
    const workMatch = currentPath.match(/^\/work\/([^/]+)\/?$/);
    const demoMatch = currentPath.match(/^\/demo\/([^/]+)\/?$/);
    if (currentPath === '/works/' || currentPath === '/works')
        return renderWorks();
    if (currentPath === '/lab/' || currentPath === '/lab')
        return renderLab();
    if (workMatch) {
        const p = publicProjects.find(x => x.slug === workMatch[1]);
        if (p)
            return renderWork(p);
    }
    if (demoMatch) {
        const p = publicProjects.find(x => x.slug === demoMatch[1]);
        if (p)
            return renderDemo(p);
    }
    renderHome();
}
route();
applyInternalBasePath();
