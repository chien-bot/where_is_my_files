const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  searchFiles: (query) => ipcRenderer.invoke('search-files', query),
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
  revealFile: (filePath) => ipcRenderer.invoke('reveal-file', filePath),
  startDrag: (filePath) => ipcRenderer.sendSync('start-drag', filePath),
  showContextMenu: (filePath) => ipcRenderer.send('show-context-menu', filePath),
});
