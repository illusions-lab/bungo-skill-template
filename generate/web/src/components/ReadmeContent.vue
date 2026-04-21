<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import readmeRaw from '@root/README.md?raw'

function stripHeaderImage(md: string): string {
  return md.replace(/!\[og\]\([^)]*\)\s*/g, '')
}

function stripGithubAlerts(md: string): string {
  return md.replace(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n/gim, '')
}

const html = computed(() => {
  marked.setOptions({ gfm: true, breaks: false })
  return marked.parse(stripGithubAlerts(stripHeaderImage(readmeRaw))) as string
})
</script>

<template>
  <section class="readme">
    <div class="readme__inner markdown-body" v-html="html" />
  </section>
</template>

<style scoped>
.readme {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  font-family: var(--font-body);
  color: #cfcfcf;
  line-height: 1.85;
  font-size: 16px;
}

.readme__inner :deep(h1) { display: none; }

.readme__inner :deep(h2),
.readme__inner :deep(h3),
.readme__inner :deep(h4) {
  font-family: var(--font-title);
  color: #f5f5f5;
  line-height: 1.3;
}

.readme__inner :deep(h2) {
  font-size: 28px;
  margin: 56px 0 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #1f1f1f;
}

.readme__inner :deep(h3) {
  font-size: 20px;
  margin: 40px 0 12px;
  color: var(--accent);
}

.readme__inner :deep(h4) {
  font-size: 16px;
  margin: 28px 0 10px;
}

.readme__inner :deep(p) { margin: 0 0 16px; }

.readme__inner :deep(a) {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color .15s;
}
.readme__inner :deep(a:hover) { border-bottom-color: var(--accent); }

.readme__inner :deep(strong) { color: #f5f5f5; }

.readme__inner :deep(code) {
  font-family: var(--font-mono);
  background: #141414;
  color: #e5a0a0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.88em;
}

.readme__inner :deep(pre) {
  background: #141414;
  border: 1px solid #1f1f1f;
  border-radius: 8px;
  padding: 16px 18px;
  overflow-x: auto;
  margin: 20px 0;
}

.readme__inner :deep(pre code) {
  background: none;
  color: #dcdcdc;
  padding: 0;
  font-size: 13px;
  line-height: 1.6;
}

.readme__inner :deep(blockquote) {
  border-left: 3px solid var(--accent);
  background: rgba(229, 160, 160, 0.06);
  padding: 12px 16px;
  margin: 20px 0;
  color: #bcbcbc;
  border-radius: 0 6px 6px 0;
}
.readme__inner :deep(blockquote p:last-child) { margin-bottom: 0; }

.readme__inner :deep(hr) {
  border: none;
  border-top: 1px solid #1f1f1f;
  margin: 56px 0;
}

.readme__inner :deep(ul),
.readme__inner :deep(ol) {
  padding-left: 24px;
  margin: 0 0 18px;
}
.readme__inner :deep(li) { margin: 6px 0; }

.readme__inner :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}

.readme__inner :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 14px;
}
.readme__inner :deep(th),
.readme__inner :deep(td) {
  border: 1px solid #1f1f1f;
  padding: 10px 14px;
  text-align: left;
  vertical-align: top;
  background: #0f0f0f;
}
.readme__inner :deep(th) {
  background: #141414;
  color: #f5f5f5;
  font-weight: 600;
}

@media (max-width: 768px) {
  .readme {
    padding: 32px 18px 60px;
    font-size: 15px;
    line-height: 1.8;
  }
  .readme__inner :deep(h2) {
    font-size: 24px;
    margin: 44px 0 16px;
  }
  .readme__inner :deep(h3) {
    font-size: 18px;
    margin: 32px 0 10px;
  }
  .readme__inner :deep(pre) {
    padding: 12px 14px;
    border-radius: 6px;
  }
  .readme__inner :deep(pre code) { font-size: 12px; }
  .readme__inner :deep(table) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}

@media (max-width: 420px) {
  .readme {
    padding: 24px 14px 48px;
    font-size: 14.5px;
  }
  .readme__inner :deep(h2) { font-size: 22px; }
  .readme__inner :deep(h3) { font-size: 17px; }
  .readme__inner :deep(blockquote) {
    padding: 10px 12px;
    margin: 16px 0;
  }
}
</style>
