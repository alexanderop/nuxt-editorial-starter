<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()
</script>
<template>
  <main class="page-shell" style="padding-block: 100px; min-height: 100vh">
    <PixelLantern :size="60" />
    <p class="eyebrow" style="margin-top: 30px">{{ error.statusCode }} / A blank page</p>
    <h1 style="font-size: 32px; margin: 20px 0">This note isn't here.</h1>
    <p class="muted" style="margin-bottom: 30px">
      The address may have changed. There's more to discover in the journal.
    </p>
    <button class="solid-button" @click="clearError({ redirect: '/' })">
      Back to the journal ↗
    </button>
  </main>
</template>
