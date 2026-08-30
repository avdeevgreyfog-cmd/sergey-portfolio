# Sergey Portfolio V5

Commercial personal portfolio for **Сергей Авдеев**.

Public positioning: **Сайты и веб-приложения под ключ**.

## Product model

V5 deliberately separates the personal presentation from the project catalog:

`ABOUT / POSITIONING → SERVICES / APPROACH → WORKS CATALOG → CASE → DEMO`

The homepage is about Sergey and the service he provides. Individual projects do not take over the homepage.

## Public sitemap

- `/` — personal / commercial homepage: positioning, about, capabilities, process and contact CTA.
- `/works/` — project catalog with permanent category filters.
- `/work/<slug>/` — individual project case.
- `/demo/<slug>/` — autonomous portfolio-safe copy of the actual project (`noindex`).
- `/services/` — service overview.
- `/process/` — delivery process.
- `/contact/` — project inquiry page.

Secondary R&D routes remain under `/effects/`, but are absent from primary navigation and marked `noindex,nofollow`.

## Works catalog

The catalog always exposes these commercial filters:

- Все
- Лендинги
- Корпоративные сайты
- Интернет-магазины
- Веб-приложения

If a selected category has no published work yet, the UI shows an honest empty state instead of hiding the filter.

Current published work:

- `Разные люди` — category `Лендинги`, origin `PERSONAL`, status `SHOWCASE`.

A visitor sees the project only after opening `/works/`; the case itself is available at `/work/raznye-ludi/`.

## Project demo

Source repository:

`https://github.com/avdeevgreyfog-cmd/raznye-ludi-site`

Pinned approved source commit:

`a566c822170ff8eb27e83e08937e5a37bbb8e8e5`

The build imports the project into `/demo/raznye-ludi/` as an autonomous portfolio-safe copy with local assets, no portfolio chrome, `noindex,nofollow`, and blocked production form submission.

The case page may render the autonomous demo as non-interactive project proof. The homepage and Works catalog do not embed the demo.

## Visual direction

V5 uses a restrained editorial system instead of a creative-developer playground:

- neutral light background;
- graphite typography;
- strong but bounded type scale;
- simple rules and grid;
- no glassmorphism, bento dashboard or decorative 3D;
- compact project cards in Works;
- no fullscreen case on the homepage;
- responsive compositions for 390 / 834 / 1440.

## Services

Public service directions:

- Лендинги
- Корпоративные сайты
- Интернет-магазины
- Веб-приложения
- Интерактивные страницы

No fake clients, metrics, reviews, awards or project counts are published.

## Architecture

- Vanilla TypeScript compiled by `tsc`.
- Static HTML generation in `scripts/render.mjs`.
- V5 presentation transform in `scripts/v5-layout.mjs`.
- Production build orchestration in `scripts/build.mjs`.
- BASE_PATH-aware routing/assets for GitHub Pages.
- Data-driven project registry in `src/projects/registry.ts`.
- Persistent Works filter runtime in `src/portfolio/works.ts`.
- SEO/OG, sitemap, robots and noindex rules generated at build time.

## Contact behaviour

No Telegram, email or WhatsApp address is invented. Until real public details are supplied, `/contact/` exposes the confirmed GitHub technical profile and a local-safe inquiry composer. The form prepares copyable text and does not fake a network submission.

`INPUT_REQUIRED: public Telegram and email; WhatsApp if desired.`

## QA / release gate

CI checks:

1. `npm ci`
2. TypeScript typecheck
3. production build with the pinned real project import
4. static and second-project scalability QA
5. Playwright functional flows
6. responsive routes at 390 / 834 / 1440
7. screenshot QA for Home, Works, Case, Services, Process and Contact
8. visual artifact upload for manual review
9. GitHub Pages deployment from `main`
10. post-deploy production route smoke test

Primary flows include:

- About-first Home → Works
- Works filter → Case → autonomous Demo
- Home → Services → Contact
- Process → Contact
- mobile navigation
- empty Works category state
- local-safe contact form
- reduced-motion fallback

V5 is released only when the catalog structure, visual QA, functional QA and production smoke all pass.
