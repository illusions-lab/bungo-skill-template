<script setup lang="ts">
import { useSkillMeta } from './composables/useSkillMeta'
import Hero from './components/Hero.vue'
import ReadmeContent from './components/ReadmeContent.vue'
import Footer from './components/Footer.vue'

const meta = useSkillMeta()
</script>

<template>
  <main
    class="app"
    :style="{
      '--accent': meta.design?.accent_color ?? '#6B7280',
      '--background': meta.design?.background ?? '#0d0d0d',
      '--font-title': `'${meta.design?.font_title ?? 'Zen Antique'}', 'Hiragino Mincho ProN', 'Yu Mincho', serif`,
      '--font-mono': `'${meta.design?.font_mono ?? 'Fira Code'}', monospace`,
      '--font-body': `'${meta.design?.font_body ?? 'Zen Antique'}', 'Hiragino Mincho ProN', 'Yu Mincho', serif`,
    }"
  >
    <Hero :meta="meta" />
    <ReadmeContent />
    <Footer :meta="meta" />
  </main>
</template>
