# Fieldnotes — Nuxt Editorial Starter

A **Nuxt 4 + Nuxt Content 3 starter for building a blog like [claude.dev](https://claude.dev/)**: spacious editorial layouts, native scrolling, a sticky reading guide, keyboard navigation, and subtle entrance and hover animations.

**[Live demo](https://alexanderop.github.io/nuxt-editorial-starter/)** · **[Use this template](https://github.com/alexanderop/nuxt-editorial-starter/generate)**

Fieldnotes is the original example publication included with the starter. Replace its branding and twelve sample articles with your own. This is an independent project, not affiliated with or endorsed by Anthropic; it does not include Claude branding, artwork, or article text.

## Run locally

Use Node 22.13+ (or Node 24) and pnpm 10. Native SQLite powers the content database.

```sh
pnpm install
pnpm dev
```

Open http://127.0.0.1:5240. For a production preview:

```sh
pnpm build
PORT=5240 pnpm preview
```

Set `NUXT_PUBLIC_SITE_URL=https://your-domain.example` in deployment to generate correct canonical URLs, RSS links, sitemap entries, and sharing URLs. The default is a local development origin. Both Node hosting and static GitHub Pages hosting are supported. Include the repository path in the site URL for project Pages.

## Included

- Responsive editorial grid, sticky introduction, featured article, category filters, inline search, and load more.
- Page shortcuts: `J` Journal, `H` Handbook, and `A` About. They pause while typing or using Finder/menus.
- Keyboard Finder (`/` or Cmd/Ctrl+K) with article sections and page results.
- Sticky article contents with active nested headings, reading progress, native anchors, copy URL/Markdown, and email sharing.
- Highlighted code with copy buttons, wide table scrolling, callouts, figures, and before/after tabs.
- System/light/dark themes, persistent preference, reduced-motion support, skip link, and visible focus.
- Interactive workbench notes, original starfield footer, related articles, handbook, about page, and 404 page.
- Reading-time generation, RSS, sitemap, robots.txt, social metadata, and draft exclusion.

## Customize

Edit `shared/site.ts` for branding, navigation, categories, featured article, and optional sections. Adjust design tokens in `app/assets/css/tokens.css`. Follow [the design-system policy](docs/design-system.md) for shared controls, semantic utilities, and lint checks. Replace the lantern in `app/components/PixelLantern.vue` and `public/favicon.svg`.

Add Markdown files under `content/blog/`:

```yaml
---
title: A useful title
description: A short summary for search and previews.
date: '2026-10-02'
author: Your name
category: Engineering
tags: [nuxt, design]
featured: false
draft: false
---
```

Categories are validated by `content.config.ts`; update that schema alongside `shared/site.ts`. Reading time is calculated unless supplied explicitly. Use second-level headings for the contents rail and third-level headings for its expanded branch. The example articles demonstrate the MDC components.

Private drafts belong in `content/blog/_drafts/`, which is excluded from the collection. `draft: true` also filters published queries, but excluded folders are the stronger boundary for material that must never enter the content database. Published Markdown is intentionally available through `/markdown/blog/<slug>.md`. Search is prerendered to `/search.json`.

## Verify

```sh
pnpm exec playwright install chromium # first setup only
pnpm verify
```

This runs Oxlint, ESLint design-system checks, Stylelint color checks, Nuxt type checking, Vitest, a production build, and Playwright journeys against the built server. The browser suite exercises search, keyboard navigation, content tools, mobile layouts, normal motion, and reduced motion. It also audits hydration and accessibility; a separate visual suite checks reviewed macOS Chromium baselines. See [browser verification](docs/testing.md) for commands, coverage, and platform requirements.

## Deploy to GitHub Pages

For Copilot review, automatic fixes, and gated merging, see [the AI workflow](docs/ai-workflow.md).
PRs run the same build and visual checks as deployment. `pnpm pr:automerge` starts
Copilot CLI's repair loop; GitHub merges only after the repository requirements pass.
The hosted Copilot fix dispatcher can also request repairs automatically after
reviews; its one-time credential setup is documented in the AI workflow.

1. Create a repository with **Use this template**, or fork this project.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Push to `main` or run **Deploy GitHub Pages** from the Actions tab.

The included workflow verifies the app, generates static HTML, and deploys `.output/public`. Pages metadata supplies the repository base path and public URL automatically. There is no runtime server: articles, search, Markdown downloads, RSS, sitemap, and the content database are generated at build time. Publish new content by committing it and letting the workflow redeploy.

For a local static build at a repository subpath:

```sh
NUXT_APP_BASE_URL=/nuxt-editorial-starter/ \
NUXT_PUBLIC_SITE_URL=https://alexanderop.github.io/nuxt-editorial-starter/ \
pnpm generate
```

For a custom domain, configure it in GitHub Pages settings and let the workflow derive the correct base URL. `pnpm build` and `pnpm preview` remain available for Node hosting.

## Project structure

- `app/`: pages, components, composables, and CSS tokens.
- `content/blog/`: example Markdown posts; `_drafts/` is excluded.
- `shared/`: publication settings and pure helpers.
- `server/`: feeds, search, and Markdown endpoints, also used during prerendering.
- `tests/`: logic tests and browser journeys.
- `.github/workflows/pages.yml`: verification and automatic deployment.

Keep dependencies proportional when customizing. Native scrolling, reduced-motion support, and keyboard access are part of the starter. Hosted video, newsletter delivery, and a terminal/game are not included.

## License

[MIT](LICENSE). Dependency fonts and libraries retain their respective licenses.
