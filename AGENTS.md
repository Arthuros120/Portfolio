# AGENTS.md — Arthur Hamelin portfolio

## Project
Personal portfolio for Arthur Hamelin (full-stack developer, backend-focused). Audience: recruiters and freelance clients in equal measure. The site is available in French and English. This repository is **public**: it is meant to show how Arthur codes and how he works with AI.

## Stack
- Nuxt 4, TypeScript (strict), Nuxt UI, Tailwind CSS. Package manager: pnpm. This is **Nuxt, not Next.js**: never introduce Next.js, React or NextUI.
- Nuxt i18n module: key/value files per locale (fr, en), localized routes generated at build time. The language selector only offers fr and en.
- Nuxt Icon with all icons bundled in the build, never fetched from a remote service at runtime.
- Static site (`nuxt generate`), **no backend**. Content lives in YAML files read at build time (typed and validated; an invalid or missing key fails the build).
- Lint (ESLint), typecheck and build must pass before any pull request.

## Design
- Sober, clear and professional, dev-oriented (monospace touches, small code snippets), with subtle sea and sailing animations.
- Inspired by Arthur's existing draft, not restarted from zero: Nuxt UI primary color `sky`, neutral color `slate`, pill-shaped buttons, configured in `app/app.config.ts`. Keep this palette as the visual reference.

## Contact and links
- Contact by a pre-filled `mailto` link only (subject and body pre-filled, translated fr/en), no form. The address is provided by Arthur and never invented.
- Public links: GitHub (`Arthuros120`), LinkedIn, and Instagram (DJ account). A LinkedIn posts section uses the official LinkedIn embed (see rule 14).

## Golden rules
1. Analyze the existing code before changing anything. Reuse existing components and Nuxt UI components; never reinvent what already exists.
2. Keep it as simple as possible. Prefer less code and fewer dependencies.
3. Accessible (WCAG AA target) and responsive (mobile first): keyboard navigation, labels, aria states, visible focus, readable contrast.
4. Buttons are pill-shaped (fully rounded). Theme: light / dark / auto, user-selectable and persisted.
5. Styles live in separate SCSS files, not in large inline style blocks.
6. Split code into several small files: one component per section, shared reusable components, content separated from components.
7. When asked for code, write complete files (no partial snippets), ready to copy-paste.
8. Code comments in English, JSDoc style. All user-facing text lives in YAML / locale files with the same keys in French and English.
9. No backend and no database. No endpoint to secure; contact is a pre-filled `mailto` link only (no form) unless Arthur decides otherwise.
10. Respect `prefers-reduced-motion`. Animations stay subtle and sober (sea and sailing theme).
11. Do not invent content (projects, numbers, quotes, dates, job titles). Use clearly marked placeholders and ask Arthur.
12. Never publish, deploy, or purchase anything (including a domain name or hosting). Never include private data (address, phone, personal email) without Arthur's explicit approval.
13. The repository is public: never commit API keys, tokens, passwords or `.env` files. Keep `.env*` in `.gitignore`; only a value-free `.env.example` is allowed. Review every diff for secrets and private data before pushing. Run dependency and secret checks before any publication. A leaked secret must be revoked, not just deleted.
14. Third-party content (for example the official LinkedIn embed) must load lazily, have a fallback link, and be reviewed for privacy, performance and security headers.
15. Do not show anything confidential about the Enedis MonOrga project: no application screenshots, no internal figures. Use only what is already public in Arthur's CV.

## Build and delivery
- This repository only builds the site and publishes a package (container image on GHCR, the GitHub registry) via GitHub Actions.
- It contains **no Compose file and no deployment configuration**. Deployment is handled from another repository (`Arthuros120/Minecraft102`, GitHub Actions and GHCR images), whose Compose setup pulls the package published here. Never modify that repository or Arthur's machine.

## Workflow
- One short task per branch, small pull requests. PR summary in English with a conclusion, without author or time.
- Run lint, typecheck and build before opening a PR.
- Ask before any large or ambiguous change. Do not start work that was not requested.
