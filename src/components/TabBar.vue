<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  mains: string[];
  active: string;
}>();

const emit = defineEmits<{
  (e: 'select', name: string): void;
  (e: 'add'): void;
  (e: 'rename', name: string): void;
  (e: 'delete', name: string): void;
}>();

const tabsRef = ref<HTMLElement | null>(null);

function scrollBy(dx: number) {
  tabsRef.value?.scrollBy({ left: dx, behavior: 'smooth' });
}

function onContext(name: string, ev: MouseEvent) {
  ev.preventDefault();
  emit('delete', name);
}
</script>

<template>
  <div class="tabbar">
    <button class="nav" :title="t('tabbar.scrollLeft')" @click="scrollBy(-200)">‹</button>
    <div ref="tabsRef" class="tabs">
      <button
        v-for="name in mains"
        :key="name"
        class="tab"
        :class="{ active: name === active }"
        :title="t('tabbar.tabHint')"
        @click="emit('select', name)"
        @dblclick="emit('rename', name)"
        @contextmenu="onContext(name, $event)"
      >
        {{ name }}
      </button>
    </div>
    <button class="nav" :title="t('tabbar.scrollRight')" @click="scrollBy(200)">›</button>
    <button class="add" :title="t('tabbar.addTooltip')" @click="emit('add')">＋</button>
  </div>
</template>

<style scoped>
.tabbar {
  height: var(--tabbar-h);
  background: var(--bg-sidebar);
  display: flex;
  align-items: flex-end;
  flex-shrink: 0;
  padding: 0 6px;
  gap: 2px;
}
.tabs {
  flex: 1;
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  scroll-behavior: smooth;
}
.tabs::-webkit-scrollbar {
  display: none;
}
.tab {
  font-size: 12px;
  padding: 8px 14px;
  border-radius: var(--radius) var(--radius) 0 0;
  color: var(--text-secondary);
  transition: background-color var(--t-fast), color var(--t-fast);
  border: 0.5px solid transparent;
  margin-bottom: 0;
  flex-shrink: 0;
}
.tab:hover {
  background: var(--bg-block);
  color: var(--text-primary);
  box-shadow: var(--shadow-tab-hover);
}
.tab.active {
  background: var(--bg-block);
  color: var(--text-primary);
  font-weight: 500;
  border-color: transparent;
  border-bottom-color: var(--bg-block);
  margin-bottom: 0;
  position: relative;
  z-index: 1;
  box-shadow: var(--shadow-tab-active);
}
.nav,
.add {
  width: 28px;
  height: 28px;
  border-radius: var(--radius);
  font-size: 16px;
  color: var(--text-secondary);
  transition: background-color var(--t-fast), color var(--t-fast);
  margin-bottom: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.nav:hover,
.add:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.add {
  font-size: 14px;
}
</style>
