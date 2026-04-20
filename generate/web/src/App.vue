<script setup lang="ts">
import { useSkillMeta } from './composables/useSkillMeta'
import Hero from './components/Hero.vue'
import ModesSection from './components/ModesSection.vue'
import InstallBlock from './components/InstallBlock.vue'
import FeaturesGrid from './components/FeaturesGrid.vue'
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
    <ModesSection v-if="meta.tier_3?.modes" :modes="meta.tier_3.modes" />
    <InstallBlock v-if="meta.tier_2?.install_command" :command="meta.tier_2.install_command" />
    <FeaturesGrid v-if="meta.tier_3?.key_features" :features="meta.tier_3.key_features" />
    <Footer :meta="meta" />
  </main>
</template>
