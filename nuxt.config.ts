import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'

const baseURL = process.env.NUXT_APP_BASE_URL || '/'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-02',
  modules: ['@nuxt/content', '@nuxtjs/color-mode'],
  css: ['@fontsource-variable/inter', '@fontsource/ibm-plex-mono/400.css', '~/assets/css/main.css'],
  devtools: { enabled: false },
  nitro: { prerender: { routes: ['/search.json', '/rss.xml', '/sitemap.xml', '/robots.txt'] } },
  typescript: { strict: true },
  vite: { plugins: [tailwindcss()] },
  colorMode: { preference: 'system', fallback: 'light', classSuffix: '' },
  runtimeConfig: { public: { siteUrl: 'http://localhost:5240' } },
  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        highlight: {
          theme: { default: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
        },
      },
    },
  },
  hooks: {
    'content:file:afterParse'({ file, content }) {
      if (file.path.endsWith('.md')) {
        content.raw = file.body
        if (!content.readingMinutes)
          content.readingMinutes = Math.max(
            1,
            Math.ceil(file.body.replace(/^---[\s\S]*?---/, '').split(/\s+/).length / 200),
          )
      }
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'Fieldnotes RSS',
          href: `${baseURL}rss.xml`,
        },
      ],
    },
  },
})
