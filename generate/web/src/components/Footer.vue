<script setup lang="ts">
import type { SkillMeta } from '../composables/useSkillMeta'

defineProps<{ meta: SkillMeta }>()
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div>
        <p class="footer__name">{{ meta.tier_1.name_ja }}.skill</p>
        <p class="footer__sub">illusions skills marketplace</p>
      </div>
      <ul class="footer__links">
        <li v-if="meta.repo"><a :href="meta.repo">GitHub</a></li>
        <li v-if="meta.license">{{ meta.license }} License</li>
      </ul>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 60px 24px 80px;
  border-top: 1px solid #1f1f1f;
  margin-top: 40px;
}
.footer__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}
.footer__name {
  font-family: var(--font-title);
  font-size: 22px;
  margin: 0;
}
.footer__sub {
  font-family: var(--font-mono);
  font-size: 12px;
  color: #666;
  letter-spacing: 0.15em;
  margin: 4px 0 0;
}
.footer__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 24px;
  font-family: var(--font-mono);
  font-size: 14px;
  color: #888;
}
.footer__links a { color: var(--accent); text-decoration: none; }
.footer__links a:hover { text-decoration: underline; }
</style>
