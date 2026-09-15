# guangyang.dev

Personal site of **Kevin Yang (杨光)** — Physical AI, multi-agent systems, agent evaluation, and AI for science.

Built with [Astro](https://astro.build), deployed to GitHub Pages via GitHub Actions, served at [guangyang.dev](https://guangyang.dev).

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> ./dist
npm run preview  # preview the build
```

## Deploy

Push to `master` → GitHub Actions builds and deploys to GitHub Pages automatically (see `.github/workflows/deploy.yml`).

Custom domain configured via `public/CNAME` (`guangyang.dev`).
