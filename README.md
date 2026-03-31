# Muzpa Track Runner

A desktop helper app for fast manual downloading from Muzpa.

This tool takes a CSV playlist, opens Muzpa search links one-by-one in your chosen browser, and lets you move through tracks with a clean `Run -> Download -> Next` flow.

## Why We Built This

When you need to search and download many tracks, doing everything manually becomes repetitive:
- copy track
- copy artist
- search on Muzpa
- download
- repeat

Muzpa Track Runner removes the repetitive parts while keeping you in control of the actual download action.

It is intentionally designed for **manual downloading**:
- no browser automation banners
- no hidden auto-click behavior
- your browser/session stays yours

## What It Does

- Imports CSV where:
  - column 1 = track
  - column 2 = artist
- Lets you choose browser:
  - Chrome
  - Brave
  - Firefox
  - Edge
- On `Run` / `Next`, opens direct Muzpa search URL:
  - `https://srv.muzpa.com/#/search?text=<track artist>`
- Shows queue progress and run stats
- Supports pause/resume/stop style session controls
- Exports run logs
- Saves session state locally for recovery

## UI Features

- Modern dashboard layout
- Progress bar with counters (`done`, `skipped`, `failed`, `pending`)
- Current search and ETA insights
- Recent actions panel
- Keyboard shortcuts and command palette

## Quick Start (Simplest)

### Windows one-click

1. Open project folder.
2. Double-click `run.bat`.
3. Wait for app to launch.
4. Select your CSV.
5. Pick your browser.
6. Click `Run`.
7. Download manually in browser.
8. Click `Next` to continue.

## Developer Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## CSV Format

Expected format:

```csv
Track Name,Artist Name
Another Track,Another Artist
```

Notes:
- Empty rows are skipped.
- Rows missing track or artist are flagged as warnings.

## Manual Workflow

1. Import CSV.
2. Click `Run`.
3. App opens browser to direct search link for first track.
4. You download manually.
5. Click:
   - `Next (Done)` if completed
   - `Skip` if you want to skip
   - `Fail` if track had an issue
6. Repeat until complete.

## Security and Privacy

This project is configured to reduce accidental leaks of local/private data:

- `.gitignore` excludes local/runtime/sensitive artifacts:
  - `node_modules/`, `dist/`, `dist-electron/`, `.profiles/`
  - `.env*`, key/cert patterns, editor/system files, cache dirs
- Secret scanning is enforced via git hooks:
  - pre-commit: staged files scan
  - pre-push: full repo scan
- Tooling:
  - Husky
  - Secretlint (`@secretlint/secretlint-rule-preset-recommend`)

Run scanner manually:

```bash
npm run secrets:scan
```

## Troubleshooting

### App says port 5173 is in use

Close old dev sessions, then run `run.bat` again.

### Run button does not start fresh

Use `Restart Run` (auto stops old session and creates a new one).

### Browser opens but no download happens automatically

That is expected by design. This app opens search pages; download remains manual.

## Project Stack

- Electron
- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Playwright (installed for browser integration foundation)
- Vitest

## License

ISC
