# SYNTHEX Holding Website - Phase 3 Report

Date: 2026-06-14  
Status: Complete, awaiting approval for Phase 4

## Built

- Lazy-loaded React Three Fiber hero scene with an abstract molecular SYNTHEX
  holding structure.
- Metallic bonds, cyan and orange nodes, orbit systems, deterministic particles,
  pointer response, and restrained scroll response.
- Static HTML/CSS molecular fallback kept beneath the canvas.
- Three rendering tiers:
  - Tier 2: capable desktop, increased geometry and particle density.
  - Tier 1: mobile or constrained hardware, reduced DPR and complexity.
  - Tier 0: reduced motion or unavailable WebGL, no canvas.
- Viewport lifecycle control that removes the WebGL canvas when the hero is not
  visible.
- Scene error boundary that restores the static fallback on rendering failure.
- Four dimensional company portals built with semantic links and CSS 3D.
- Company-specific portal colors for JOLLAQ, Al Maria, SYNTHEX Industrial, and
  SHAMCO.
- Hover, focus, current-company, touch, and keyboard states without moving text
  or controls into WebGL.
- Existing URL hash, history, observer, navbar theme, locale, and keyboard state
  synchronization preserved.

## Decisions

- Use one WebGL canvas in Phase 3. Company selector portals remain semantic
  HTML/CSS to avoid a second renderer and preserve direct interaction.
- Use only `three` and `@react-three/fiber`; no GSAP, Drei, or postprocessing
  dependency was added.
- Treat the scene as an interpretation of molecular/network language, not a
  trace or replacement of the supplied logo.
- Keep the hero useful before the 3D chunk loads and complete when WebGL is
  disabled.
- Unmount the canvas outside the hero rather than running an offscreen animation.
- Keep supplied photography out of this phase; approved asset integration remains
  scheduled for the holding-content and company-world phases.

## Verification

- ESLint passed.
- Strict TypeScript passed.
- Eight unit tests passed, including graphics-tier selection.
- Static production build passed.
- Desktop WebGL tier 2 rendered and reported ready.
- Mobile WebGL tier 1 rendered at 390 x 844 with no horizontal overflow.
- Reduced-motion mode selected tier 0 and created no canvas.
- Forced WebGL-unavailable mode selected tier 0 and retained the fallback.
- Direct `/en/#jollaq` navigation restored company state and did not retain an
  offscreen hero canvas.
- Selector arrow keys, Enter, Escape, browser Back, and hash restoration passed.
- Arabic RTL, tablet, desktop, and wide layouts passed.
- Browser console and failed-response checks passed.
- Hydration regression verification remains part of the complete project check.

## Payload

- Static export: 55 files, approximately 1.66 MB uncompressed.
- Largest Three/R3F dynamic chunk: approximately 864 KB raw / 228 KB gzip.
- The 3D chunk is not referenced as an initial script by the static English HTML;
  it is requested by the lazy hero component when the scene is eligible to run.
- No model, texture, video, postprocessing, or external font payload is included.

## Assumptions

- The current abstract molecular structure is approved as visual language only;
  it is not an official logo construction.
- Mobile devices below 768 px, coarse-pointer devices, and devices reporting four
  or fewer logical cores or 4 GB or less memory should use the lightweight tier.
- `prefers-reduced-motion` means a fully static hero rather than a slower 3D scene.

## Unresolved Content and Brand Issues

- Official vector logo and confirmed logo construction remain required.
- Final English and Arabic executive copy remains subject to client approval.
- Company-specific official identity assets are still unverified.
- Authentic photography, video, and rights confirmation remain required.
- Verified contract, refinery, public-sector, paint-project, distribution, legal,
  and contact claims remain unresolved.
- The abstract scene may require art-direction revision after official vector
  identity assets are supplied.

## Phase 4 Entry

Approval authorizes implementation of JOLLAQ only as the first company-world
pattern. Al Maria, SYNTHEX Industrial, and SHAMCO should remain unbuilt until the
JOLLAQ section has been reviewed.
