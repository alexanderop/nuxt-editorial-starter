<script setup lang="ts">
defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  meta?: string
  class?: string
}>()
const { copy, message } = useCopy()
</script>
<template>
  <div class="code-block">
    <div class="code-toolbar">
      <span
        >Code <span class="muted">{{ filename || language || 'text' }}</span></span
      ><button :aria-label="`Copy ${language || ''} code`" @click="copy(code ?? '')">
        {{ message === 'Copied' ? 'Copied ✓' : 'Copy' }}
      </button>
    </div>
    <pre :class="$props.class"><slot /></pre>
    <span class="sr-only" role="status">{{ message }}</span>
  </div>
</template>
