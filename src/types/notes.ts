export type Notes = Record<string, Record<string, string>>;

export type ModalAction =
  | { kind: 'addMain' }
  | { kind: 'renameMain'; main: string }
  | { kind: 'deleteMain'; main: string }
  | { kind: 'addSub'; main: string }
  | { kind: 'renameSub'; main: string; sub: string }
  | { kind: 'deleteSub'; main: string; sub: string };
