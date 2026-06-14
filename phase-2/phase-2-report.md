# SYNTHEX Holding Website - Phase 2 Report

Date: 2026-06-14  
Status: Complete, awaiting approval for Phase 3

## Foundation Built

- Next.js 16 App Router, React 19, TypeScript 6, and static export.
- English `/en/` and Arabic `/ar/` routes generated at build time.
- Route-level `lang` and `dir`, including true Arabic RTL.
- Semantic global design tokens and five company theme states.
- Typed company, content, navigation, and state models.
- Semantic static page covering:
  - Holding hero.
  - Four-company selector immediately below the hero.
  - Holding overview.
  - Timeline.
  - Vision/mission/values placeholders.
  - JOLLAQ, Al Maria, Industrial, and SHAMCO worlds.
  - Unified holding conclusion.
  - Contact dependency panel.
  - Corporate footer.
- Persistent mounted navbar with:
  - Company label and theme transformation.
  - Contextual links and CTA.
  - Holding/company-selector return route.
  - Locale switching that preserves the hash.
- Keyboard-enhanced company selector.
- Hash, browser history, passive scroll, and active-company synchronization.
- Reduced-motion-aware navigation.
- Static CSS scene foundations and WebGL-independent fallbacks.
- Provisional app icon, clearly separated from official logo assets.

Complex 3D, GSAP, final photography, final typography, and polished production motion are intentionally deferred.

## Technical Decisions

- One static page per locale.
- Stable Latin hashes across English and Arabic.
- CSS Modules for component structure and global semantic custom properties for themes.
- Structured content kept separate from presentation.
- No utility CSS framework.
- No 3D or animation dependencies in the initial payload.
- One reducer controls company/section state.
- Original supplied assets remain outside the public/exported bundle.

## Verification

Automated:

- ESLint passed.
- Strict TypeScript passed.
- Five state-model tests passed.
- Production static build passed.
- Full npm dependency audit: zero vulnerabilities.

Browser verification in Microsoft Edge:

- Direct `/en/#jollaq` restoration.
- Company/navbar/hash synchronization.
- Selector arrow-key and Enter behavior.
- Browser Back restoration.
- Escape return to company selector.
- Mobile viewport at 390 x 844.
- Tablet viewport at 820 x 1024.
- Desktop viewport at 1440 x 1000.
- Wide viewport at 1920 x 1080.
- Arabic `/ar/#industrial` with `lang="ar"` and `dir="rtl"`.
- Reduced-motion navigation.
- No horizontal overflow.
- No console errors or failed network responses.
- One `h1`, one `main`, and multiple labelled navigation landmarks.

## Build Size

The static export currently contains 54 files totaling approximately 814 KB.

No photography, texture, model, or 3D runtime payload is included yet.

## Provisional Content and Identity

- All unverified claims remain visibly qualified.
- Vision, mission, values, proof modules, contact details, and legal information remain marked as missing.
- Arabic copy is structural and requires client review.
- Company labels are text-only; disputed raster logos are not shipped.
- `app/icon.svg` is a provisional geometric favicon and is not an official replacement logo.

## Unresolved Client Dependencies

- Approved corporate profile and final English/Arabic copy.
- Official legal names and company relationships.
- Official vector logos and favicon.
- Official SYNTHEX Industrial identity.
- Verified history, contract, refinery, public-sector, paint-project, and coverage claims.
- Authentic rights-cleared photography/video.
- Contact details, registrations, privacy/legal content, and social links.
- Hosting target and enquiry-delivery requirements.

## Phase 3 Entry

Approval authorizes work on:

- SYNTHEX Holding hero.
- Lazy-loaded React Three Fiber foundation.
- Molecular holding identity scene.
- Four-company dimensional selector.
- Desktop/mobile scene quality tiers.
- WebGL error boundary and static fallback.
- Finalized selector-to-section/hash synchronization using the Phase 2 state controller.

