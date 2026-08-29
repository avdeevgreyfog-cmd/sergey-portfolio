# Sergey Portfolio V3

Production-oriented multipage personal portfolio for **Сергей Авдеев**.

Public positioning: **Сайты и веб-приложения под ключ**.

## Public sitemap

- `/` — homepage / portfolio cover.
- `/works/` — published work catalog.
- `/work/<slug>/` — visual case presentation.
- `/demo/<slug>/` — autonomous portfolio-safe copy of the actual project.
- `/effects/` — interactive capabilities catalog.
- `/effects/<slug>/` — focused effect experience (`noindex`).
- `/process/` — commercial “Как работаю” page.
- `/contact/` — project inquiry page.

The shell uses real page navigation. Anchor navigation is not used as the primary information architecture.

## Architecture

- Vanilla TypeScript runtime, compiled by `tsc`.
- Static HTML generation in `scripts/render.mjs`.
- Production build orchestration in `scripts/build.mjs`.
- BASE_PATH-aware links and media for GitHub Pages.
- Project registry in `src/projects/registry.ts`.
- Separate runtime modules for homepage, works filters, contact form and effect experiences.
- Clean static routes; no SPA fallback dependency for known pages.

## Project data model

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

Only `SHOWCASE` projects are exposed in the public Works catalog.

Filters on `/works/` are generated from the categories that actually exist in published project data. With only one meaningful category, filters remain hidden. `tests/fixture_qa.mjs` injects a temporary second project **only in QA** to prove that the catalog, filters, featured selection and generic case renderer scale correctly. The fixture never enters production data.

## Current published work

`Разные люди` is currently the only public project.

Origin: `PERSONAL`.

The autonomous demo is imported from the actual source repository:

`https://github.com/avdeevgreyfog-cmd/raznye-ludi-site`

Pinned approved landing commit:

`a566c822170ff8eb27e83e08937e5a37bbb8e8e5`

The build downloads the landing and its project media into the portfolio artifact. The deployed demo does not depend on an iframe or the production project URL.

## Demo safety model

For `/demo/raznye-ludi/` the build:

1. imports the pinned source landing;
2. copies its project assets locally;
3. removes an unrelated injected external script;
4. disables the hidden debug panel;
5. adds `noindex,nofollow`;
6. keeps the demo free from portfolio chrome;
7. prevents production form submission and converts it into a local demo-safe interaction.

This is the template for all future portfolio copies.

## Adding a new project

1. Build the project in its own repository/archive.
2. Create a portfolio-safe copy.
3. Remove secrets/private data.
4. Replace production integrations with demo-safe behaviour.
5. Publish the preserved copy at `/demo/<slug>/`.
6. Add the project entity to `src/projects/registry.ts`.
7. Add or configure its case content/media.
8. Build the generic `/work/<slug>/` presentation.
9. Verify it appears in `/works/` and filters derive from real categories.
10. Optionally set `featured: true` and control homepage order.
11. Run static, fixture, browser and visual QA.
12. Release through the Pages workflow.

## Interactive capabilities

V3 intentionally ships three complete public examples instead of a larger weak lab:

- Video Scroll
- Scroll Story
- Kinetic Typography

The index route `/effects/` is indexable. Individual effect routes are `noindex,nofollow` and are designed as finished visual experiences rather than technical test screens.

## Contact behaviour

No Telegram/email/WhatsApp address is invented. Until the owner provides real public contacts, `/contact/` exposes the confirmed GitHub technical profile and a local-safe inquiry composer. The form does **not** fake-send data to an unknown endpoint; it prepares a copyable request.

`INPUT_REQUIRED: public Telegram and email; WhatsApp if desired.`

## QA

Production CI executes:

1. `npm ci`
2. `npm run typecheck`
3. production build with the real pinned Raznye assets
4. static + fixture/scalability QA
5. Playwright functional flows
6. screenshot visual QA at 390 and 1440 for all primary pages and effect experiences
7. artifact upload for independent visual review
8. GitHub Pages deployment from `main` only

Functional QA covers:

- Home → Works → case → full demo
- Home → Effects → effect experience
- Process → Contact
- direct route opens
- mobile navigation
- contact form local-safe behaviour
- scroll story / kinetic interactions
- reduced motion fallback

## V1 / V2 preservation

The historical V1 branch remains preserved separately. V3 keeps the useful deployment/build/registry/demo-import infrastructure from V2 while replacing the rejected one-page information architecture and frontend presentation.
