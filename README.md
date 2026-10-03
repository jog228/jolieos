# Jolie Goldstein — Portfolio

Personal portfolio site built with [Next.js](https://nextjs.org) and TypeScript, styled with
[Tailwind CSS](https://tailwindcss.com) and animated with [Framer Motion](https://www.framer.com/motion/).
Deployed on [Vercel](https://vercel.com).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project structure

- `app/` — Next.js App Router pages, root layout, and metadata (SEO, Open Graph, Twitter card)
- `components/sections/` — the page sections (Hero, About, Experience, Press, Skills, Contact). Experience is a unified timeline: each entry is a role/engagement, with its projects nested inside it.
- `components/layout/` — shared layout components (header, footer, container)
- `components/ui/` — small reusable UI primitives (e.g. scroll-triggered reveal animation)
- `lib/` — content data for the site (experience/projects, press mentions) plus shared utilities
- `providers/` — React context providers (theme/dark-mode)

## Environment variables

`env.example` lists `GITHUB_USERNAME` and `GITHUB_TOKEN`. These are currently unused by the
codebase — no `.env` file is required to run the site locally.

## Build

```bash
npm run build
```
