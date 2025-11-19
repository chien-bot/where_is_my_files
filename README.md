<<<<<<< HEAD
# Where_is_my_file
where_is_my_file is a lightweight tool for quickly locating files on your local machine. It allows users to search by keywords and open the target file or folder directly from the search results, improving workflow efficiency.
=======
# File Meteor

File Meteor is an Electron-powered desktop helper that lets you search for any file on your machine, open it, copy the path, and keep a recent history at hand—even before you start typing.

## Key features
- **Global search**: walks from the filesystem root with configurable depth/dir limits so you can surface files anywhere (e.g., `习题1.docx`), while keeping the UI responsive.
- **Recent files fallback**: when the search box is empty the app shows the most recently opened files (persisted in `localStorage`) and updates the list when you open a file, including via Enter.
- **Simple context menu**: right-click a result to copy the file path or open the file directly.
- **Auto-refresh**: when the window is open the current query re-runs every five seconds so new files appear without retyping.
- **Compact window**: the default window is sized to 540×580 with sensible minimums so it stays in the way just enough.

## Getting started

You need Node.js installed (v16+ is recommended since Electron 39 targets that runtime). Then:

```bash
npm install
npm start
```

Use the input field to search for files or leave it empty to browse recent entries. Clicking or pressing Enter opens a file and records it in the recent list.

## Packaging & distribution

To let other people download an installable app instead of cloning the repo, use a bundler such as [`electron-builder`](https://www.electron.build/):

1. Install the builder as a dev dependency and add a build script:
   ```bash
   npm install --save-dev electron-builder
   ```

   Update `package.json`:
   ```json
   {
     "scripts": {
       "start": "electron .",
       "build": "electron-builder"
     },
     "build": {
       "appId": "com.yourname.filemeteor",
       "productName": "File Meteor",
       "files": [
         "**/*"
       ]
     }
   }
   ```

2. Run `npx electron-builder --mac` (or `--win`, `--linux`, etc.) to generate platform-specific installers or zip archives.
3. Upload the generated installer/zip from `dist/` to GitHub Releases, your website, or any distribution channel. Share the download link so people can install File Meteor without cloning.

## Tips
- If search results feel stale, ensure the app has filesystem permissions (especially on macOS) and leave the window open; every 5s refresh will rerun the query
- The recent list is stored in `localStorage` per user, so deleting the app data will clear it.

## License

This project is available under the terms described in `LICENSE`.
>>>>>>> 4e1afc9 (Initial commit)
