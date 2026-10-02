<script setup lang="ts">
import { publicUrl } from '~~/shared/editorial'
useSeoMeta({
  title: 'Handbook',
  description:
    'Make this journal your own. A short guide to writing, configuring, and publishing with Fieldnotes.',
})
useHead({
  link: [{ rel: 'canonical', href: publicUrl('/start', useRuntimeConfig().public.siteUrl) }],
})
</script>
<template>
  <main id="main" class="simple-page page-shell" tabindex="-1">
    <div class="simple-title">
      <h1>The handbook.</h1>
      <p>Your words. Your little corner of the web.</p>
      <PixelLantern :size="44" star />
    </div>
    <div class="prose">
      <h2>01 / Make it yours</h2>
      <p>
        Start with <code>shared/site.ts</code>. Set the publication name, introduction, navigation,
        and featured article. Change the palette and typography in
        <code>app/assets/css/main.css</code>. Turn the workbench or decorative footer off if you
        prefer a quieter page.
      </p>
      <h2>02 / Write a note</h2>
      <p>
        Add a Markdown file to <code>content/blog/</code>. Its filename becomes the article URL.
        Give it a title, description, publication date, author, and category. Reading time is
        calculated from the content; you can override it.
      </p>
      <div class="code-block">
        <div class="code-toolbar">content/blog/your-first-note.md</div>
        <pre tabindex="0" role="region" aria-label="Article frontmatter example"><code>---
title: Your first note
description: One useful idea, written down.
date: '2026-10-02'
author: Your name
category: Notes
tags: [writing]
featured: false
---

Start with what you noticed.

## Give the idea some room

Use headings to build the contents tree.</code></pre>
      </div>
      <h2>03 / Add a little structure</h2>
      <p>
        Headings become the article's contents tree automatically. Fenced code blocks get syntax
        highlighting and a Copy action. Tables stay inside their column. You can add a
        <code>callout</code>, a <code>note-figure</code>, or <code>media-tabs</code> using Markdown
        components.
      </p>
      <p>
        <NuxtLink to="/blog/building-for-the-long-way-round">The opening note</NuxtLink>
        demonstrates the complete reading layout.
        <NuxtLink to="/blog/make-the-failure-useful">Make the failure useful</NuxtLink> includes a
        before/after component.
      </p>
      <h2>04 / Keep a draft private</h2>
      <p>
        Put unpublished files inside <code>content/blog/_drafts/</code>. That folder is excluded
        from the content collection entirely. Move a note into the main folder when it's ready for
        readers.
      </p>
      <h2>05 / Publish with care</h2>
      <p>
        Set <code>NUXT_PUBLIC_SITE_URL</code> to your real origin before building. It supplies
        canonical URLs, the RSS feed, and the sitemap. Run <code>pnpm verify</code>, then deploy the
        generated Node server to your host.
      </p>
      <Callout title="Start small"
        ><p>
          One good article is enough. Replace the sample notes, make the About page honest, and give
          someone a reason to come back.
        </p></Callout
      >
    </div>
  </main>
</template>
