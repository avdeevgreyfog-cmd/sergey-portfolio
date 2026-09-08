# Editorial redesign preview

This branch is isolated from main and GitHub Pages. Do not merge or promote before the owner's visual review.

## Run

- `npm ci`
- `PREVIEW=1 npm run build` (imports pinned project assets; network required)
- `npm run dev -- --host 0.0.0.0 --port 4173`
- `npm run typecheck`
- `npm run test:redesign`

Retains vanilla TypeScript and generated static HTML. Vite is only a local static preview server, not a framework migration.

## Content and routes

- Home, `/projects/`, `/services/`, `/process/`, `/contact/`.
- `/works/` remains an alias; `/work/raznye-ludi/` retains the case URL.
- Original project import remains pinned to a566c822170ff8eb27e83e08937e5a37bbb8e8e5.
- Operations OS prototype and existing effects are explicitly identified as experiments, not commercial work.
- Repository's corrupt WebP cover replaced with a real screenshot. New desktop and mobile screenshots were captured from the imported demo. Image compression/cropping preserves the interface.
- Small preview-only CSS repairs resolve clipped mobile demo heading and a zero-height about-section content container.
- Self-hosted Manrope, Latin/Cyrillic; licence included in public/assets/fonts/OFL.txt.

## Known content limitation

The repository contains only the owner's GitHub profile. There is no verified public Telegram, email or submission endpoint. The three-field form validates and prepares copyable text; it explicitly says no message has been sent. Do not add a delivery claim until a real channel is supplied and tested. The pinned client demo also deliberately blocks production submissions and authentication.

## QA

`tests/redesign_qa.py` checks route preservation, local links/resources, heading/metadata basics, image decoding, no fake reference content, explicit experiment status, and contact truthfulness. Existing V6 tests are retained for historical context; their assertions (no project on home, empty category filters) contradict the new brief and are not the redesign gate.

Cloud browser checks use a temporary iframe harness at 1440, 1280, 1024, 768, 390 and 360 CSS px. The harness is not shipped. This verifies responsive CSS widths; it does not emulate device hardware. Native desktop composition is also inspected directly.

Preview deployments use noindex headers. Before any future production release, review those preview-specific headers and the real contact channel.
