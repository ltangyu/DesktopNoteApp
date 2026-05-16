export default {
  app: {
    title: 'DesktopNoteApp',
  },
  window: {
    minimize: 'Minimize',
    maximize: 'Maximize / Restore',
    close: 'Close',
    languageToggle: 'Switch language',
  },
  tabbar: {
    addTooltip: 'Add category',
    scrollLeft: 'Scroll left',
    scrollRight: 'Scroll right',
    tabHint: 'Click to switch · Double-click to rename · Right-click to delete',
  },
  sidebar: {
    label: 'Subcategories',
    addTooltip: 'Add subcategory',
    emptyNoSub: 'No subcategories yet',
    emptyNoMain: 'Select a category first',
    subHint: 'Click to switch · Double-click to rename · Right-click to delete',
  },
  editor: {
    placeholder: 'Start typing...',
    placeholderEmpty: 'Select a category and subcategory to start',
  },
  modal: {
    addMain: 'New category',
    renameMain: 'Rename category "{name}"',
    deleteMain: 'Delete category "{name}"?',
    addSub: 'New subcategory in "{main}"',
    renameSub: 'Rename subcategory "{name}"',
    deleteSub: 'Delete subcategory "{name}"?',
    deleteWarning: 'This action cannot be undone.',
    confirm: 'Confirm',
    cancel: 'Cancel',
    delete: 'Delete',
  },
} as const;
