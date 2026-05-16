<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useNotesStore } from '@/stores/notes';

const store = useNotesStore();
const local = ref('');
const lastSyncedKey = ref('');

const currentKey = computed(() => `${store.activeMain}::${store.activeSub}`);

watch(
  currentKey,
  (k) => {
    local.value = store.currentContent;
    lastSyncedKey.value = k;
  },
  { immediate: true }
);

let timer: ReturnType<typeof setTimeout> | null = null;

function onInput(ev: Event) {
  const el = ev.target as HTMLTextAreaElement;
  local.value = el.value;
  if (!store.canEdit) return;
  if (timer !== null) clearTimeout(timer);
  timer = setTimeout(() => {
    store.updateContent(local.value);
    void store.persist();
    timer = null;
  }, 300);
}
</script>

<template>
  <section class="editor">
    <textarea
      class="area"
      :value="local"
      :placeholder="store.canEdit ? '開始輸入...' : '請選擇有效的主分類與子分類...'"
      :disabled="!store.canEdit"
      @input="onInput"
    />
  </section>
</template>

<style scoped>
.editor {
  flex: 1;
  padding: 12px 16px 16px 16px;
  background: var(--bg-block);
  display: flex;
  min-width: 0;
}
.area {
  flex: 1;
  background: var(--bg-block);
  color: var(--text-primary);
  border: 0.5px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 14px 16px;
  font-family: inherit;
  font-size: 12px;
  line-height: 1.6;
  resize: none;
  outline: none;
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
}
.area:focus {
  border: 1px solid var(--border-focus);
  box-shadow: 0 0 0 1px var(--border-focus);
}
.area:disabled {
  background: rgba(255, 255, 255, 0.5);
  color: var(--text-muted);
  cursor: not-allowed;
}
</style>
