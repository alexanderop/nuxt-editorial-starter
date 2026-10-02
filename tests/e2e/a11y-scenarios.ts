// Each entry is exercised by the real-page axe suite. Selectors prove the component is rendered.
export const a11yScenarios = [
  { name: 'about', route: '/about', components: {} },
  { name: 'handbook', route: '/start', components: {} },
  {
    name: 'journal',
    route: '/',
    components: {
      'SiteHeader.vue': '.site-header',
      'SiteFooter.vue': '.site-footer',
      'PostFeed.vue': '.home-feed .post-rows',
      'CategoryFilter.vue': '.categories',
      'Workbench.vue': '.workbench',
      'PixelLantern.vue': '.brand .pixel-lantern',
      'ui/IconButton.vue': 'button[aria-label^="Color theme:"]',
      'ui/ActionLink.vue': '.header-actions a',
    },
  },
  {
    name: 'article',
    route: '/blog/building-for-the-long-way-round',
    components: {
      'ArticleRail.vue': '.article-rail',
      'content/Callout.vue': '.callout',
      'content/NoteFigure.vue': '.note-figure',
      'content/ProsePre.vue': '.code-block',
      'content/ProseTable.vue': '.table-scroll',
    },
  },
  {
    name: 'media',
    route: '/blog/make-the-failure-useful',
    components: { 'content/MediaTabs.vue': '.media-tabs' },
  },
  { name: 'finder', route: '/', components: { 'SearchFinder.vue': '[role="dialog"]' } },
  {
    name: 'error',
    route: '/missing-a11y-example',
    components: { 'ui/BaseButton.vue': 'main button' },
  },
] as const
