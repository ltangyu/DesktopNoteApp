<script setup lang="ts">
defineProps<{
  subs: string[];
  active: string;
  hasMain: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', name: string): void;
  (e: 'add'): void;
  (e: 'rename', name: string): void;
  (e: 'delete', name: string): void;
}>();

function onContext(name: string, ev: MouseEvent) {
  ev.preventDefault();
  emit('delete', name);
}
</script>

<template>
  <aside class="sidebar">
    <div class="header">
      <span class="label">子分類</span>
      <button class="add" :disabled="!hasMain" title="新增子分類" @click="emit('add')">＋</button>
    </div>
    <div class="list">
      <button
        v-for="name in subs"
        :key="name"
        class="sub"
        :class="{ active: name === active }"
        :title="`點擊切換　|　雙擊重命名　|　右鍵刪除`"
        @click="emit('select', name)"
        @dblclick="emit('rename', name)"
        @contextmenu="onContext(name, $event)"
      >
        {{ name }}
      </button>
      <p v-if="hasMain && subs.length === 0" class="empty">尚無子分類</p>
      <p v-if="!hasMain" class="empty">請先選擇主分類</p>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-w);
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px 10px 12px;
}
.label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  letter-spacing: 0.05em;
}
.add {
  width: 24px;
  height: 24px;
  border-radius: var(--radius);
  font-size: 14px;
  color: var(--text-secondary);
  transition: background-color var(--t-fast), opacity var(--t-fast);
}
.add:hover:not(:disabled) {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.add:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  padding: 2px 0 8px 8px; /* 右側 padding 0，讓 active sub 貼齊右緣 */
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.list::-webkit-scrollbar {
  display: none;
}
.sub {
  text-align: left;
  padding: 7px 10px;
  border-radius: var(--radius) 0 0 var(--radius);
  font-size: 12px;
  color: var(--text-secondary);
  transition: background-color var(--t-fast), color var(--t-fast);
  border: 0.5px solid transparent;
  border-right: none;
}
.sub:hover {
  background: var(--bg-block);
  color: var(--text-primary);
  box-shadow: var(--shadow-sub-hover);
}
.sub.active {
  background: var(--bg-block);
  color: var(--text-primary);
  font-weight: 500;
  border-color: transparent;
  border-right: none;
  margin-right: 0;
  position: relative;
  z-index: 1;
  box-shadow: var(--shadow-sub-active);
}
.empty {
  color: var(--text-muted);
  font-size: 11px;
  text-align: center;
  padding: 16px 8px;
  margin: 0;
}
</style>
