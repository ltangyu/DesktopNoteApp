# Changelog

All notable changes to DesktopNoteApp are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com).

## [0.4.0] — 2026-05-17

### Added
- **Frosted-glass shell**: window body is `rgba(255, 255, 255, 0.4)` translucent white over the desktop — the title bar, tabbar, and sidebar all share this unified glass surface
- 4-layer deep `box-shadow` (max opacity 0.40) softly fades into the fully-transparent 32 px padding ring → "card floating on desktop" depth

### Changed
- `--bg-shell`: solid `#fafafa` → `rgba(255, 255, 255, 0.4)`
- `--bg-titlebar`, `--bg-sidebar`: solid → `transparent` (children inherit shell glass)
- Content area / active tab / active sub remain solid `#ffffff` for legibility

### Why no OS Aero / Mica / Acrylic
- On Windows 10 1903+, `apply_acrylic` triggers a DWM bug that makes window drag stutter — confirmed unacceptable
- `apply_blur` (Aero `BLURBEHIND`) did blur the real desktop but the user found it visually equivalent to pure CSS once a white tint was applied
- Pure CSS layers give a uniform glass look, zero drag overhead, and identical behavior across Win 10 and Win 11

### Bumped
- `0.3.0` → `0.4.0` in `package.json`, `Cargo.toml`, `tauri.conf.json`

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
