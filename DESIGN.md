# Redesign preview: Sergey Avdeev

Source: ten attached visual references, inspected individually; current main d810c60.

Thesis: an independent developer's editorial portfolio, where the working website is the evidence.
Signature: large, carefully composed Russian typography meets an actual dark project screen on a warm architectural surface; continue with an oversized featured case and open editorial rows.
Palette: paper #F5F3EE, ink #0F0F0F, white #FFFFFF, surface #E8E6E0, secondary #68645E, accent #E96324 (markers and interaction only).
Typography: self-hosted Manrope, Cyrillic and Latin, SIL OFL; H1 64–88 desktop / 40–48 mobile, body 17–19, tight display leading.
Layout: 1280px maximum, 12-column logic, 96–128px section rhythm; real case takes precedence over explicitly labelled experiments. Narrower reading blocks alternate with wide media.
Surfaces: 4–8px radius on media and buttons, fine borders, no elevation except restrained interactive states and physical screen presentation.
Imagery: actual interface captures and the pinned original project's assets; no generated screenshots, invented clients or stock workspace imagery.
Motion: short hover translations and image scale, optional reveals; reduced-motion disables them. No automatic decorative video.
Truth: only Raznye Ludi is a published case. Existing Operations OS prototype and effects remain experiments. No metrics, testimonials or availability claims. Repository has no Telegram/email, so contact prepares copyable text and must not claim delivery.
Architecture: retain vanilla TypeScript and static renderer. A dedicated editorial renderer replaces legacy layout transforms on primary routes; original effect implementations and pinned demos stay available. /projects added; /works and /work/raznye-ludi retained.
Release: separate redesign-preview branch, preview deployment only; main and GitHub Pages untouched.
