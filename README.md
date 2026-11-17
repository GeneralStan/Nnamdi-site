# Nnamdi-site

Personal website for Nnamdi Akajiobi, real estate developer and property advisor, published with GitHub Pages:
https://generalstan.github.io/Nnamdi-site/

Built with Next.js (static export), Tailwind CSS and Motion, from the Figma design (desktop frame `6:987`, mobile frame `22:968`).

## Develop

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Deploy

Every push to `main` builds the site and deploys it to GitHub Pages (`.github/workflows/pages.yml`). The workflow sets `PAGES_BASE_PATH` so assets resolve under `/Nnamdi-site`; locally the site serves from the root.

To check a Pages build locally:

```bash
PAGES_BASE_PATH=/Nnamdi-site pnpm build
```

The output is in `out/`.

## Notes

- Images in `public/images` are pre-compressed WebP; Next's image optimizer is off because Pages only serves static files.
- The contact form is front-end only for now: `src/lib/contact.ts` is the stub to replace with a real form service.
- Motion rules for this site live in `.claude/skills/site-motion/SKILL.md`.
