<script setup lang="ts">
import { computed } from 'vue'
import type { SkillMeta } from '../composables/useSkillMeta'
import { usePortraitPath } from '../composables/useSkillMeta'

const props = defineProps<{ meta: SkillMeta }>()
const portraitPath = computed(() => usePortraitPath(props.meta))
const taglineLines = computed(() => {
  const t = props.meta.tier_1.tagline ?? ''
  // 「、」で2行に分割
  const idx = t.indexOf('、')
  return idx > 0 ? [t.slice(0, idx + 1), t.slice(idx + 1)] : [t]
})
</script>

<template>
  <section class="hero">
    <div class="hero__bg">
      <figure class="hero__portrait" :style="{ backgroundImage: `url(${portraitPath})` }" />
      <div class="hero__fade" />
    </div>

    <div class="hero__content">
      <h1 class="hero__title">{{ meta.tier_1.name_ja }}</h1>
      <p class="hero__skill">.skill</p>
      <div class="hero__tagline">
        <p v-for="(line, i) in taglineLines" :key="i">{{ line }}</p>
      </div>
      <p v-if="meta.tier_2?.description" class="hero__description">
        {{ meta.tier_2.description }}
      </p>
      <div v-if="meta.tier_2?.badges" class="hero__badges">
        <span v-for="badge in meta.tier_2.badges" :key="badge" class="badge">
          {{ badge }}
        </span>
      </div>
    </div>

  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 640px;
  overflow: hidden;
  border-bottom: 1px solid #1f1f1f;
  background: #0d0d0d;
}
.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.hero__portrait {
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 35%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.hero__fade {
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 55%;
  background: linear-gradient(to right,
    rgba(13, 13, 13, 0) 0%,
    rgba(13, 13, 13, 0) 20%,
    #0d0d0d 100%);
}
.hero__content {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 120px 48px 80px;
  text-align: right;
}
.hero__title {
  font-family: var(--font-title);
  font-size: clamp(56px, 8vw, 120px);
  line-height: 1;
  margin: 0;
  color: #f5f5f5;
}
.hero__skill {
  font-family: var(--font-mono);
  font-size: clamp(32px, 5vw, 64px);
  color: var(--accent);
  margin: 8px 0 32px;
  line-height: 1;
}
.hero__tagline {
  font-family: var(--font-body);
  font-size: clamp(16px, 1.8vw, 28px);
  color: #cccccc;
  line-height: 1.4;
  margin: 0 0 24px;
}
.hero__tagline p { margin: 0; }
.hero__description {
  color: #aaa;
  font-size: 16px;
  margin: 0 0 24px;
  max-width: 540px;
  margin-left: auto;
}
.hero__badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.badge {
  border: 1px solid var(--accent);
  border-radius: 999px;
  padding: 4px 14px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--accent);
}
@media (max-width: 768px) {
  .hero { min-height: 520px; }
  .hero__portrait { width: 55%; }
  .hero__content { padding: 80px 24px 60px; }
  .hero__description { max-width: 100%; }
}
</style>
