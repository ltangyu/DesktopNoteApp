const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

let dataPath;

// 初始化時非同步取得 userData 路徑
ipcRenderer.invoke('get-user-data-path').then(userDataPath => {
  dataPath = path.join(userDataPath, 'data.json');
});

contextBridge.exposeInMainWorld('api', {
  loadData: () => {
    try {
      if (!dataPath || !fs.existsSync(dataPath)) return {};
      const raw = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Failed to load data:', err);
      return {};
    }
  },
  saveData: (data) => {
    try {
      if (!dataPath) return;
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to save data:', err);
    }
  },
  minimize: () => ipcRenderer.send('window-control', 'minimize'),
  maximize: () => ipcRenderer.send('window-control', 'maximize'),
  close: () => ipcRenderer.send('window-control', 'close'),
});
