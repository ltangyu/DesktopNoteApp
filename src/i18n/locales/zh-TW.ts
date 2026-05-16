export default {
  app: {
    title: '極簡記事本',
  },
  window: {
    minimize: '最小化',
    maximize: '最大化 / 還原',
    close: '關閉',
    languageToggle: '切換語言',
  },
  tabbar: {
    addTooltip: '新增主分類',
    scrollLeft: '向左捲動',
    scrollRight: '向右捲動',
    tabHint: '點擊切換 | 雙擊重命名 | 右鍵刪除',
  },
  sidebar: {
    label: '子分類',
    addTooltip: '新增子分類',
    emptyNoSub: '尚無子分類',
    emptyNoMain: '請先選擇主分類',
    subHint: '點擊切換 | 雙擊重命名 | 右鍵刪除',
  },
  editor: {
    placeholder: '開始輸入...',
    placeholderEmpty: '請選擇有效的主分類與子分類',
  },
  modal: {
    addMain: '新增主分類',
    renameMain: '重新命名主分類「{name}」',
    deleteMain: '確定刪除主分類「{name}」？',
    addSub: '在「{main}」下新增子分類',
    renameSub: '重新命名子分類「{name}」',
    deleteSub: '確定刪除子分類「{name}」？',
    deleteWarning: '此操作無法復原。',
    confirm: '確定',
    cancel: '取消',
    delete: '刪除',
  },
} as const;
