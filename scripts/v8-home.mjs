import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
const base=(process.env.BASE_PATH||'').trim().replace(/\/+$/,'');
const href=(p='/')=>`${base}${p.startsWith('/')?p:`/${p}`}`||'/';
const file=path.join(out,'index.html');
let html=fs.readFileSync(file,'utf8');

const art=`<div class="v8-orbit" aria-hidden="true">
  <svg viewBox="0 0 760 760" role="presentation">
    <defs>
      <radialGradient id="v8core" cx="68%" cy="28%" r="72%">
        <stop offset="0" stop-color="#a9e4ff" stop-opacity=".98"/>
        <stop offset=".18" stop-color="#5ca7ff" stop-opacity=".95"/>
        <stop offset=".46" stop-color="#6558ff" stop-opacity=".88"/>
        <stop offset=".72" stop-color="#1a1a4d" stop-opacity=".78"/>
        <stop offset="1" stop-color="#050912" stop-opacity=".98"/>
      </radialGradient>
      <radialGradient id="v8hole" cx="44%" cy="42%" r="64%">
        <stop offset="0" stop-color="#02060c"/>
        <stop offset=".54" stop-color="#050914"/>
        <stop offset=".7" stop-color="#443bc0" stop-opacity=".45"/>
        <stop offset=".86" stop-color="#65cfff" stop-opacity=".5"/>
        <stop offset="1" stop-color="#0b1020" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="v8ring" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#91c8ff" stop-opacity=".82"/><stop offset=".48" stop-color="#665cff" stop-opacity=".38"/><stop offset="1" stop-color="#91c8ff" stop-opacity=".08"/></linearGradient>
      <filter id="v8glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="16" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="v8grain" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".86" numOctaves="2" seed="9" result="n"/><feColorMatrix in="n" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .14 0"/><feBlend in="SourceGraphic" mode="soft-light"/></filter>
    </defs>
    <g class="v8-orbit__grid" opacity=".38">
      <path d="M80 380H680M380 80V680"/>
      <circle cx="380" cy="380" r="238"/><circle cx="380" cy="380" r="310"/>
    </g>
    <g class="v8-orbit__rings" fill="none">
      <ellipse cx="380" cy="380" rx="326" ry="118" transform="rotate(18 380 380)" stroke="url(#v8ring)" stroke-width="1.2"/>
      <ellipse cx="380" cy="380" rx="292" ry="98" transform="rotate(66 380 380)" stroke="#806cff" stroke-opacity=".34"/>
      <ellipse cx="380" cy="380" rx="252" ry="72" transform="rotate(-28 380 380)" stroke="#79d3ff" stroke-opacity=".22"/>
    </g>
    <circle cx="380" cy="380" r="212" fill="url(#v8core)" filter="url(#v8glow)"/>
    <circle cx="380" cy="380" r="212" fill="url(#v8core)" filter="url(#v8grain)" opacity=".9"/>
    <circle cx="380" cy="380" r="102" fill="url(#v8hole)"/>
    <circle cx="380" cy="380" r="147" fill="none" stroke="#8bcfff" stroke-opacity=".18"/>
    <path d="M226 279c77-67 216-73 311 13" fill="none" stroke="#d6f2ff" stroke-opacity=".38" stroke-width="1.2"/>
    <circle cx="606" cy="276" r="5" fill="#b5ff75" filter="url(#v8glow)"/>
    <circle cx="182" cy="462" r="3" fill="#8ed8ff"/>
    <circle cx="533" cy="582" r="3" fill="#8d79ff"/>
  </svg>
  <span class="v8-orbit__note v8-orbit__note--a">DIGITAL / PRODUCT / WEB</span>
  <span class="v8-orbit__note v8-orbit__note--b">SYSTEM 08.26</span>
  <span class="v8-orbit__note v8-orbit__note--c">INTERFACE / LOGIC / RELEASE</span>
</div>`;

const main=`<main id="main" class="v8-home">
  <section class="v8-hero">
    <div class="shell v8-hero__meta" data-reveal>
      <span>01 / PORTFOLIO 2026</span>
      <span class="v8-status"><i></i> ОТКРЫТ К НОВЫМ ПРОЕКТАМ</span>
    </div>
    <div class="shell v8-hero__stage">
      <div class="v8-hero__copy" data-reveal>
        <span class="v8-kicker">Сергей Авдеев / web developer</span>
        <h1><span>САЙТЫ</span><span class="v8-hero__line">&amp; <em>СИСТЕМЫ</em></span></h1>
        <div class="v8-hero__lead">
          <p>Проектирую и собираю цифровые продукты — от структуры и визуальной системы до рабочего интерфейса и релиза.</p>
          <div class="v8-hero__actions">
            <a href="${href('/contact/')}">Обсудить проект <b>↗</b></a>
            <a href="${href('/works/')}">Смотреть работы <b>→</b></a>
          </div>
        </div>
      </div>
      <div class="v8-hero__visual" data-reveal>${art}</div>
      <div class="v8-hero__side" aria-hidden="true"><span>DESIGN</span><span>DEVELOPMENT</span><span>PRODUCT</span></div>
    </div>
    <div class="shell v8-hero__rail" data-reveal>
      <span>СТРУКТУРА / UX</span><span>ВИЗУАЛЬНАЯ СИСТЕМА</span><span>FRONTEND / LOGIC</span><span>QA / RELEASE</span>
    </div>
  </section>

  <section class="v8-statement">
    <div class="shell v8-statement__grid">
      <span class="v8-label">02 / ПОДХОД</span>
      <p data-reveal>Не собираю страницы из готовых блоков. <em>Сначала понимаю задачу,</em> затем выстраиваю структуру, интерфейс и техническую логику как одну систему.</p>
      <div class="v8-statement__aside" data-reveal><span>Один человек ведёт проект</span><b>от идеи до запуска</b></div>
    </div>
  </section>

  <section class="v8-services">
    <div class="shell">
      <div class="v8-sectionHead" data-reveal><span class="v8-label">03 / ЧТО ДЕЛАЮ</span><h2>Задача определяет<br><em>формат решения.</em></h2></div>
      <div class="v8-serviceList">
        <a href="${href('/contact/')}" data-reveal><span>01</span><h3>Сайты и лендинги</h3><p>Продукт, услуга, компания или запуск — с понятной структурой и сильной подачей.</p><b>↗</b></a>
        <a href="${href('/contact/')}" data-reveal><span>02</span><h3>Веб-приложения</h3><p>Интерфейсы с бизнес-логикой, ролями, данными и рабочими пользовательскими сценариями.</p><b>↗</b></a>
        <a href="${href('/contact/')}" data-reveal><span>03</span><h3>Внутренние системы</h3><p>CRM-подобные продукты, dashboards и операционные инструменты для реальных процессов.</p><b>↗</b></a>
        <a href="${href('/contact/')}" data-reveal><span>04</span><h3>UX и интерфейсы</h3><p>Архитектура, навигация, состояния и визуальная система без декоративного шума.</p><b>↗</b></a>
      </div>
    </div>
  </section>

  <section class="v8-process">
    <div class="shell v8-process__grid">
      <div class="v8-process__intro" data-reveal><span class="v8-label">04 / ПРОЦЕСС</span><h2>От вопроса<br>к <em>релизу.</em></h2><p>Без театра из двадцати этапов: задача → система → реализация → проверка.</p></div>
      <ol class="v8-process__steps">
        <li data-reveal><span>01</span><div><b>Разобраться</b><p>Цель, контекст, ограничения, аудитория и критерий результата.</p></div></li>
        <li data-reveal><span>02</span><div><b>Спроектировать</b><p>Сценарий, архитектура, композиция и визуальное направление.</p></div></li>
        <li data-reveal><span>03</span><div><b>Собрать</b><p>Frontend, логика, адаптив, взаимодействия и необходимые интеграции.</p></div></li>
        <li data-reveal><span>04</span><div><b>Проверить и выпустить</b><p>QA, реальные сценарии, исправления и публикация рабочей версии.</p></div></li>
      </ol>
    </div>
  </section>

  <section class="v8-workGate">
    <a class="shell v8-workGate__link" href="${href('/works/')}" data-reveal>
      <span class="v8-label">05 / ПОРТФОЛИО</span>
      <strong>РАБОТЫ</strong>
      <em>Смотреть проекты</em>
      <b>↗</b>
    </a>
  </section>

  <section class="v8-final">
    <div class="shell v8-final__grid" data-reveal>
      <span class="v8-label">06 / КОНТАКТ</span>
      <h2>Есть задача?<br><em>Давайте обсудим.</em></h2>
      <p>Можно прийти с идеей, черновиком, готовым ТЗ или уже существующим продуктом.</p>
      <a href="${href('/contact/')}">НАЧАТЬ ДИАЛОГ <span>↗</span></a>
    </div>
  </section>
</main>`;

const start=html.indexOf('<main id="main">');
const end=html.indexOf('</main>',start);
if(start<0||end<0) throw new Error('Homepage main region not found');
html=html.slice(0,start)+main+html.slice(end+7);
html=html.replace('<body id="top">','<body id="top" class="home-v8">');
html=html.replace('</head>',`<link rel="stylesheet" href="${href('/assets/css/v8-home.css')}"></head>`);
fs.writeFileSync(file,html,'utf8');
console.log('Portfolio V8 homepage applied.');
