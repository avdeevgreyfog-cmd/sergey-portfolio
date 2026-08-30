# Sergey Portfolio V6

Commercial personal portfolio for **Сергей Авдеев**.

Public positioning: **Сайты и веб-приложения под ключ**.

## Product model

V6 keeps the correct V5 information architecture, but rebuilds the frontend and case presentation around patterns observed in strong personal portfolios and web agencies:

`PERSON / POSITIONING → SERVICES / TRUST → WORKS CATALOG → CASE → LIVE PRODUCT → CONTACT`

The homepage is about Sergey and his service. Projects are only exposed through the Works catalog.

## Public sitemap

- `/` — personal commercial homepage.
- `/works/` — filtered portfolio catalog.
- `/work/<slug>/` — UI-led project case.
- `/demo/<slug>/` — autonomous portfolio-safe live project (`noindex`).
- `/services/` — four client-readable product directions.
- `/process/` — client-facing delivery process and FAQ.
- `/contact/` — project inquiry page.

Secondary R&D routes remain under `/effects/`, are removed from primary navigation and stay `noindex,nofollow`.

## Design principles

V6 is intentionally restrained and commercial rather than an Awwwards-style effects showcase:

- clear personal identity and offering on the first screen;
- system sans typography with controlled scale;
- neutral light palette with one blue accent;
- thin rules and dense editorial grids instead of SaaS cards;
- no glassmorphism, bento dashboards, decorative gradients or fake awards;
- project UI is the primary visual proof;
- motion is secondary and respects reduced-motion.

## Works catalog

Filters are always visible and show the number of published projects:

- Все
- Лендинги
- Корпоративные сайты
- Интернет-магазины
- Веб-приложения

With only one current project, the layout uses a full-width project row instead of a half-empty two-column grid. Every project exposes separate actions for the case and the live site.

Current published work:

- `Разные люди` — `Лендинги`, origin `PERSONAL`, status `SHOWCASE`.

Its Works cover is a real screenshot of the website UI, not a source photograph from the project.

## Case model

The `Разные люди` case leads with the digital product:

- project role and format;
- actual website UI screenshot;
- task and solution;
- delivered scope;
- embedded same-origin portfolio-safe desktop preview;
- separate mobile preview;
- explicit link to the autonomous demo.

The case therefore demonstrates UX, visual system, frontend, responsive behavior and interaction rather than functioning as a gallery of airsoft photography.

## Services

Primary product categories are:

- Лендинги
- Корпоративные сайты
- Интернет-магазины
- Веб-приложения

Motion, storytelling, video-scroll and other interaction patterns are presented as optional implementation capabilities, not as a fifth client product category.

## Process

The public process is written from the client's perspective:

1. discuss the task;
2. define scope and approval boundaries;
3. design and build;
4. test and launch.

FAQ answers the practical questions a prospective client is likely to have before contacting Sergey.

## Project demo

Source repository:

`https://github.com/avdeevgreyfog-cmd/raznye-ludi-site`

Pinned approved source commit:

`a566c822170ff8eb27e83e08937e5a37bbb8e8e5`

The build imports it to `/demo/raznye-ludi/` with local assets, no portfolio chrome, `noindex,nofollow`, and blocked production form submission.

## Architecture

- Vanilla TypeScript compiled by `tsc`.
- Static HTML renderer in `scripts/render.mjs`.
- V6 commercial presentation transform in `scripts/v6-layout.mjs`.
- V6 visual system in `public/assets/css/v6.css`.
- Production build orchestration in `scripts/build.mjs`.
- BASE_PATH-aware GitHub Pages routing/assets.
- Data-driven project registry in `src/projects/registry.ts`.
- Persistent Works filter runtime in `src/portfolio/works.ts`.
- SEO/OG, sitemap, robots and noindex rules generated at build time.

## Contact behavior

No Telegram, email or WhatsApp address is invented. Until real public details are supplied, `/contact/` exposes the confirmed GitHub technical profile and a local-safe inquiry composer. It prepares copyable text and does not fake a successful network submission.

`INPUT_REQUIRED: public Telegram and email; WhatsApp if desired.`

## QA / release gate

CI checks:

1. dependency install and TypeScript typecheck;
2. production build with pinned real project import;
3. static and scalability QA;
4. Playwright functional journeys;
5. responsive layout at 390 / 834 / 1440;
6. screenshot QA for Home, Works, Case, Services, Process and Contact;
7. independent visual artifact review;
8. GitHub Pages deploy from `main`;
9. post-deploy production route smoke test.

V6 is released only after functional, visual and production gates all pass.
