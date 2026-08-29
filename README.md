# Sergey Portfolio V4

Commercial multipage website for **Сергей Авдеев**, positioned as an independent web developer / small web studio.

Public positioning: **Сайты и веб-приложения под ключ**.

## Product model

V4 is deliberately project-first and client-facing:

`POSITIONING → WORK → SERVICES → PROCESS → CONTACT`

It is not a developer playground, résumé, tech-stack showcase or effects catalog. Motion and interactive techniques support the presentation of real work instead of becoming the product themselves.

## Public sitemap

- `/` — commercial homepage.
- `/works/` — published work catalog.
- `/work/<slug>/` — visual case study.
- `/demo/<slug>/` — autonomous portfolio-safe copy of the actual project (`noindex`).
- `/services/` — commercial service overview.
- `/process/` — how the project is delivered.
- `/contact/` — project inquiry page.

Secondary R&D routes are preserved under `/effects/`, but are removed from primary navigation and marked `noindex,nofollow`.

## Current public work

`Разные люди` is currently the only published project.

Origin: `PERSONAL`.

Source repository:

`https://github.com/avdeevgreyfog-cmd/raznye-ludi-site`

Pinned approved source commit:

`a566c822170ff8eb27e83e08937e5a37bbb8e8e5`

The portfolio imports the project into an autonomous demo at `/demo/raznye-ludi/`. The demo uses local project assets, contains no portfolio chrome and blocks production form submission.

V4 also renders the same autonomous demo as a non-interactive **live project preview** on the homepage, Works and the project case. This ensures the portfolio demonstrates an actual website interface rather than only the source photography used by that project. The autonomous demo itself is still a standalone document and is not implemented as an iframe.

## Services

The public commercial categories are:

- Лендинги
- Корпоративные сайты
- Интернет-магазины
- Веб-приложения
- Интерактивные страницы

No fixed prices, fake clients, fake metrics, fake reviews or fabricated project counts are published.

## Architecture

- Vanilla TypeScript runtime compiled by `tsc`.
- Static HTML generation in `scripts/render.mjs`.
- Build orchestration in `scripts/build.mjs`.
- BASE_PATH-aware routing and assets for GitHub Pages.
- Data-driven project registry in `src/projects/registry.ts`.
- Generic Works/filter architecture that scales when real projects are added.
- Same-origin live project proof module in `src/portfolio/project-proof.ts`.
- SEO/OG, sitemap, robots and noindex rules generated at build time.

## Project registry

Each project contains:

- `slug`
- `title`
- `category`
- `type`
- `year`
- `origin`: `CLIENT | PERSONAL | CONCEPT | EXPERIMENT`
- `status`: `DRAFT | BETA | SHOWCASE | ARCHIVED`
- `shortDescription`
- `cover`
- `previewMedia`
- `caseMedia`
- `services`
- `featured`
- `order`
- `demoRoute`

Only `SHOWCASE` entries appear publicly. Filters remain hidden until published data contains more than one meaningful category. `tests/fixture_qa.mjs` injects a temporary second project only during QA to validate scaling; the fixture never enters production.

## Contact behaviour

No Telegram, email or WhatsApp value is invented. Until real public contact details are supplied, the site exposes the confirmed GitHub technical profile and a local-safe inquiry composer. The form prepares copyable request text and does not fake a successful network submission.

`INPUT_REQUIRED: public Telegram and email; WhatsApp if desired.`

## QA / release gate

CI runs:

1. `npm ci`
2. TypeScript typecheck
3. production build with the pinned real project import
4. static and second-project scalability QA
5. Playwright functional browser flows
6. responsive checks at 390 / 834 / 1440
7. settled-state full-page screenshots for the commercial pages
8. visual artifact upload for independent review
9. GitHub Pages artifact generation from `main`
10. Pages deployment
11. post-deploy production route smoke test

Primary browser flows:

- Home → Works → Case → autonomous Demo
- Home → Services → Contact
- Process → Contact
- mobile navigation
- direct commercial routes at 390 / 834 / 1440
- local-safe contact form
- secondary R&D routes
- reduced-motion fallback

## Release policy

A green build is not enough. V4 should only be merged to `main` after visual review confirms:

- the offering is clear within the first screen;
- real work is the main proof;
- there are no CRITICAL or MAJOR visual findings;
- mobile and desktop feel intentionally composed;
- no AI-template / developer-lab impression remains;
- all functional and production smoke gates pass.
