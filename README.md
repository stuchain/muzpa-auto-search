# Muzpa Track Runner

Turn exported playlist CSVs (Spotify and similar) into a fast manual MuzPa download flow.

The app reads each `track + artist` row, opens a direct MuzPa search link in your selected browser, and lets you move to the next song when you are done downloading.  
It is designed to speed up repetitive searching while keeping all actual downloads fully manual and under your control.

## Why This Exists

If you already have track lists in CSV format, searching every song in MuzPa manually is slow.  
This app keeps download control in your hands, but removes repetitive search steps.

## What It Does

- Load a CSV (`column 1 = track`, `column 2 = artist`)
- Choose your browser (`Chrome`, `Brave`, `Firefox`, `Edge`)
- Open direct Muzpa search links one-by-one:
  - `https://srv.muzpa.com/#/search?text=<track artist>`
- Track progress (`done`, `skipped`, `failed`, `pending`)
- Move through tracks with `Run -> Download -> Next`

No auto-click downloads. No hidden automation behavior.

## Quick Start

1. Double-click `run.bat`
2. On macOS, run `chmod +x run.sh` and then `./run.sh`
3. Select your CSV (for example one exported from Spotify)
4. Pick browser
5. Click `Run`
6. Download manually in browser
7. Click `Next (Done)` and continue

## CSV Format

```csv
Track Name,Artist Name
Another Track,Another Artist
```

## Commands

```bash
npm run dev
npm run build
npm run test
npm run secrets:scan
```

## Security

This repo is set up to avoid pushing local/private data:

- strict `.gitignore` for local artifacts and secret-like files
- pre-commit secret scan on staged files
- pre-push full secret scan

## Troubleshooting

- **Port 5173 in use:** close old app/dev terminals, then run `run.bat` again
- **Need fresh session:** use `Restart Run`
- **No auto-download:** expected behavior, downloads are manual by design

## License

MIT
