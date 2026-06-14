# SYNTHEX Holding Website - Phase 1 Report

Date: 2026-06-14  
Status: Complete, awaiting approval for Phase 2

## Built

- Experience blueprint with sitemap, narrative order, company section pattern, responsive rules, bilingual model, and Phase 2 entry criteria.
- Five-state navbar and company-state architecture.
- Typed theme/content/scene schema draft.
- Low-fidelity browser prototype with:
  - Holding hero and immediate four-company selector.
  - Holding overview, timeline, principles, four company worlds, unified conclusion, contact, and footer.
  - Contextual navbar transformation.
  - Company selector keyboard navigation.
  - Hash/deep-link restoration.
  - Browser history synchronization.
  - Passive scroll synchronization.
  - English/Arabic modes and document-level RTL.
  - Reduced-motion-aware explicit navigation.
- 3D storyboard and three performance tiers.
- Content dependency matrix with 40 tracked fields.
- Asset approval matrix with 12 grouped decisions.

No production framework, dependency manifest, final UI, or WebGL scene was created.

## Decisions

- One long-form page per locale: `/en/` and `/ar/`.
- Stable company hashes shared across locales.
- One persistent WebGL canvas.
- One mounted navbar transformed through state and semantic tokens.
- Native document scrolling remains primary.
- Explicit navigation pushes history; passive scroll replaces the current hash.
- Holding-owned sections always restore the holding theme.
- Text-only company labels remain the safe default until official vector logos are supplied.
- Generated imagery remains reference-only.

## Browser Verification

Controlled Microsoft Edge checks:

| Check | Result |
| --- | --- |
| Direct `#jollaq` refresh | Landed at JOLLAQ section; JOLLAQ theme/navbar restored |
| Mobile `#companies` refresh | Landed at selector; viewport/document width both 390 px |
| Selector ArrowRight | Focus moved from JOLLAQ to Al Maria |
| Selector Enter | Pushed `#al-maria`; section and navbar synchronized |
| Browser Back | Restored `#companies`, holding theme, and prior scroll position |
| Arabic `?lang=ar#industrial` | Restored `lang="ar"`, `dir="rtl"`, Industrial theme and section |
| Locale switch | Preserved `#industrial` while changing query, language, direction, and visible copy |
| Nested `#industrial-capabilities` | Restored Industrial theme and positioned target at 80 px from viewport top |
| Passive scroll to SHAMCO | Replaced hash with `#shamco`; source recorded as `scroll` |
| Horizontal overflow | None at 390 px viewport |

Review captures:

- `review/jollaq-playwright.png`
- `review/companies-mobile-playwright.png`
- `review/industrial-ar-mobile-playwright.png`
- `review/holding-check.png`

## Automated Checks

- JavaScript syntax checks passed.
- State-model tests passed.
- 20 HTML IDs and 10 static hash links checked; no missing targets.
- All local CSS/JS/document references resolve.
- Content matrix parsed: 40 fields across 7 areas.
- Asset approval matrix parsed: 12 grouped decisions.

## Content Status

- 14 English fields are completely missing.
- 29 Arabic fields are completely missing.
- Additional factual claims are present but marked `verification-required`.
- Arabic text in the prototype is provisional structural copy, not approved corporate copy.

## Open Client Dependencies

- Corporate profile and approved English/Arabic content.
- Official legal/display names and entity relationships.
- Official vector logo masters and approved variants.
- Official SYNTHEX Industrial identity.
- Verified timeline, contract, public-sector, refinery, paint-project, and coverage claims.
- Authentic rights-cleared photography/video.
- Contact, registration, privacy, and social details.
- Hosting target and contact-form delivery requirements.

## Phase 2 Approval Scope

Approval authorizes:

- Greenfield Next.js App Router and TypeScript scaffold.
- CSS token and typography foundation.
- Typed company/content configuration.
- `/en/` and `/ar/` route shells.
- Accessible static page structure.
- Persistent navbar shell and tested state controller.
- Static scene/fallback placeholders before complex 3D work.

It does not authorize:

- Treating provisional copy as final.
- Publishing unverified claims.
- Selecting or modifying disputed logo variants.
- Using generated pseudo-photography as documentary evidence.

