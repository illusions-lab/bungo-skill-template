<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ command: string }>()
const copied = ref(false)

function copy() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(props.command).then(() => {
      copied.value = true
      setTimeout(() => (copied.value = false), 1500)
    })
  }
}
</script>

<template>
  <section class="install">
    <h2 class="install__title">インストール</h2>
    <div class="install__box">
      <code class="install__code">$ {{ command }}</code>
      <button class="install__copy" @click="copy">
        {{ copied ? 'copied!' : 'copy' }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.install { padding: 0 24px 80px; max-width: 1100px; margin: 0 auto; }
.install__title {
  font-family: var(--font-title);
  font-size: 28px;
  margin: 0 0 24px;
}
.install__box {
  background: #0a0a0a;
  border: 1px solid var(--accent);
  border-radius: 8px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.install__code {
  font-family: var(--font-mono);
  font-size: 16px;
  color: #e5e5e5;
  word-break: break-all;
}
.install__copy {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}
.install__copy:hover { background: var(--accent); color: #000; }
</style>
