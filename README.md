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

## Direct downloads (per platform)

Once you publish a release, point users to the relevant asset so they can click a link instead of cloning. Replace the placeholder URLs below with your actual release asset links:

| Platform | Download |
| --- | --- |
| macOS | [File Meteor macOS](https://github.com/<your-username>/<repo>/releases/download/v1.0.0/File%20Meteor-1.0.0-arm64-mac.zip) |
| Windows | [File Meteor Windows](https://github.com/<your-username>/<repo>/releases/download/v1.0.0/File%20Meteor%20Installer.exe) |
| Linux | [File Meteor Linux](https://github.com/<your-username>/<repo>/releases/download/v1.0.0/File%20Meteor-linux.zip) |

Update the filenames and version numbers when you publish new builds so the links stay current.

## Tips
- If search results feel stale, ensure the app has filesystem permissions (especially on macOS) and leave the window open; every 5s refresh will rerun the query.
- The recent list is stored in `localStorage` per user, so deleting the app data will clear it.

## License

This project is available under the terms described in `LICENSE`.
