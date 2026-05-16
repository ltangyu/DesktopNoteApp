<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { setLocale, getLocale } from '@/i18n';

const { t } = useI18n();
const win = getCurrentWindow();

const otherLocaleLabel = computed(() => (getLocale() === 'en' ? '中' : 'EN'));

function toggleLocale() {
  setLocale(getLocale() === 'en' ? 'zh-TW' : 'en');
}

async function onMinimize() {
  await win.minimize();
}
async function onMaximize() {
  await win.toggleMaximize();
}
async function onClose() {
  await win.close();
}
</script>

<template>
  <header class="titlebar" data-tauri-drag-region>
    <div class="title" data-tauri-drag-region>{{ t('app.title') }}</div>
    <div class="controls">
      <button class="ctrl lang" :title="t('window.languageToggle')" @click="toggleLocale">
        {{ otherLocaleLabel }}
      </button>
      <button class="ctrl" :title="t('window.minimize')" @click="onMinimize">─</button>
      <button class="ctrl" :title="t('window.maximize')" @click="onMaximize">☐</button>
      <button class="ctrl close" :title="t('window.close')" @click="onClose">✕</button>
    </div>
  </header>
</template>

<style scoped>
.titlebar {
  height: var(--titlebar-h);
  background: var(--bg-titlebar);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 0 16px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  flex-shrink: 0;
}
.title {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  pointer-events: none;
}
.controls {
  display: flex;
  gap: 4px;
}
.ctrl {
  width: 28px;
  height: 28px;
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--t-fast), color var(--t-fast);
}
.ctrl:hover {
  background: var(--bg-hover);
}
.ctrl.close:hover {
  background: var(--bg-danger-btn);
  color: var(--text-on-dark);
}
.ctrl.lang {
  width: auto;
  min-width: 28px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
</style>
