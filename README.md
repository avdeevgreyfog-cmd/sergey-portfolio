# Сергей — developer portfolio

Production-oriented static TypeScript portfolio with four integrated showcase demos and an Interactive Lab.

## Stack

- TypeScript (strict mode), ES modules
- Semantic HTML + responsive CSS
- No runtime framework or third-party JS dependencies
- Seeded demo state for forms, e-commerce and CRM interactions
- Static multi-page output suitable for Vercel, Netlify, Cloudflare Pages or any static host

## Local run

```bash
npm install
npm run typecheck
npm run build
npm run serve
```

Open `http://localhost:4173/`.

## Production build

```bash
SITE_URL="https://your-domain.example" npm run build
```

`SITE_URL` is optional during local development. When set, the build emits absolute canonical links for every public page.


## GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`. For the repository `avdeevgreyfog-cmd/sergey-portfolio`, every push to `main` builds and publishes the portfolio to:

`https://avdeevgreyfog-cmd.github.io/sergey-portfolio/`

The build uses `BASE_PATH=/sergey-portfolio`, so internal navigation and static assets work correctly on a GitHub project site instead of assuming a root-domain deployment. In GitHub open **Settings → Pages** and set **Source** to **GitHub Actions** if it is not selected automatically.

For a root domain or Vercel deployment, omit `BASE_PATH` and set only `SITE_URL` to the final public URL.

## Adding a project

1. Add a new typed entity in `src/data.ts`.
2. Use one of the allowed origins: `CLIENT`, `PERSONAL`, `CONCEPT`, `EXPERIMENT`.
3. Use one of the internal statuses: `DRAFT`, `BETA`, `SHOWCASE`, `ARCHIVED`. `DRAFT` is automatically excluded from public project lists.
4. Add a case route and demo route in `scripts/build.mjs`.
5. Add a render function for the demo in `src/app.ts` and map it in `renderDemo()`.
6. Keep project-specific design inside the demo namespace. Do not leak demo styles into the portfolio shell.
7. Use demo-safe content. Do not copy private contacts, customer data, prices, analytics or integrations into the portfolio version without permission.
8. Run `npm run typecheck && npm run build && npm test` before release.

## Reusable foundations

The current release separates the portfolio shell from four functional foundations:

- landing / brand storytelling
- corporate / B2B information architecture + form state
- ecommerce / catalog + product + cart + checkout state
- webapp / dashboard + table + status + calculator state

Common interaction patterns include navigation, drawers, modals, form validation, loading/success/error states, filtering, search, responsive tables and lightweight interactive scenes.

## Demo content policy

`VECTOR Engineering` and `LUMA Objects` are explicitly concept/demo businesses. Their company names, objects, products and prices are not presented as real client achievements. `Р-Кадры Demo` uses an anonymized seeded dataset. Demo forms and checkout do not transmit data or process payments.

## Contact

The current public CTA uses the verified GitHub profile `avdeevgreyfog-cmd`. Add a preferred Telegram/email/phone only when a real public contact is supplied.

## Deployment

The build output is `dist/`. The generated `dist/vercel.json` applies `noindex` headers to demo routes. Public project pages remain indexable.
