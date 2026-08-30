import fs from 'node:fs';
import path from 'node:path';

const esc=(v)=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

export function applyV6Layout({out,basePath='',projects=[]}){
  const href=(p)=>`${basePath}${p.startsWith('/')?p:`/${p}`}`||'/';
  const read=(rel)=>fs.readFileSync(path.join(out,rel),'utf8');
  const write=(rel,html)=>fs.writeFileSync(path.join(out,rel),html);
  const replaceMain=(html,main)=>html.replace(/<main id="main">[\s\S]*?<\/main>/,main);
  const inject=(html,bodyClass)=>{
    html=html.replace(/<link rel="stylesheet" href="[^"]*\/assets\/css\/v5\.css">/g,'');
    if(!html.includes('/assets/css/v6.css')) html=html.replace('</head>',`<link rel="stylesheet" href="${href('/assets/css/v6.css')}"></head>`);
    return html.replace(/<body class="[^"]*">/,`<body class="${bodyClass}">`);
  };
  const project=projects[0];
  const demo=project?.demoRoute||'/demo/raznye-ludi/';

  const homeMain=`<main id="main" class="v6-main">
    <section class="v6-hero"><div class="shell">
      <div class="v6-hero__meta"><span>Сергей Авдеев</span><span>Независимый веб-разработчик</span></div>
      <div class="v6-hero__grid"><h1>Сайты и веб-приложения<br><span>под ключ.</span></h1><div class="v6-hero__copy"><p>Проектирую и разрабатываю сайты для бизнеса — от структуры и визуального направления до рабочей версии и запуска.</p><p>Можно прийти с идеей, техническим заданием или готовым макетом.</p><div class="v6-actions"><a class="v6-button v6-button--dark" href="${href('/works/')}">Смотреть работы</a><a class="v6-button" href="${href('/contact/')}">Обсудить проект</a></div></div></div>
      <div class="v6-trust-strip"><div><span>Формат</span><strong>Работа напрямую со мной</strong></div><div><span>Старт</span><strong>Идея, ТЗ или готовый дизайн</strong></div><div><span>Результат</span><strong>Рабочий продукт и запуск</strong></div></div>
    </div></section>

    <section class="v6-section v6-about"><div class="shell v6-section-grid"><div class="v6-label">Обо мне</div><div><h2>Веду проект целиком — без передачи между дизайнером, разработчиком и менеджером.</h2><div class="v6-copy-cols"><p>Сначала разбираюсь в задаче и пользовательском маршруте. Затем собираю структуру, визуальную систему и рабочий интерфейс.</p><p>Если дизайн уже готов, подключаюсь на этапе разработки. Если нет — могу самостоятельно пройти путь от идеи до опубликованного сайта.</p></div></div></div></section>

    <section class="v6-section v6-services-home"><div class="shell"><div class="v6-section-head"><div class="v6-label">Что разрабатываю</div><p>Формат выбирается под бизнес-задачу, а не под готовый шаблон.</p></div><div class="v6-service-rows">
      ${[
        ['01','Лендинги','Для запуска услуги, продукта, события или рекламного предложения.'],
        ['02','Корпоративные сайты','Для компаний, команд и сервисов, которым нужен понятный цифровой образ.'],
        ['03','Интернет-магазины','Каталог, карточки товара, корзина, checkout и необходимые интеграции.'],
        ['04','Веб-приложения','Личные кабинеты, CRM-подобные системы и внутренние рабочие интерфейсы.']
      ].map(([n,t,d])=>`<a class="v6-service-row" href="${href('/services/')}"><span>${n}</span><h3>${t}</h3><p>${d}</p><b>↗</b></a>`).join('')}
    </div><div class="v6-secondary-skill"><span>Дополнительно</span><p>Motion, storytelling, video-scroll и нестандартные взаимодействия — когда они действительно усиливают задачу.</p></div></div></section>

    <section class="v6-section v6-process-home"><div class="shell"><div class="v6-section-head"><div class="v6-label">Как проходит работа</div><p>Процесс нужен не ради методологии, а чтобы заранее понимать, что произойдёт после первого сообщения.</p></div><div class="v6-process-list">
      ${[
        ['01','Обсуждаем задачу','Вы присылаете вводные. Я уточняю цель, аудиторию, страницы и ограничения.'],
        ['02','Фиксируем рамки','Определяем состав работ, формат результата и порядок согласования.'],
        ['03','Проектирую и собираю','Показываю промежуточные решения, затем довожу интерфейс и логику до рабочей версии.'],
        ['04','Проверяем и запускаем','Тестирую ключевые сценарии, адаптив и публикую готовый сайт.']
      ].map(([n,t,d])=>`<div class="v6-process-row"><span>${n}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}
    </div><a class="v6-text-link" href="${href('/process/')}">Подробнее о процессе →</a></div></section>

    <section class="v6-work-gateway"><div class="shell"><div class="v6-label">Портфолио</div><div><h2>Работы собраны отдельно.</h2><p>Выберите направление, откройте конкретный кейс и при необходимости перейдите в живую версию сайта.</p><a class="v6-button v6-button--light" href="${href('/works/')}">Перейти к работам</a></div></div></section>
    <section class="v6-contact-cta"><div class="shell"><div class="v6-label">Новый проект</div><div><h2>Есть задача по сайту<br>или веб-приложению?</h2><a href="${href('/contact/')}">Обсудить проект <span>↗</span></a></div></div></section>
  </main>`;
  write('index.html',inject(replaceMain(read('index.html'),homeMain),'v6-page v6-home-page'));

  const cats=['Все','Лендинги','Корпоративные сайты','Интернет-магазины','Веб-приложения'];
  const count=(cat)=>cat==='Все'?projects.length:projects.filter(p=>p.category===cat).length;
  const filters=`<div class="v6-filters" data-work-filters aria-label="Фильтр работ">${cats.map((c,i)=>`<button type="button" data-filter="${esc(c)}" aria-pressed="${i===0}"><span>${esc(c)}</span><sup>${String(count(c)).padStart(2,'0')}</sup></button>`).join('')}</div>`;
  const projectRows=projects.map((p,i)=>`<article class="v6-project" data-project-category="${esc(p.category)}">
    <a class="v6-project__media" href="${href(`/work/${p.slug}/`)}"><img src="${href('/assets/img/raznye-ludi-ui.webp')}" alt="Интерфейс проекта ${esc(p.title)}" loading="${i?'lazy':'eager'}"><span>Кейс ↗</span></a>
    <div class="v6-project__info"><div class="v6-project__meta"><span>${esc(p.category)}</span><span>${p.year}</span></div><h2>${esc(p.title)}</h2><p>Интерактивный сайт страйкбольной команды: структура, визуальная система, frontend, motion и адаптивная версия.</p><dl><div><dt>Моя роль</dt><dd>UX / дизайн / frontend / motion</dd></div><div><dt>Формат</dt><dd>${esc(p.type)}</dd></div></dl><div class="v6-project__actions"><a href="${href(`/work/${p.slug}/`)}">Посмотреть кейс →</a><a href="${href(p.demoRoute)}">Открыть сайт ↗</a></div></div>
  </article>`).join('');
  const worksMain=`<main id="main" class="v6-main"><section class="v6-works-hero"><div class="shell"><div class="v6-hero__meta"><span>Портфолио</span><span>${String(projects.length).padStart(2,'0')} опубликованный проект</span></div><div class="v6-works-title"><h1>Работы</h1><p>Каталог реальных проектов. Выберите направление, затем откройте кейс или живую версию.</p></div>${filters}</div></section><section class="v6-projects"><div class="shell"><div class="v6-project-list">${projectRows}</div><div class="v6-empty" data-work-empty hidden><h2>Пока без опубликованных проектов.</h2><p>Категория уже предусмотрена в структуре портфолио; новые работы появятся здесь по мере публикации.</p></div></div></section></main>`;
  write('works/index.html',inject(replaceMain(read('works/index.html'),worksMain),'v6-page v6-works-page'));

  if(project){
    const caseMain=`<main id="main" class="v6-main"><section class="v6-case-hero"><div class="shell"><div class="v6-hero__meta"><span>${esc(project.category)}</span><span>${project.year}</span></div><div class="v6-case-title"><div><h1>${esc(project.title)}</h1><p>${esc(project.shortDescription)}</p></div><dl><div><dt>Моя роль</dt><dd>Структура / UX / дизайн / frontend / motion</dd></div><div><dt>Тип</dt><dd>${esc(project.type)}</dd></div><div><dt>Статус</dt><dd>Personal showcase</dd></div></dl></div></div></section>
    <figure class="v6-case-cover"><img src="${href('/assets/img/raznye-ludi-ui.webp')}" alt="Главный экран сайта Разные люди"></figure>
    <section class="v6-section v6-case-summary"><div class="shell v6-case-summary__grid"><article><div class="v6-label">Задача</div><h2>Передать характер команды и быстро привести нового участника к понятному следующему шагу.</h2></article><article><div class="v6-label">Решение</div><p>Сценарий строится вокруг крупных фото и видео, ясной иерархии и последовательного раскрытия информации. Пользователь сначала понимает атмосферу и формат команды, затем требования и способ присоединиться.</p></article></div></section>
    <section class="v6-section v6-case-scope"><div class="shell"><div class="v6-section-head"><div class="v6-label">Что сделано</div><p>В кейсе показываю именно работу над digital-продуктом, а не отдельные исходные фотографии.</p></div><div class="v6-scope-grid">${['Структура и пользовательский маршрут','Визуальная система','Адаптивный frontend','Видео и scroll-motion','Форма заявки','Проверка и публикация'].map((x,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><p>${x}</p></div>`).join('')}</div></div></section>
    <section class="v6-live"><div class="shell"><div class="v6-section-head v6-section-head--light"><div class="v6-label">Рабочий интерфейс</div><p>Ниже — реальная portfolio-safe версия сайта, а не статичный макет.</p></div><div class="v6-browser"><div class="v6-browser__bar"><i></i><i></i><i></i><span>desktop / live preview</span></div><iframe src="${href(demo)}" title="Рабочая версия сайта Разные люди" loading="lazy" tabindex="-1" sandbox="allow-scripts allow-same-origin"></iframe></div></div></section>
    <section class="v6-section v6-responsive"><div class="shell v6-responsive__grid"><div><div class="v6-label">Адаптив</div><h2>Интерфейс спроектирован отдельно для мобильного сценария.</h2><p>Навигация, первый экран, типографика и CTA не просто уменьшаются, а перестраиваются под меньший экран.</p><a class="v6-text-link" href="${href(demo)}">Открыть сайт целиком ↗</a></div><div class="v6-phone"><iframe src="${href(demo)}" title="Мобильная версия сайта Разные люди" loading="lazy" tabindex="-1" sandbox="allow-scripts allow-same-origin"></iframe></div></div></section>
    <section class="v6-case-end"><div class="shell"><div class="v6-label">Рабочая версия</div><div><h2>Посмотреть проект<br>без оболочки портфолио.</h2><a href="${href(demo)}">Открыть сайт <span>↗</span></a></div></div></section></main>`;
    write(`work/${project.slug}/index.html`,inject(replaceMain(read(`work/${project.slug}/index.html`),caseMain),'v6-page v6-case-page'));
  }

  const servicesMain=`<main id="main" class="v6-main"><section class="v6-simple-hero"><div class="shell"><div class="v6-hero__meta"><span>Услуги</span><span>4 основных направления</span></div><h1>Что могу разработать</h1><p>Не продаю один шаблон под все случаи. Состав проекта зависит от задачи, контента и того, что должен сделать пользователь.</p></div></section><section class="v6-section v6-service-detail"><div class="shell">${[
    ['01','Лендинг','Когда нужно запустить одно предложение, услугу, продукт или событие.','Структура / визуальное направление / адаптив / формы / аналитика'],
    ['02','Корпоративный сайт','Когда компании нужен понятный цифровой образ, страницы услуг и логичная архитектура.','Архитектура / страницы услуг / контент / CMS или интеграции'],
    ['03','Интернет-магазин','Когда сайт должен не только рассказывать, но и вести пользователя до покупки.','Каталог / карточка товара / корзина / checkout / интеграции'],
    ['04','Веб-приложение','Когда нужно автоматизировать процесс или собрать рабочий пользовательский интерфейс.','Личный кабинет / роли / формы / бизнес-логика / dashboards']
  ].map(([n,t,d,inc])=>`<article><span>${n}</span><div><h2>${t}</h2><p>${d}</p></div><div><small>Обычно включает</small><p>${inc}</p></div></article>`).join('')}<div class="v6-extra"><span>Дополнительно</span><p>Интерактив, motion, video-scroll и storytelling использую как инструменты внутри проекта — только если они помогают подаче или сценарию.</p></div></div></section><section class="v6-contact-cta"><div class="shell"><div class="v6-label">Следующий шаг</div><div><h2>Можно начать даже<br>без готового ТЗ.</h2><a href="${href('/contact/')}">Обсудить задачу <span>↗</span></a></div></div></section></main>`;
  write('services/index.html',inject(replaceMain(read('services/index.html'),servicesMain),'v6-page v6-services-page'));

  const processMain=`<main id="main" class="v6-main"><section class="v6-simple-hero"><div class="shell"><div class="v6-hero__meta"><span>Процесс</span><span>От первого сообщения до запуска</span></div><h1>Как проходит работа</h1><p>Здесь не внутренняя методология, а понятный клиентский маршрут: что понадобится от вас и что происходит на каждом этапе.</p></div></section><section class="v6-section"><div class="shell v6-process-page">${[
    ['01','Первый разговор','Вы присылаете задачу в свободной форме. Я уточняю цель, аудиторию, необходимые страницы, контент и ограничения.','От вас: идея, ссылка, ТЗ или просто описание проблемы.'],
    ['02','Оценка и рамки','Фиксируем, что входит в проект, в каком порядке согласовываем результат и какая версия считается готовой.','Результат: понятный состав работ без скрытых экранов и функций.'],
    ['03','Проектирование и разработка','Собираю структуру и интерфейс, показываю ключевые решения и затем довожу их до работающего frontend.','Вы видите результат до финального запуска, а не только в последний день.'],
    ['04','Проверка и запуск','Проверяю основные сценарии, адаптив и технические ошибки, затем публикую рабочую версию.','После запуска можно отдельно договориться о дальнейшем развитии.']
  ].map(([n,t,d,note])=>`<article><span>${n}</span><div><h2>${t}</h2><p>${d}</p></div><small>${note}</small></article>`).join('')}</div></section><section class="v6-faq"><div class="shell"><div class="v6-label">Частые вопросы</div><div>${[['Нужен ли готовый дизайн?','Нет. Можно прийти только с задачей. Если макет уже есть — работаю по нему.'],['Нужно ли писать подробное ТЗ?','Нет. Для первого разговора достаточно описать, что должен делать сайт и для кого.'],['Можно посмотреть результат до запуска?','Да. Рабочая версия проверяется до публикации, включая основные сценарии и адаптив.'],['Что происходит после запуска?','Проект можно передать вам либо продолжить развитие отдельными итерациями.']].map(([q,a])=>`<details><summary>${q}<span>+</span></summary><p>${a}</p></details>`).join('')}</div></div></section><section class="v6-contact-cta"><div class="shell"><div class="v6-label">Старт</div><div><h2>Опишите задачу<br>своими словами.</h2><a href="${href('/contact/')}">Перейти к контакту <span>↗</span></a></div></div></section></main>`;
  write('process/index.html',inject(replaceMain(read('process/index.html'),processMain),'v6-page v6-process-page-body'));

  const contactMain=`<main id="main" class="v6-main"><section class="v6-contact"><div class="shell v6-contact__grid"><div><div class="v6-hero__meta"><span>Контакты</span><span>Новый проект</span></div><h1>Обсудить<br>задачу.</h1><p>Можно написать в свободной форме: что нужно сделать, есть ли текущий сайт или макет и какой результат вы хотите получить.</p><a class="v6-contact-link" href="https://github.com/avdeevgreyfog-cmd">GitHub — технический профиль ↗</a></div><div class="v6-contact-card"><h2>Подготовить сообщение</h2><p>Пока публичные Telegram и email не подключены, форма не отправляет данные в сеть. Она собирает текст запроса, который можно скопировать.</p><form data-contact-form><label>Как вас зовут<input name="name" autocomplete="name" required></label><label>Как связаться<input name="contact" autocomplete="email" required placeholder="Telegram, email или телефон"></label><label>Что нужно сделать<textarea name="message" rows="6" placeholder="Коротко опишите задачу"></textarea></label><button class="v6-button v6-button--dark" type="submit">Подготовить сообщение</button><div data-contact-result hidden></div></form></div></div></section></main>`;
  write('contact/index.html',inject(replaceMain(read('contact/index.html'),contactMain),'v6-page v6-contact-page'));

  console.log(`V6 layout applied: personal homepage, agency-style Works, UI-led case, client-focused services/process.`);
}
