const { app, BrowserWindow, ipcMain, Menu, shell, clipboard, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs/promises');

const SEARCH_ROOT = path.parse(process.cwd()).root;
const MAX_RESULTS = 60;
const MAX_DEPTH = 10;
const MAX_DIR_READS = 2000;

let dragIcon;

function getDragIcon() {
  if (!dragIcon) {
    dragIcon = nativeImage.createFromDataURL(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8AABwAD/1cH+QAAAABJRU5ErkJggg==',
    );
  }
  return dragIcon;
}

async function searchFiles(query) {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    return [];
  }

  const normalized = trimmed.toLowerCase();
  const results = [];
  const queue = [{ dir: SEARCH_ROOT, depth: 0 }];
  let dirReads = 0;

  while (queue.length && results.length < MAX_RESULTS && dirReads < MAX_DIR_READS) {
    const { dir, depth } = queue.shift();
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (error) {
      continue;
    }
    dirReads += 1;

    for (const entry of entries) {
      if (results.length >= MAX_RESULTS) {
        break;
      }

      const entryPath = path.join(dir, entry.name);
      const lowerName = entry.name.toLowerCase();

      if (lowerName.includes(normalized)) {
        results.push({
          name: entry.name,
          path: entryPath,
          isDirectory: entry.isDirectory(),
        });
      }

      if (entry.isDirectory() && depth < MAX_DEPTH && !['node_modules', '.git'].includes(entry.name)) {
        queue.push({ dir: entryPath, depth: depth + 1 });
      }
    }
  }

  return results;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 540,
    height: 580,
    minWidth: 420,
    minHeight: 420,
    title: 'File Finder',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  win.loadFile('index.html');

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('search-files', (event, query) => searchFiles(query));
ipcMain.handle('open-file', (event, filePath) => shell.openPath(filePath ?? ''));
ipcMain.handle('reveal-file', (event, filePath) => shell.showItemInFolder(filePath ?? ''));
ipcMain.on('start-drag', (event, filePath) => {
  if (!filePath) {
    event.returnValue = null;
    return;
  }

  console.debug('startDrag requested for', filePath);
  event.sender.startDrag({
    file: filePath,
    icon: getDragIcon(),
  });

  event.returnValue = true;
});

ipcMain.on('show-context-menu', (event, filePath) => {
  if (!filePath) {
    return;
  }

  const template = [
    {
      label: 'Copy file path',
      click: () => clipboard.writeText(filePath),
    },
    {
      label: 'Open',
      click: () => shell.openPath(filePath),
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  menu.popup({
    window: BrowserWindow.fromWebContents(event.sender),
  });
});
