<script setup lang="ts">
import { site } from '~~/shared/site'
const finderOpen = useState('finder-open', () => false)
const dots = Array.from({ length: 75 }, (_, i) => ({
  x: (i * 179 + 47) % 1440,
  y: (i * 97 + 31) % 430,
  r: i % 4 === 0 ? 1.8 : 0.8,
}))
</script>
<template>
  <footer class="site-footer">
    <div class="footer-grid">
      <div class="footer-identity">
        <NuxtLink to="/" class="footer-wordmark">{{ site.wordmark }}</NuxtLink>
        <p class="footer-colophon">An independent notebook.<br />Made slowly, for the open web.</p>
        <span class="micro muted">© {{ new Date().getFullYear() }} {{ site.name }}</span>
      </div>
      <nav aria-label="Explore">
        <h2 class="eyebrow">Explore</h2>
        <NuxtLink to="/">Journal</NuxtLink><NuxtLink to="/start">Handbook</NuxtLink
        ><NuxtLink to="/about">About</NuxtLink
        ><button @click="finderOpen = true">Find a note <span aria-hidden="true">↗</span></button>
      </nav>
      <nav aria-label="Elsewhere">
        <h2 class="eyebrow">Built with</h2>
        <a href="https://nuxt.com/">Nuxt ↗</a><a href="https://content.nuxt.com/">Nuxt Content ↗</a
        ><a href="https://reka-ui.com/">Reka UI ↗</a>
      </nav>
      <div class="footer-subscribe">
        <h2 class="eyebrow">Keep a little room for curiosity</h2>
        <p>No algorithm. No noise. New notes, delivered to your favorite feed reader.</p>
        <a :href="`${useRuntimeConfig().app.baseURL}rss.xml`" class="rss-link"
          >Subscribe via RSS <span aria-hidden="true">↗</span></a
        >
        <p class="micro muted">An open feed. Yours to read however you like.</p>
      </div>
    </div>
    <div v-if="site.showSpaceFooter" class="space-footer" aria-hidden="true">
      <svg class="star-map" viewBox="0 0 1440 440" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="dot-grid" width="9" height="9" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.3" fill="currentColor" />
          </pattern>
          <mask id="crescent">
            <!-- Luminance mask: white reveals the shape. -->
            <circle cx="202" cy="175" r="83" fill="var(--mask-reveal)" />
            <!-- Luminance mask: black cuts out the crescent. -->
            <circle cx="235" cy="144" r="82" fill="var(--mask-cutout)" />
          </mask>
        </defs>
        <circle
          v-for="(dot, i) in dots"
          :key="i"
          :cx="dot.x"
          :cy="dot.y"
          :r="dot.r"
          fill="currentColor"
        />
        <circle cx="202" cy="175" r="85" fill="url(#dot-grid)" mask="url(#crescent)" />
        <ellipse
          cx="1210"
          cy="325"
          rx="190"
          ry="82"
          transform="rotate(-25 1210 325)"
          fill="url(#dot-grid)"
        />
      </svg>
      <div class="floating-lantern">
        <PixelLantern :size="58" /><span>A little light for the next idea.</span>
      </div>
      <span class="space-coordinate">48° N / STILL EXPLORING</span>
    </div>
  </footer>
</template>
