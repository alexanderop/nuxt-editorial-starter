<script setup lang="ts">
import { site } from '~~/shared/site'
useHead({
  titleTemplate: (title) =>
    title ? `${title} — ${site.name}` : `${site.name} — Notes from the workbench`,
})
</script>
<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <SiteHeader />
  <NuxtPage />
  <SiteFooter />
  <SearchFinder />
</template>
