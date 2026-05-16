const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, 'icon.ico'),
    frame: false,
    transparent: true,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('window-control', (event, command) => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return;
  if (command === 'minimize') win.minimize();
  else if (command === 'maximize') win.isMaximized() ? win.unmaximize() : win.maximize();
  else if (command === 'close') win.close();
});

// 新增：提供 userData 路徑給 preload
ipcMain.handle('get-user-data-path', () => {
  return app.getPath('userData');
});
