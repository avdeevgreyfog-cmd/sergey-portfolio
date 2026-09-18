# Sergey Portfolio

Personal website for Сергей Авдеев. Production: https://avdeevgreyfog-cmd.github.io/sergey-portfolio/

All final releases go to `main`; GitHub Actions builds, checks and deploys to GitHub Pages.

## Build

```sh
npm ci
BASE_PATH=/sergey-portfolio npm run build
npm run typecheck
npm test
```

Browser release checks require `python3 -m pip install -r requirements-dev.txt` and `python3 -m playwright install chromium`:

```sh
npm run test:browser
npm run test:visual
```

## Current architecture

- V10 homepage: editorial workspace direction with a photographic hero, asymmetric service composition, compact process and typography-led Works gateway. The homepage still does not expose project case cards.

- `scripts/v7-build.mjs`: static page templates, metadata and route output.
- `public/assets/css/portfolio.css`: one active stylesheet for all portfolio pages; legacy CSS is not loaded.
- `src/v7-main.ts`: accessible navigation, project filters, email draft preparation.
- `scripts/build-ops-demo.mjs`: preserved standalone Operations OS demonstration.
- `DESIGN.md`: art direction and asset provenance.

Routes: home, works, two existing project cases, about, contact. Services and process legacy URLs remain reachable. The homepage contains no project previews.

Manrope fonts are self-hosted with their OFL license. Orbital art is decorative generated imagery. Operations OS preview uses explicitly marked demo data. The contact form prepares a mailto draft and never claims to send a message automatically.
