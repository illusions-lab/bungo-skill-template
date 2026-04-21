<script setup lang="ts">
import { computed } from 'vue'
import type { SkillMeta } from '../composables/useSkillMeta'
import { usePortraitPath } from '../composables/useSkillMeta'

const props = defineProps<{ meta: SkillMeta }>()
const portraitPath = computed(() => usePortraitPath(props.meta))
const taglineLines = computed(() => {
  const t = props.meta.tier_1.tagline ?? ''
  const idx = t.indexOf('、')
  return idx > 0 ? [t.slice(0, idx + 1), t.slice(idx + 1)] : [t]
})
</script>

<template>
  <section class="hero">
    <figure
      class="hero__portrait"
      :style="{ backgroundImage: `url(${portraitPath})` }"
      :aria-label="`${meta.tier_1.name_ja} portrait`"
    />

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

    <a
      v-if="meta.repo"
      :href="meta.repo"
      class="hero__github"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View source on GitHub"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path fill="currentColor" d="M12 .5C5.73.5.66 5.57.66 11.84c0 5.01 3.25 9.26 7.76 10.76.57.1.78-.25.78-.55 0-.27-.01-.99-.02-1.94-3.16.69-3.83-1.52-3.83-1.52-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.53-2.52-.29-5.18-1.26-5.18-5.61 0-1.24.45-2.26 1.17-3.05-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.16.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.18-1.47 3.14-1.16 3.14-1.16.62 1.59.23 2.76.11 3.05.73.79 1.17 1.81 1.17 3.05 0 4.36-2.66 5.32-5.19 5.6.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.66.79.55 4.5-1.5 7.74-5.75 7.74-10.76C23.34 5.57 18.27.5 12 .5Z"/>
      </svg>
      <span>GitHub</span>
    </a>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(280px, 38%) 1fr;
  min-height: 640px;
  border-bottom: 1px solid #1f1f1f;
  background: #0d0d0d;
}

.hero__portrait {
  margin: 0;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  background-color: #141414;
}

.hero__content {
  padding: 120px 64px 80px;
  text-align: left;
  align-self: center;
  max-width: 720px;
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
}

.hero__badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  border: 1px solid var(--accent);
  border-radius: 999px;
  padding: 4px 14px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--accent);
}

.hero__github {
  position: absolute;
  right: 24px;
  bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  color: #cfcfcf;
  font-family: var(--font-mono);
  font-size: 13px;
  text-decoration: none;
  transition: color .15s;
}
.hero__github:hover { color: var(--accent); }

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    min-height: 0;
  }
  .hero__portrait {
    height: 56vh;
    min-height: 320px;
    max-height: 480px;
  }
  .hero__content {
    padding: 48px 24px 64px;
    text-align: left;
  }
  .hero__title { font-size: clamp(44px, 10vw, 64px); }
  .hero__skill { font-size: clamp(24px, 7vw, 36px); margin: 6px 0 24px; }
  .hero__tagline { font-size: clamp(15px, 3.5vw, 20px); }
  .hero__description { max-width: 100%; font-size: 15px; }
  .hero__github {
    right: 14px;
    bottom: 12px;
    padding: 4px;
    font-size: 12px;
  }
  .hero__github svg { width: 16px; height: 16px; }
}
</style>
