import fs from 'node:fs';
import path from 'node:path';

const esc=(v)=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

export function applyV5Layout({out,basePath='',site,projects=[]}){
  const href=(p)=>`${basePath}${p.startsWith('/')?p:`/${p}`}`||'/';
  const media=(p)=>href(`/${String(p).replace(/^\//,'')}`);
  const read=(rel)=>fs.readFileSync(path.join(out,rel),'utf8');
  const write=(rel,html)=>fs.writeFileSync(path.join(out,rel),html);
  const replaceMain=(html,main)=>html.replace(/<main id="main">[\s\S]*?<\/main>/,main);
  const inject=(html,bodyClass='')=>{
    if(!html.includes('/assets/css/v5.css')) html=html.replace('</head>',`<link rel="stylesheet" href="${href('/assets/css/v5.css')}"></head>`);
    if(bodyClass) html=html.replace(/<body class="[^"]*">/,`<body class="${bodyClass}">`);
    return html;
  };

  const homeMain=`<main id="main" class="v5-main v5-home">
    <section class="v5-home-hero">
      <div class="shell">
        <div class="v5-home-meta"><span>Сергей Авдеев</span><span>Web developer / Москва</span></div>
        <div class="v5-home-grid">
          <div class="v5-home-title"><p class="v5-kicker">Сайты и веб-приложения под ключ</p><h1>Создаю цифровые продукты <em>для реальных задач бизнеса.</em></h1></div>
          <div class="v5-home-intro"><p>Разрабатываю сайты и веб-интерфейсы — от структуры и визуального направления до разработки, адаптива и запуска.</p><p>Можно прийти с готовым макетом, техническим заданием или только с идеей.</p><div class="v5-actions"><a class="v5-btn v5-btn--primary" href="${href('/works/')}">Смотреть работы</a><a class="v5-btn" href="${href('/contact/')}">Обсудить проект</a></div></div>
        </div>
        <div class="v5-home-bottom"><span>01 / Обо мне</span><span>От идеи и структуры → до работающего сайта</span></div>
      </div>
    </section>

    <section class="v5-about">
      <div class="shell v5-two-col">
        <div><span class="v5-section-label">Обо мне</span></div>
        <div class="v5-about-copy"><h2>Я веду проект целиком, без лишней передачи между этапами.</h2><p>Могу самостоятельно собрать структуру, определить визуальное направление и довести проект до рабочей версии. Если дизайн уже готов — подключаюсь на этапе разработки и аккуратно переношу его в веб.</p><p>Основной фокус — понятный интерфейс, аккуратная адаптивная версия и работающий результат, который можно показывать клиентам и использовать в бизнесе.</p></div>
      </div>
    </section>

    <section class="v5-capabilities">
      <div class="shell">
        <div class="v5-section-head"><span class="v5-section-label">Что могу сделать</span><p>Не один шаблон под все задачи, а разные форматы под конкретный проект.</p></div>
        <div class="v5-capability-list">
          ${[
            ['01','Лендинги','Промо-страницы, услуги, отдельные продукты и рекламные предложения.'],
            ['02','Корпоративные сайты','Сайты компаний, команд, брендов и сервисных бизнесов.'],
            ['03','Интернет-магазины','Каталог, карточки товара, корзина и необходимые интеграции.'],
            ['04','Веб-приложения','Личные кабинеты, CRM-подобные системы и внутренние интерфейсы.'],
            ['05','Интерактивные страницы','Motion и нестандартная подача там, где они усиливают задачу.']
          ].map(([n,t,d])=>`<a href="${href('/services/')}" class="v5-capability-row"><span>${n}</span><h3>${t}</h3><p>${d}</p><b>↗</b></a>`).join('')}
        </div>
      </div>
    </section>

    <section class="v5-process-preview">
      <div class="shell">
        <div class="v5-section-head"><span class="v5-section-label">Как работаю</span><p>Короткий и понятный процесс без декоративной методологии.</p></div>
        <div class="v5-process-grid">
          ${[['01','Задача','Разбираем, что нужно сделать и для кого.'],['02','Структура','Определяю страницы, блоки и пользовательский маршрут.'],['03','Разработка','Собираю интерфейс, адаптив и нужную логику.'],['04','Проверка и запуск','Тестирую ключевые сценарии и публикую рабочую версию.']].map(([n,t,d])=>`<article><span>${n}</span><h3>${t}</h3><p>${d}</p></article>`).join('')}
        </div>
        <a class="v5-text-link" href="${href('/process/')}">Подробнее о процессе →</a>
      </div>
    </section>

    <section class="v5-work-gateway">
      <div class="shell v5-work-gateway__grid"><div><span class="v5-section-label">Портфолио</span><h2>Работы — в отдельном каталоге.</h2></div><div><p>Проекты не занимают главную страницу. В разделе «Работы» можно выбрать нужное направление и открыть уже конкретный кейс.</p><a class="v5-btn v5-btn--light" href="${href('/works/')}">Перейти к работам</a></div></div>
    </section>

    <section class="v5-contact-cta"><div class="shell"><span class="v5-section-label">Контакты</span><div><h2>Есть задача по сайту<br>или веб-приложению?</h2><a href="${href('/contact/')}">Обсудить проект <span>↗</span></a></div></div></section>
  </main>`;

  let home=inject(replaceMain(read('index.html'),homeMain),'v5-home-page');
  write('index.html',home);

  const categories=['Все','Лендинги','Корпоративные сайты','Интернет-магазины','Веб-приложения'];
  const filters=`<div class="v5-work-filters" data-work-filters aria-label="Фильтр работ">${categories.map((c,i)=>`<button type="button" data-filter="${esc(c)}" aria-pressed="${i===0}">${esc(c)}</button>`).join('')}</div>`;
  const cards=projects.map((p,i)=>`<article class="v5-work-card" data-project-category="${esc(p.category)}">
    <a class="v5-work-card__media work-entry__media" href="${href(`/work/${p.slug}/`)}"><img src="${media(p.cover)}" alt="${esc(p.title)} — проект" loading="${i?'lazy':'eager'}"><span>Открыть кейс ↗</span></a>
    <div class="v5-work-card__meta"><span>${String(i+1).padStart(2,'0')} / ${p.year}</span><span>${esc(p.category)}</span></div>
    <h2><a href="${href(`/work/${p.slug}/`)}">${esc(p.title)}</a></h2>
    <p>${esc(p.shortDescription)}</p>
    <a class="v5-work-card__link" href="${href(`/work/${p.slug}/`)}">Посмотреть кейс →</a>
  </article>`).join('');
  const worksMain=`<main id="main" class="v5-main v5-works">
    <section class="v5-works-hero"><div class="shell"><div class="v5-home-meta"><span>Портфолио</span><span>${String(projects.length).padStart(2,'0')} опубликованный проект</span></div><h1>Работы</h1><div class="v5-works-intro"><p>Здесь собраны проекты по направлениям. Выберите категорию, затем откройте конкретную работу — описание, кейс и рабочую демонстрацию.</p></div>${filters}</div></section>
    <section class="v5-works-catalog"><div class="shell"><div class="v5-work-grid">${cards}</div><div class="v5-work-empty" data-work-empty hidden><span>В этой категории пока нет опубликованных проектов.</span><p>Фильтр уже работает — новые работы будут появляться здесь по мере добавления в портфолио.</p></div></div></section>
  </main>`;
  let works=inject(replaceMain(read('works/index.html'),worksMain),'v5-works-page');
  write('works/index.html',works);

  const commercial=['work/raznye-ludi/index.html','services/index.html','process/index.html','contact/index.html','404.html'];
  for(const rel of commercial){ if(fs.existsSync(path.join(out,rel))) write(rel,inject(read(rel),'v5-commercial-page')); }

  console.log(`V5 layout applied: about-first homepage, filtered works catalog, ${projects.length} published project(s).`);
}
