<script setup lang="ts">
defineProps<{ features: string[] }>()
</script>

<template>
  <section class="features">
    <h2 class="features__title">主な特徴</h2>
    <ul class="features__list">
      <li v-for="(feat, i) in features" :key="i" class="feature">
        <span class="feature__num">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="feature__text">{{ feat }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.features { padding: 0 24px 80px; max-width: 1100px; margin: 0 auto; }
.features__title {
  font-family: var(--font-title);
  font-size: 28px;
  margin: 0 0 24px;
}
.features__list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.feature {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 16px 20px;
  background: #111;
  border-left: 3px solid var(--accent);
  border-radius: 0 8px 8px 0;
}
.feature__num {
  font-family: var(--font-mono);
  color: var(--accent);
  font-size: 14px;
}
.feature__text {
  font-family: var(--font-title);
  font-size: 18px;
  color: #ddd;
}
</style>
