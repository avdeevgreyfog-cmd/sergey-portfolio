# Сергей Авдеев — Portfolio V2

Персональное портфолио «Сайты и веб-приложения под ключ». V2 сознательно публикует только подтверждённые showcase-работы. На первом релизе это **«Разные люди»**.

Production: `https://avdeevgreyfog-cmd.github.io/sergey-portfolio/`

## Архитектура

```text
src/
  config/                 # позиционирование, контакты, capabilities, effects
  portfolio/              # runtime главной и case pages
  projects/               # типы и единый registry проектов
  effects/                # независимые runtime-модули демонстраций
  shared/                 # base-path и общие motion/accessibility helpers
public/
  assets/css/              # design system + route-specific CSS
  favicon.svg
  og-image.png
scripts/
  build.mjs               # static routing, metadata, demo import
  render.mjs              # SSR-like HTML templates для portfolio shell
  clean.mjs
tests/
  qa.py                    # статический release QA
  browser_qa.py            # функциональный Playwright QA
  visual_qa.py             # реальные screenshots + layout critic
```

Portfolio shell и demo-проекты имеют разные runtime/style boundaries. `demo/raznye-ludi/` не подключает CSS/JS портфолио и собирается как автономная копия исходного landing.

## Local development

```bash
npm ci
npm run typecheck
BASE_PATH=/sergey-portfolio \
SITE_URL=https://avdeevgreyfog-cmd.github.io/sergey-portfolio \
npm run build
python3 -m http.server 4173 -d dist
```

Build импортирует media и исходный landing «Разных людей» из **закреплённого commit SHA** репозитория `avdeevgreyfog-cmd/raznye-ludi-site`. Это делает источник воспроизводимым: обновление `main` исходного проекта не меняет опубликованную portfolio-копию самопроизвольно.

В среде без доступа к GitHub можно проверить только shell-сборку:

```bash
ALLOW_PROJECT_PLACEHOLDERS=1 BASE_PATH=/sergey-portfolio npm run build
```

Этот режим не является release build и не проходит media gate.

## Build и deployment

GitHub Actions выполняет:

1. clean checkout;
2. `npm ci`;
3. TypeScript typecheck;
4. production build с `BASE_PATH=/sergey-portfolio`;
5. static QA;
6. Playwright functional QA;
7. screenshot visual QA;
8. upload QA evidence;
9. на `main` — GitHub Pages deployment.

Ветка `portfolio-v2` запускает весь QA, но не публикуется. `main` публикуется только после успешного job `qa`.

`dist/`, `.build/`, screenshots и visual reports не хранятся в source tree.

## Project data model

`src/projects/registry.ts` — единый источник публичных работ.

Каждый project содержит минимум:

- `slug`;
- `title`;
- `type` / `category`;
- `origin`: `CLIENT | PERSONAL | CONCEPT | EXPERIMENT`;
- `year`;
- `shortDescription`;
- `cover`;
- `caseMedia`;
- `services`;
- `demoRoute`;
- `featured`;
- `order`;
- `status`: `DRAFT | BETA | SHOWCASE | ARCHIVED`.

В public registry попадают только `SHOWCASE`. `DRAFT` и `BETA` не должны автоматически становиться featured work.

## Как добавить новый готовый сайт

1. Получить репозиторий или архив исходного сайта и определить конкретную approved версию/commit.
2. Создать новый project module/manifest в `src/projects/`.
3. Создать portfolio-safe import в `scripts/build.mjs` или отдельном importer-модуле.
4. Скопировать нужные assets в `dist/projects/<slug>/...` во время build.
5. Удалить private data, secrets, analytics ids и случайно внедрённые third-party scripts.
6. Перевести submit/payment/API endpoints в безопасный demo mode.
7. Создать автономный route `/demo/<slug>/`, не подключающий portfolio chrome.
8. Добавить metadata в registry.
9. Создать case presentation `/work/<slug>/` из реальных media проекта.
10. Поставить `status: SHOWCASE` только после полного QA. После этого homepage подхватит проект по `featured/order` без ручной переделки старых карточек.

## Demo / privacy rules

Portfolio demo — физическая копия внутри Pages deployment, а не iframe на production URL.

Перед публикацией обязательно:

- нет production secrets;
- нет реальных payment/submit/API mutations;
- формы сохраняют validation и UX, но завершаются local demo-success;
- внешние analytics/trackers удалены, если они не нужны демонстрации;
- demo получает `noindex,nofollow`;
- demo не содержит toolbar/viewport selector/developer notes портфолио;
- CSS/JS demo не должны протекать в portfolio shell и наоборот.

### «Разные люди»

Source-of-truth закреплён на commit:

`a566c822170ff8eb27e83e08937e5a37bbb8e8e5`

Build забирает фактический `index.html` и media из этого commit, удаляет случайный Kaspersky-injected script, переписывает media URLs на локальные Pages assets, блокирует debug fog panel и добавляет безопасный локальный submit fallback. Никакой реконструированный `renderRaznyeDemo()` не используется.

## Как добавить case page

Case использует реальные `caseMedia` из project registry. Публичный текст не должен придумывать клиента, KPI, сроки, отзывы или коммерческие результаты. Для нового типа кейса лучше добавить отдельный renderer/component, чем превращать все проекты в одинаковую сетку карточек.

## Как добавить effect

1. Добавить запись в `effects` (`src/config/site.ts`).
2. Добавить route markup в `scripts/render.mjs`.
3. Добавить runtime-модуль в `src/effects/`.
4. Подключить lazy dynamic import в `src/main.ts`.
5. Обеспечить keyboard/touch/reduced-motion fallback.
6. Добавить проверку в browser QA.

Heavy effect code не должен попадать в homepage bundle заранее: route runtimes подгружаются через dynamic import.

## QA

```bash
npm test
npm run test:browser
npm run test:visual
```

Release gate проверяет:

- отсутствие старых VECTOR/LUMA/CRM в public scope;
- обязательные routes/metadata/OG;
- pinned import и реальные media «Разных людей»;
- отсутствие Kaspersky/demo toolbar/remote media leak;
- горизонтальный overflow;
- mobile menu;
- project → demo flow;
- четыре effect routes;
- reduced motion;
- 404/deep routes;
- console/page/network errors;
- реальные screenshots на 390 / 834 / 1440 / 1920, где применимо.

`qa-screens/` и `visual-report/` публикуются как CI artifact, а не коммитятся.

## Контакты

Меняются в `src/config/site.ts` → `site.contacts`.

Не добавлять `example@email.com`, вымышленные Telegram/WhatsApp или другие placeholders. Если канал не подтверждён как публичный — его не должно быть в массиве.

## SEO / social

Главная metadata задаётся в `src/config/site.ts`, route-specific title/description — в `scripts/render.mjs`.

Branded social preview: `public/og-image.png` (1200×630).

Case page индексируется. `demo/*` и `effects/*` получают `noindex,nofollow`; `robots.txt` также исключает их из обхода.

## V1 archive

V1 сохранена отдельной веткой:

`archive/portfolio-v1`

Рабочая V2 разрабатывается в:

`portfolio-v2`

После release gate V2 интегрируется в `main`; архивная ветка не удаляется.
