const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
const statusMessage = document.getElementById('status');

const RECENT_STORAGE_KEY = 'file-meteor-recent-files';
const MAX_RECENT_FILES = 8;
const AUTO_REFRESH_INTERVAL_MS = 5000;

let pendingTimeout;
let autoRefreshHandle;

function setStatus(text) {
  statusMessage.textContent = text;
}

function loadRecentFiles() {
  const stored = localStorage.getItem(RECENT_STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistRecentFiles(files) {
  localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(files));
}

function getRecentStatus(count) {
  return count
    ? `Showing ${count} recent file${count > 1 ? 's' : ''}.`
    : 'No recent files yet; open one to build history.';
}

function addRecentFile(file) {
  if (!file?.path) {
    return [];
  }

  const recents = loadRecentFiles().filter((entry) => entry.path !== file.path);
  const entry = {
    path: file.path,
    name: file.name || file.path.split(/[\\/]/).pop(),
  };
  recents.unshift(entry);

  const trimmed = recents.slice(0, MAX_RECENT_FILES);
  persistRecentFiles(trimmed);
  return trimmed;
}

function refreshRecentView() {
  if (searchInput.value.trim()) {
    return;
  }

  const recents = loadRecentFiles();
  renderResults(recents, getRecentStatus(recents.length));
}

async function openAndTrack(file) {
  try {
    await window.electronAPI.openFile(file.path);
  } catch (error) {
    console.error('Open file failed', error);
  } finally {
    addRecentFile(file);
    refreshRecentView();
  }
}

async function performSearch(query) {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    refreshRecentView();
    return;
  }

  setStatus('Searching…');
  try {
    const matches = await window.electronAPI.searchFiles(trimmed);
    renderResults(matches);
  } catch (error) {
    console.error('Search error', error);
    setStatus('Search failed, try again.');
  }
}

function renderResults(results, statusText) {
  resultsContainer.innerHTML = '';

  if (!results.length) {
    setStatus(statusText ?? (searchInput.value.trim() ? 'No matches found.' : 'Type to discover files.'));
    return;
  }

  setStatus(statusText ?? `${results.length} file${results.length > 1 ? 's' : ''} found.`);

  results.forEach((file) => {
    const item = document.createElement('div');
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.className = 'result-item';
    item.dataset.path = file.path;
    item.draggable = false;

    const name = document.createElement('strong');
    name.textContent = file.name;

    const pathLine = document.createElement('span');
    pathLine.className = 'file-path';
    pathLine.textContent = file.path;

    item.append(name, pathLine);

    item.addEventListener('click', () => {
      openAndTrack(file);
    });

    item.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      window.electronAPI.showContextMenu(file.path);
    });

    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        openAndTrack(file);
      }
    });

    resultsContainer.appendChild(item);
  });
}

searchInput.addEventListener('input', () => {
  if (pendingTimeout) {
    clearTimeout(pendingTimeout);
  }

  pendingTimeout = setTimeout(() => {
    performSearch(searchInput.value);
  }, 250);
});

searchInput.focus();
performSearch(searchInput.value);

autoRefreshHandle = setInterval(() => {
  performSearch(searchInput.value);
}, AUTO_REFRESH_INTERVAL_MS);

window.addEventListener('beforeunload', () => {
  if (autoRefreshHandle) {
    clearInterval(autoRefreshHandle);
  }
});
