# Changelog

All notable changes to DesktopNoteApp are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com).

## [0.3.1] — 2026-05-20

### Added
- **Portable mode**: if a `portable.txt` flag file sits next to the EXE, `data.json` is written to that same folder (true green / no-install). Without the flag, behavior is unchanged (`%APPDATA%\desktop-note-app\data.json`)
- GitHub Release now ships **two artifacts**:
  - `DesktopNoteApp_0.3.1_x64-setup.exe` — traditional NSIS installer (`%LOCALAPPDATA%\DesktopNoteApp\`)
  - `DesktopNoteApp-0.3.1-portable.zip` — green / portable bundle (just unzip + run)

### Changed
- `tokens.css` 補齊 SSOT (`ii Design Language v1.0`) 完整 token 體系：
  - 補齊 4 階圓角 (`--radius-pill`)、4 階文字 (`+--text-dim/--text-on-dark`)、3 階表面、3 階邊框 (`+--border-strong`)
  - 7 階字級 (`--text-micro` ~ `--text-xl`) + `--letter-uppercase`
  - 8 階間距 (`--gap-1` ~ `--gap-7`)
  - 4 色 status dot tokens + glow
  - Mono 字型 (`--font-mono: Space Grotesk + JetBrains Mono`)
  - `--shadow-soft` / `--shadow-card`、`--glass-bg` / `--glass-blur`
  - `--t-base: 0.15s → 0.20s`（SSOT 標準）
- `global.css`: `font-size` 改用 `var(--text-base)`、加 macOS `-moz-osx-font-smoothing: grayscale`
- 視覺輸出與 v0.3.0 完全一致，純粹補完 token 體系與 ii / image-downloader-app 對齊

## [0.3.0] — 2026-05-16

### Added
- **Bilingual UI** (English / Traditional Chinese) powered by `vue-i18n@11`
- **Locale toggle** in the title bar (中 / EN button); choice persisted to `localStorage`
- English is the default; users on Chinese systems can switch with one click and the preference sticks
- Window title and bundle metadata switched to English ("DesktopNoteApp")

### Changed
- Migrated `vue-i18n` from v9 (deprecated) to v11
- `main.ts` rewritten as an async IIFE with dynamic imports and a `window.onerror` handler — runtime errors now surface in the webview instead of producing a silent white screen
- Bumped version to `0.3.0` in `package.json`, `Cargo.toml`, `tauri.conf.json`

### Fixed
- White-screen issue caused by `vue-i18n@9` + Vue 3.5 production build incompatibility (Vue mount failed silently with no console output)

### Notes
- Installer: ~1.08 MB
- Runtime RAM: ~30 MB
- Data location unchanged: `%APPDATA%\desktop-note-app\data.json`

## [0.2.0] — 2026-05-11 (internal)

Initial Tauri v2 + Vue 3 + TypeScript strict implementation. Not released as a GitHub artifact.

### Features
- Two-level hierarchy: main categories → subcategories → content
- Live auto-save with 300 ms debounce and atomic rename
- CSS floating-card visual: 10 px radius, 4-layer soft shadow within 32 px shell padding
- Tabs with rounded top corners; subcategories with rounded left corners; active item seamlessly connects to the content area
- Custom title bar (frameless transparent window) with min / max / close
- TypeScript strict mode (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Rust backend exposing only `load_notes` / `save_notes` IPC commands (no generic fs/shell/http plugins)
