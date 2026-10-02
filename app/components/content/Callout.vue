<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: 'A note in the margin' })
</script>
<template>
  <aside class="callout">
    <div class="eyebrow">↳ {{ title }}</div>
    <slot />
  </aside>
</template>
