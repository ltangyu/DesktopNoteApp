<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ModalAction } from '@/types/notes';

const { t } = useI18n();

const props = defineProps<{
  action: ModalAction | null;
}>();

const emit = defineEmits<{
  (e: 'confirm', value: string): void;
  (e: 'cancel'): void;
}>();

const value = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

const isDelete = computed(() => {
  const a = props.action;
  return a !== null && (a.kind === 'deleteMain' || a.kind === 'deleteSub');
});

const title = computed(() => {
  const a = props.action;
  if (!a) return '';
  switch (a.kind) {
    case 'addMain': return t('modal.addMain');
    case 'renameMain': return t('modal.renameMain', { name: a.main });
    case 'deleteMain': return t('modal.deleteMain', { name: a.main });
    case 'addSub': return t('modal.addSub', { main: a.main });
    case 'renameSub': return t('modal.renameSub', { name: a.sub });
    case 'deleteSub': return t('modal.deleteSub', { name: a.sub });
  }
});

const description = computed(() => {
  const a = props.action;
  if (!a) return '';
  if (a.kind === 'deleteMain' || a.kind === 'deleteSub') {
    return t('modal.deleteWarning');
  }
  return '';
});

watch(
  () => props.action,
  async (a) => {
    if (!a) return;
    if (a.kind === 'renameMain') value.value = a.main;
    else if (a.kind === 'renameSub') value.value = a.sub;
    else value.value = '';
    await nextTick();
    inputRef.value?.focus();
    inputRef.value?.select();
  }
);

function onConfirm() {
  if (isDelete.value) {
    emit('confirm', '');
  } else {
    const v = value.value.trim();
    if (!v) return;
    emit('confirm', v);
  }
}

function onKeydown(ev: KeyboardEvent) {
  if (ev.key === 'Enter') onConfirm();
  else if (ev.key === 'Escape') emit('cancel');
}
</script>

<template>
  <div v-if="action" class="overlay" @click.self="emit('cancel')" @keydown="onKeydown">
    <div class="modal">
      <h2 class="title">{{ title }}</h2>
      <p v-if="description" class="desc">{{ description }}</p>
      <input
        v-if="!isDelete"
        ref="inputRef"
        v-model="value"
        type="text"
        class="input"
        @keydown="onKeydown"
      />
      <div class="actions">
        <button class="btn ghost" @click="emit('cancel')">{{ t('modal.cancel') }}</button>
        <button
          class="btn"
          :class="isDelete ? 'danger' : 'primary'"
          @click="onConfirm"
        >
          {{ isDelete ? t('modal.delete') : t('modal.confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: var(--bg-block);
  border-radius: var(--radius);
  border: 0.5px solid var(--border-subtle);
  box-shadow: var(--shadow-modal);
  padding: 20px 22px 16px;
  min-width: 340px;
  max-width: 480px;
}
.title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}
.desc {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--text-secondary);
}
.input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-primary);
  background: var(--bg-block);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius);
  outline: none;
  margin-bottom: 16px;
  transition: border-color var(--t-base);
}
.input:focus {
  border-color: var(--border-focus);
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.btn {
  padding: 6px 16px;
  border-radius: var(--radius);
  font-size: 13px;
  font-family: inherit;
  transition: background-color var(--t-fast), color var(--t-fast), border-color var(--t-fast);
  border: 1px solid transparent;
}
.btn.ghost {
  color: var(--text-secondary);
  border-color: var(--border-subtle);
}
.btn.ghost:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.btn.primary {
  background: var(--bg-primary-btn);
  color: var(--text-on-dark);
}
.btn.primary:hover {
  background: #000;
}
.btn.danger {
  background: var(--bg-danger-btn);
  color: var(--text-on-dark);
}
.btn.danger:hover {
  background: #c20e1f;
}
</style>
