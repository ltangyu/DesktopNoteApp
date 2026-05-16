import { defineStore } from 'pinia';
import { invoke } from '@tauri-apps/api/core';
import type { Notes } from '@/types/notes';

interface State {
  notes: Notes;
  activeMain: string;
  activeSub: string;
  loaded: boolean;
}

export const useNotesStore = defineStore('notes', {
  state: (): State => ({
    notes: {},
    activeMain: '',
    activeSub: '',
    loaded: false,
  }),
  getters: {
    mainNames: (s): string[] => Object.keys(s.notes),
    subNames(): string[] {
      const m = this.notes[this.activeMain];
      return m ? Object.keys(m) : [];
    },
    currentContent(): string {
      const m = this.notes[this.activeMain];
      if (!m) return '';
      return m[this.activeSub] ?? '';
    },
    canEdit(): boolean {
      return this.activeMain !== '' && this.activeSub !== '';
    },
  },
  actions: {
    async load() {
      this.notes = await invoke<Notes>('load_notes');
      this.loaded = true;
      const mains = Object.keys(this.notes);
      if (mains.length > 0) {
        const first = mains[0]!;
        this.activeMain = first;
        const subs = Object.keys(this.notes[first] ?? {});
        this.activeSub = subs[0] ?? '';
      }
    },
    async persist() {
      await invoke('save_notes', { notes: this.notes });
    },

    selectMain(name: string) {
      if (!(name in this.notes)) return;
      this.activeMain = name;
      const subs = Object.keys(this.notes[name] ?? {});
      this.activeSub = subs[0] ?? '';
    },
    selectSub(name: string) {
      const m = this.notes[this.activeMain];
      if (m && name in m) this.activeSub = name;
    },

    async addMain(name: string) {
      const trimmed = name.trim();
      if (!trimmed || trimmed in this.notes) return;
      this.notes[trimmed] = {};
      this.activeMain = trimmed;
      this.activeSub = '';
      await this.persist();
    },
    async renameMain(oldName: string, newName: string) {
      const trimmed = newName.trim();
      if (!trimmed || trimmed === oldName || trimmed in this.notes) return;
      const data = this.notes[oldName];
      if (!data) return;
      const rebuilt: Notes = {};
      for (const k of Object.keys(this.notes)) {
        if (k === oldName) {
          rebuilt[trimmed] = data;
        } else {
          rebuilt[k] = this.notes[k]!;
        }
      }
      this.notes = rebuilt;
      if (this.activeMain === oldName) this.activeMain = trimmed;
      await this.persist();
    },
    async deleteMain(name: string) {
      if (!(name in this.notes)) return;
      delete this.notes[name];
      if (this.activeMain === name) {
        const remaining = Object.keys(this.notes);
        const next = remaining[0] ?? '';
        this.activeMain = next;
        const subs = next ? Object.keys(this.notes[next] ?? {}) : [];
        this.activeSub = subs[0] ?? '';
      }
      await this.persist();
    },

    async addSub(main: string, sub: string) {
      const trimmed = sub.trim();
      const m = this.notes[main];
      if (!trimmed || !m || trimmed in m) return;
      m[trimmed] = '';
      this.activeMain = main;
      this.activeSub = trimmed;
      await this.persist();
    },
    async renameSub(main: string, oldSub: string, newSub: string) {
      const trimmed = newSub.trim();
      const m = this.notes[main];
      if (!trimmed || !m || trimmed === oldSub || trimmed in m) return;
      const content = m[oldSub];
      if (content === undefined) return;
      const rebuilt: Record<string, string> = {};
      for (const k of Object.keys(m)) {
        if (k === oldSub) {
          rebuilt[trimmed] = content;
        } else {
          rebuilt[k] = m[k]!;
        }
      }
      this.notes[main] = rebuilt;
      if (this.activeSub === oldSub) this.activeSub = trimmed;
      await this.persist();
    },
    async deleteSub(main: string, sub: string) {
      const m = this.notes[main];
      if (!m || !(sub in m)) return;
      delete m[sub];
      if (this.activeMain === main && this.activeSub === sub) {
        const remaining = Object.keys(m);
        this.activeSub = remaining[0] ?? '';
      }
      await this.persist();
    },

    updateContent(content: string) {
      if (!this.canEdit) return;
      const m = this.notes[this.activeMain];
      if (!m) return;
      m[this.activeSub] = content;
    },
  },
});
