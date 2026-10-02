<script setup lang="ts">
import { publicUrl } from '~~/shared/editorial'
import { site } from '~~/shared/site'
useSeoMeta({
  title: 'About',
  description: 'An independent notebook for people who care about how the web is made.',
})
useHead({
  link: [{ rel: 'canonical', href: publicUrl('/about', useRuntimeConfig().public.siteUrl) }],
})
</script>
<template>
  <main id="main" class="simple-page page-shell" tabindex="-1">
    <div class="simple-title">
      <h1>A small notebook.</h1>
      <p>For a very big web.</p>
      <PixelLantern :size="48" />
    </div>
    <div class="prose">
      <h2>Leave something useful behind</h2>
      <p>
        {{ site.name }} is a place for the things you notice while making things. The tiny interface
        decision that changes everything. The bug that teaches you how a system really works. The
        idea you keep coming back to.
      </p>
      <p>
        We like software with a point of view, documentation you can follow, and tools that leave
        people a little more capable than they found them.
      </p>
      <blockquote>
        <p>Good notes don't have to be the last word. They just have to be a useful next one.</p>
      </blockquote>
      <h2>Slow publishing, open reading</h2>
      <p>
        There is no publishing calendar to satisfy here. Notes arrive when there's something worth
        sharing. Every entry is available as Markdown, and the
        <a :href="`${useRuntimeConfig().app.baseURL}rss.xml`">RSS feed</a> is open to whichever
        reader feels like home.
      </p>
      <h2>Make this space your own</h2>
      <p>
        This journal is also a starting point. It runs on Nuxt and Nuxt Content, with an editorial
        layout built for reading. The <NuxtLink to="/start">handbook</NuxtLink> explains how to
        replace these notes with your own.
      </p>
      <p>
        The sample writing is original demonstration content. The layout takes inspiration from the
        careful typography and reading experience of <a href="https://claude.dev/">claude.dev</a>.
      </p>
      <div class="about-signature">
        <PixelLantern :size="38" /><span>Keep a light on.<br />The Fieldnotes editors</span>
      </div>
    </div>
  </main>
</template>
