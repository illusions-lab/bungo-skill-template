<script setup lang="ts">
defineProps<{ modes: Array<{ icon: string; name: string; desc: string }> }>()
</script>

<template>
  <section class="modes">
    <h2 class="modes__title">3つの動作モード</h2>
    <div class="modes__grid">
      <article v-for="mode in modes" :key="mode.name" class="mode">
        <div class="mode__icon">{{ mode.icon }}</div>
        <h3 class="mode__name">{{ mode.name }}</h3>
        <p class="mode__desc">{{ mode.desc }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.modes { padding: 80px 24px; max-width: 1100px; margin: 0 auto; }
.modes__title {
  font-family: var(--font-title);
  font-size: 32px;
  text-align: center;
  margin: 0 0 48px;
}
.modes__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.mode {
  background: #111;
  border: 1px solid #1f1f1f;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
}
.mode__icon {
  font-family: var(--font-mono);
  color: var(--accent);
  font-size: 14px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 16px;
}
.mode__name {
  font-family: var(--font-title);
  font-size: 32px;
  margin: 0 0 8px;
}
.mode__desc { color: #aaa; font-size: 15px; margin: 0; }
@media (max-width: 768px) {
  .modes__grid { grid-template-columns: 1fr; }
}
</style>
