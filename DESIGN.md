# Redesign preview: Sergey Avdeev

Source: ten attached visual references, inspected individually; current main d810c60.

Thesis: the home page is a concise introduction to an independent web developer; the portfolio is a separate, dense catalogue built to grow as new work appears.
Signature: a restrained practice-style navigation with a distinct `Мои работы` route, followed by a compact work index where media, status and project type are scannable before a visitor opens a case.
Palette: mineral paper #F5F3EE, ink #0F0F0F, white #FFFFFF, surface #E8E6E0, secondary #68645E, accent #E96324 used only for focus and active states.
Typography: self-hosted Manrope, Cyrillic and Latin, SIL OFL. Display copy is sized for reading rather than spectacle; no decorative all-caps rhythm or forced line-break slogans.
Layout: 1280px maximum. The home page alternates a presentation column, practical scope and one selected project. `/projects/` uses a dense 2-column catalog rather than oversized showcase tiles.
Surfaces: fine borders, 4–8px radius only where media or a real control requires containment. No floating-card treatment for ordinary content.
Imagery: actual interface captures and the pinned original project's assets; no generated screenshots, invented clients or stock workspace imagery.
Motion: short hover translations and image scale for project navigation. Reduced-motion disables all nonessential movement.
Truth: only Raznye Ludi is a published case. Existing Operations OS prototype and effects remain experiments. No metrics, testimonials or availability claims. Repository has no Telegram/email, so contact prepares copyable text and must not claim delivery.
Architecture: retain vanilla TypeScript and static renderer. A dedicated editorial renderer replaces legacy layout transforms on primary routes; original effect implementations and pinned demos stay available. `/projects/` added; `/works/` and `/work/raznye-ludi/` retained.
Release: separate redesign-preview branch, preview deployment only; main and GitHub Pages untouched.
