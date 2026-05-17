<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useNotesStore } from '@/stores/notes';
import type { ModalAction } from '@/types/notes';
import WindowControls from '@/components/WindowControls.vue';
import TabBar from '@/components/TabBar.vue';
import Sidebar from '@/components/Sidebar.vue';
import NoteEditor from '@/components/NoteEditor.vue';
import InputModal from '@/components/InputModal.vue';

const store = useNotesStore();
const modal = ref<ModalAction | null>(null);

onMounted(async () => {
  try {
    await store.load();
  } catch (e) {
    console.error('load_notes failed:', e);
  }
});

function openMain(kind: 'add' | 'rename' | 'delete', name?: string) {
  if (kind === 'add') modal.value = { kind: 'addMain' };
  else if (kind === 'rename' && name) modal.value = { kind: 'renameMain', main: name };
  else if (kind === 'delete' && name) modal.value = { kind: 'deleteMain', main: name };
}

function openSub(kind: 'add' | 'rename' | 'delete', name?: string) {
  if (!store.activeMain) return;
  if (kind === 'add') modal.value = { kind: 'addSub', main: store.activeMain };
  else if (kind === 'rename' && name)
    modal.value = { kind: 'renameSub', main: store.activeMain, sub: name };
  else if (kind === 'delete' && name)
    modal.value = { kind: 'deleteSub', main: store.activeMain, sub: name };
}

async function onConfirm(value: string) {
  const a = modal.value;
  if (!a) return;
  modal.value = null;
  switch (a.kind) {
    case 'addMain': await store.addMain(value); break;
    case 'renameMain': await store.renameMain(a.main, value); break;
    case 'deleteMain': await store.deleteMain(a.main); break;
    case 'addSub': await store.addSub(a.main, value); break;
    case 'renameSub': await store.renameSub(a.main, a.sub, value); break;
    case 'deleteSub': await store.deleteSub(a.main, a.sub); break;
  }
}
</script>

<template>
  <div class="app-shell">
    <WindowControls />
    <TabBar
      :mains="store.mainNames"
      :active="store.activeMain"
      @select="store.selectMain"
      @add="openMain('add')"
      @rename="(n) => openMain('rename', n)"
      @delete="(n) => openMain('delete', n)"
    />
    <main class="body">
      <Sidebar
        :subs="store.subNames"
        :active="store.activeSub"
        :has-main="store.activeMain !== ''"
        @select="store.selectSub"
        @add="openSub('add')"
        @rename="(n) => openSub('rename', n)"
        @delete="(n) => openSub('delete', n)"
      />
      <NoteEditor />
    </main>
    <InputModal :action="modal" @confirm="onConfirm" @cancel="modal = null" />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-shell);
  backdrop-filter: blur(var(--glass-blur)) saturate(140%);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(140%);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-shell);
  overflow: hidden;
  transition: none !important;
  animation: none !important;
}
.body {
  flex: 1;
  display: flex;
  min-height: 0;
  background: var(--bg-block);
}
</style>
