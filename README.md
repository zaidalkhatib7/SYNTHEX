# SYNTHEX Holding Website

Greenfield bilingual corporate website for SYNTHEX Holding and its four operating companies.

Current status: Phase 2 static foundation. Complex 3D and production motion have not been added.

## Requirements

- Node.js 22 or newer
- npm 10 or newer
- Microsoft Edge for the current browser-verification script, or set `EDGE_PATH`

## Setup

```powershell
npm install
npm run dev
```

Development URLs:

- `http://localhost:3000/en/`
- `http://localhost:3000/ar/`

## Commands

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run browser:verify
npm run check
```

The production export is written to `out/`.

Preview the export:

```powershell
npm run build
npm start
```

## Architecture

- `app/(localized)/[locale]/`: statically generated English and Arabic routes.
- `components/experience/`: semantic page, navbar, selector, and static scene foundations.
- `lib/content.ts`: provisional structured bilingual content.
- `lib/experience-state.ts`: hash/company/navigation state reducer.
- `app/globals.css`: semantic design tokens and global direction-aware styles.
- `tests/`: focused reducer and state tests.
- `scripts/verify-browser.mjs`: exported-site verification in Edge.
- `source-assets/`: preserved original supplied assets; not shipped publicly.
- `audit/`, `phase-1/`, `phase-2/`: project discovery and approval artifacts.

## Content Editing

Edit company copy and navigation in `lib/content.ts`.

Do not remove verification language until the corresponding claim is approved. The current Arabic copy is structural and requires client review.

Official logos, contact details, legal names, registrations, policies, and authentic photography are still missing.

## Static Hosting

The site uses `output: "export"` and can be deployed to a static host.

Hosts must:

- Serve directory routes through `index.html`.
- Preserve `/en/` and `/ar/` paths.
- Serve Next-generated `.txt` React Server Component payloads. The included preview server demonstrates the dotted-path mapping needed by generated locale-prefetch requests.

## Assets

Original supplied files remain unchanged in `source-assets/`.

The favicon in `app/icon.svg` is a provisional geometric holding-system icon. Replace it with the approved official vector favicon when supplied.
