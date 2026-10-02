<script setup lang="ts">
const selected = ref(0)
async function onTabKey(event: KeyboardEvent) {
  const direction = ['ArrowDown', 'ArrowRight'].includes(event.key)
    ? 1
    : ['ArrowUp', 'ArrowLeft'].includes(event.key)
      ? -1
      : 0
  if (!direction && !['Home', 'End'].includes(event.key)) return
  event.preventDefault()
  selected.value =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? notes.length - 1
        : (selected.value + direction + notes.length) % notes.length
  await nextTick()
  document.getElementById(`note-tab-${selected.value}`)?.focus()
}
const notes = [
  {
    title: 'Local first. Human always.',
    category: 'Engineering',
    label: '01 / A SMALLER ROUND TRIP',
    path: '/blog/a-small-case-for-local-first',
    text: 'Keep the work close to the person doing it. Sync can catch up.',
    nodes: ['You', 'Your device', 'The network'],
  },
  {
    title: 'The space between things',
    category: 'Design',
    label: '02 / ROOM TO THINK',
    path: '/blog/the-space-between-things',
    text: 'A rhythm of small, medium, and generous. Let the important things breathe.',
    nodes: ['8', '24', '72'],
  },
  {
    title: 'Make the failure useful',
    category: 'Workflow',
    label: '03 / ONE GOOD NEXT STEP',
    path: '/blog/make-the-failure-useful',
    text: 'Every error is a conversation. Leave the reader with somewhere to go.',
    nodes: ['Notice', 'Explain', 'Recover'],
  },
]
const current = computed(() => notes[selected.value] ?? notes[0]!)
</script>
<template>
  <section class="workbench" aria-labelledby="workbench-heading">
    <div class="section-heading">
      <h2 id="workbench-heading">From the workbench</h2>
      <span class="eyebrow muted">Small ideas, drawn out</span>
    </div>
    <div class="workbench-grid">
      <div>
        <div class="workbench-list" role="tablist" aria-label="Visual notes">
          <button
            v-for="(note, index) in notes"
            :id="`note-tab-${index}`"
            :key="note.title"
            role="tab"
            :aria-selected="selected === index"
            :tabindex="selected === index ? 0 : -1"
            @keydown="onTabKey"
            aria-controls="workbench-panel"
            @click="selected = index"
          >
            <span>{{ note.title }}</span
            ><span class="workbench-arrow" aria-hidden="true">↗</span
            ><small
              >{{ note.category }}
              <span>Visual note {{ String(index + 1).padStart(2, '0') }}</span></small
            >
          </button>
        </div>
        <NuxtLink to="/about" class="eyebrow workbench-more"
          >A notebook, not a news cycle ↗</NuxtLink
        >
      </div>
      <div
        id="workbench-panel"
        class="workbench-panel"
        role="tabpanel"
        :aria-labelledby="`note-tab-${selected}`"
      >
        <div class="diagram-label">
          {{ current.label }}<span>FIELDNOTES / FIG. {{ selected + 1 }}</span>
        </div>
        <div class="diagram" :class="`diagram-${selected}`">
          <div
            v-for="(node, index) in current.nodes"
            :key="`${selected}-${node}`"
            class="diagram-node"
          >
            <span class="diagram-marker"
              ><PixelLantern v-if="index === 0 && selected === 0" :size="34" /><span v-else>{{
                selected === 1 ? '·'.repeat(index + 1) : String(index + 1).padStart(2, '0')
              }}</span></span
            ><span>{{ node }}</span
            ><span v-if="index < 2" class="diagram-arrow" aria-hidden="true">→</span>
          </div>
        </div>
        <p>{{ current.text }}</p>
        <NuxtLink :to="current.path">Read the note <span aria-hidden="true">↗</span></NuxtLink>
      </div>
    </div>
  </section>
</template>
