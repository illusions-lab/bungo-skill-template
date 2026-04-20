<script setup lang="ts">
import { useReadmeHtml } from '../composables/useReadme'
const html = useReadmeHtml()
</script>

<template>
  <section class="readme">
    <div class="readme__inner" v-html="html" />
  </section>
</template>

<style scoped>
.readme {
  padding: 80px 24px;
  border-top: 1px solid #1f1f1f;
}
.readme__inner {
  max-width: 920px;
  margin: 0 auto;
  font-family: var(--font-body);
  color: #d0d0d0;
  line-height: 1.8;
  font-size: 16px;
}
.readme__inner :deep(h1),
.readme__inner :deep(h2),
.readme__inner :deep(h3) {
  font-family: var(--font-title);
  color: #f5f5f5;
  margin: 48px 0 16px;
  line-height: 1.3;
}
.readme__inner :deep(h1) { font-size: 36px; }
.readme__inner :deep(h2) { font-size: 28px; }
.readme__inner :deep(h3) { font-size: 22px; }
.readme__inner :deep(p) { margin: 0 0 16px; }
.readme__inner :deep(a) { color: var(--accent); text-decoration: none; }
.readme__inner :deep(a:hover) { text-decoration: underline; }
.readme__inner :deep(code) {
  font-family: var(--font-mono);
  background: #1a1a1a;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
}
.readme__inner :deep(pre) {
  background: #1a1a1a;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid #2a2a2a;
}
.readme__inner :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 13px;
}
.readme__inner :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
}
.readme__inner :deep(th),
.readme__inner :deep(td) {
  border: 1px solid #2a2a2a;
  padding: 8px 12px;
  text-align: left;
}
.readme__inner :deep(th) {
  background: #1a1a1a;
  font-weight: normal;
  color: #f5f5f5;
}
.readme__inner :deep(blockquote) {
  border-left: 2px solid var(--accent);
  padding: 4px 0 4px 16px;
  margin: 16px 0;
  color: #999;
}
.readme__inner :deep(hr) {
  border: none;
  border-top: 1px solid #2a2a2a;
  margin: 48px 0;
}
.readme__inner :deep(img) {
  max-width: 100%;
  height: auto;
}
.readme__inner :deep(ul),
.readme__inner :deep(ol) {
  padding-left: 24px;
  margin: 0 0 16px;
}
.readme__inner :deep(li) { margin: 4px 0; }
</style>
