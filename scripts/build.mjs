import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist');
const build = path.join(root, '.build');
const pub = path.join(root, 'public');
const siteUrl = (process.env.SITE_URL || '').replace(/\/$/, '');
const basePath = (process.env.BASE_PATH || '').trim().replace(/\/+$/, '');
if (basePath && !basePath.startsWith('/')) throw new Error('BASE_PATH must start with /');

fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
fs.copyFileSync(path.join(pub, 'styles.css'), path.join(out, 'styles.css'));
fs.copyFileSync(path.join(pub, 'robots.txt'), path.join(out, 'robots.txt'));
fs.copyFileSync(path.join(pub, 'site.webmanifest'), path.join(out, 'site.webmanifest'));
fs.copyFileSync(path.join(build, 'app.js'), path.join(out, 'assets', 'app.js'));
fs.copyFileSync(path.join(build, 'data.js'), path.join(out, 'assets', 'data.js'));

const template = fs.readFileSync(path.join(pub, 'index.html'), 'utf8');

const pages = [
  { route: '/', title: 'Сергей — сайты и веб-приложения под ключ', description: 'Сергей — сайты и веб-приложения под ключ. Интерактивное портфолио: лендинги, корпоративные сайты, e-commerce и CRM.', robots: 'index,follow' },
  { route: '/works/', title: 'Работы — Сергей', description: 'Интерактивные работы Сергея: визуальный лендинг, B2B-сайт, e-commerce и CRM.', robots: 'index,follow' },
  { route: '/lab/', title: 'Interactive Lab — Сергей', description: 'Короткие демонстрации интерактивных web-механик: scroll storytelling, 3D product, kinetic type, reveal и transitions.', robots: 'index,follow' },
  { route: '/work/raznye-ludi/', title: 'Разные люди — кейс Сергея', description: 'Mini-case визуального сайта страйкбольной команды с video hero, фотографией, motion и интерактивом.', robots: 'index,follow' },
  { route: '/work/b2b-engineering/', title: 'VECTOR Engineering — кейс Сергея', description: 'Демонстрационный B2B corporate website: услуги, объекты, процесс и интерактивный бриф.', robots: 'index,follow' },
  { route: '/work/design-light-store/', title: 'LUMA Objects — кейс Сергея', description: 'Демонстрационный e-commerce проект: каталог, карточка товара, корзина и checkout.', robots: 'index,follow' },
  { route: '/work/r-kadry-demo/', title: 'Р-Кадры Demo — кейс Сергея', description: 'Showcase business web application: dashboard, заявки, статусы и расчёт.', robots: 'index,follow' },
  { route: '/demo/raznye-ludi/', title: 'Разные люди — Interactive Demo', description: 'Интерактивная showcase-демонстрация проекта «Разные люди».', robots: 'noindex,nofollow' },
  { route: '/demo/b2b-engineering/', title: 'VECTOR Engineering — Interactive Demo', description: 'Интерактивная showcase-демонстрация B2B corporate проекта.', robots: 'noindex,nofollow' },
  { route: '/demo/design-light-store/', title: 'LUMA Objects — Interactive Demo', description: 'Интерактивная showcase-демонстрация интернет-магазина.', robots: 'noindex,nofollow' },
  { route: '/demo/r-kadry-demo/', title: 'Р-Кадры — Interactive Demo', description: 'Интерактивная showcase-демонстрация CRM / web application.', robots: 'noindex,nofollow' }
];

for (const page of pages) {
  let html = template
    .replace('href="/styles.css"', `href="${basePath}/styles.css"`)
    .replace('src="/assets/app.js"', `src="${basePath}/assets/app.js"`)
    .replace('</head>', `  <meta name="app-base" content="${basePath}">\n</head>`)
    .replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${page.description}">`)
    .replace(/<meta name="robots" content="[^"]*">/, `<meta name="robots" content="${page.robots}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${page.title}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${page.description}">`);
  if (siteUrl) {
    html = html.replace('</head>', `  <link rel="canonical" href="${siteUrl}${page.route}">\n</head>`);
  }
  const dir = page.route === '/' ? out : path.join(out, page.route.replace(/^\//, ''));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

const notFound = template
  .replace('href="/styles.css"', `href="${basePath}/styles.css"`)
  .replace('src="/assets/app.js"', `src="${basePath}/assets/app.js"`)
  .replace('</head>', `  <meta name="app-base" content="${basePath}">\n</head>`)
  .replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex,nofollow">');
fs.writeFileSync(path.join(out, '404.html'), notFound);
fs.writeFileSync(path.join(out, '.nojekyll'), '');
fs.writeFileSync(path.join(out, 'vercel.json'), JSON.stringify({ cleanUrls: false, trailingSlash: true, headers: [{ source: '/demo/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }] }, null, 2));
console.log(`Built ${pages.length} routed pages into dist/`);
