<script setup lang="ts">
import { Menu, X, Search, Sun, Moon, Monitor } from '@lucide/vue'
import { site } from '~~/shared/site'
const route = useRoute()
const menuOpen = ref(false)
const finderOpen = useState('finder-open', () => false)
const colorMode = useColorMode()
const themeLabel = computed(() => `Color theme: ${colorMode.preference}. Change theme`)
function openMobileFinder() {
  finderOpen.value = true
  menuOpen.value = false
}
function cycleTheme() {
  colorMode.preference =
    colorMode.preference === 'system'
      ? 'light'
      : colorMode.preference === 'light'
        ? 'dark'
        : 'system'
}
watch(
  () => route.path,
  () => {
    menuOpen.value = false
  },
)
async function navigateByKey(event: KeyboardEvent) {
  if (
    event.defaultPrevented ||
    event.isComposing ||
    event.repeat ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    finderOpen.value ||
    (event.target instanceof HTMLElement &&
      (event.target.isContentEditable ||
        event.target.closest(
          'input, textarea, select, [role="textbox"], [role="combobox"], [role="dialog"], [role="menu"], [role="listbox"]',
        )))
  )
    return
  const destination = site.navigation.find(
    (link) => link.key.toLowerCase() === event.key.toLowerCase(),
  )
  if (!destination) return
  event.preventDefault()
  menuOpen.value = false
  await navigateTo(destination.to)
  await nextTick()
  document.getElementById('main')?.focus({ preventScroll: true })
}
onMounted(() => window.addEventListener('keydown', navigateByKey))
onBeforeUnmount(() => window.removeEventListener('keydown', navigateByKey))
function closeMenu(event: KeyboardEvent) {
  if (event.key === 'Escape') menuOpen.value = false
}
</script>
<template>
  <header class="site-header" @keydown="closeMenu">
    <NuxtLink to="/" class="brand" :aria-label="`${site.name} home`"
      ><PixelLantern :size="44"
    /></NuxtLink>
    <nav class="desktop-nav" aria-label="Main navigation">
      <NuxtLink
        v-for="link in site.navigation"
        :key="link.to"
        :to="link.to"
        :aria-keyshortcuts="link.key.toLowerCase()"
        :aria-current="route.path === link.to ? 'page' : undefined"
        ><span>[{{ link.key }}]</span> {{ link.label }}</NuxtLink
      >
      <button @click="finderOpen = true"><span>[/]</span> Finder</button>
    </nav>
    <div class="header-actions">
      <ClientOnly
        ><button class="icon-button theme-toggle" :aria-label="themeLabel" @click="cycleTheme">
          <Sun v-if="colorMode.preference === 'light'" :size="17" /><Moon
            v-else-if="colorMode.preference === 'dark'"
            :size="17"
          /><Monitor v-else :size="17" /></button
        ><template #fallback><span class="icon-button theme-placeholder" /></template
      ></ClientOnly>
      <NuxtLink class="solid-button" :to="site.featuredPath"
        >Start reading <span aria-hidden="true">↗</span></NuxtLink
      >
      <button
        class="icon-button mobile-menu-button"
        aria-label="Navigation menu"
        :aria-expanded="menuOpen"
        aria-controls="mobile-nav"
        @click="menuOpen = !menuOpen"
      >
        <X v-if="menuOpen" :size="22" /><Menu v-else :size="22" />
      </button>
    </div>
    <nav v-if="menuOpen" id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation">
      <NuxtLink
        v-for="link in site.navigation"
        :key="link.to"
        :to="link.to"
        :aria-keyshortcuts="link.key.toLowerCase()"
        >[{{ link.key }}] {{ link.label }}</NuxtLink
      >
      <button @click="openMobileFinder"><Search :size="15" /> Open Finder</button>
    </nav>
  </header>
</template>
