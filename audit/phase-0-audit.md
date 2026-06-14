# SYNTHEX Holding Website - Phase 0 Discovery and Audit

Date: 2026-06-14

## 1. Executive Summary

- The workspace was empty at discovery time. It contained no Git repository, application code, package manifest, framework, tests, fonts, documents, or existing build configuration.
- The supplied ZIP contained 37 images totaling 53,631,126 bytes: 24 PNG files and 13 JPEG files.
- Images 1-24 are AI-generated concept art or pseudo-photography. They are useful as art-direction references but are not documentary evidence and should not be presented as real facilities, contracts, assets, routes, or field operations.
- Images 25-37 are compressed raster logo references. They contain inconsistent variants, low-resolution files, embedded backgrounds, and at least one visible text error. No vector logo, transparent master, brand guide, or font specification was supplied.
- No corporate profile document or bilingual content file was found. The user's build prompt is currently the only business-content source.
- Production UI should not begin until Phase 1 confirms the narrative/state model and the client identifies official logo variants and supplies the corporate profile.

## 2. Repository and Project Health

| Check | Result |
| --- | --- |
| Existing framework | None |
| Git repository | None |
| Package manager configuration | None |
| Source code | None |
| Lint/type/test/build scripts | None |
| Existing UI conventions | None |
| Existing animation/3D stack | None |
| Existing fonts | None |
| Existing content model | None |

This is a greenfield project. Phase 2 should initialize Git and scaffold only after the Phase 1 blueprint is approved.

## 3. Asset Inventory

Technical inventory:

- `asset-inventory.csv`: filename, relative path, dimensions, format, bytes, megapixels, orientation, DPI, pixel format, sampled average color, SHA-256, and exact-duplicate status.
- `asset-inventory.json`: machine-readable equivalent.
- `asset-review.csv`: per-file subject, classification, intended role, ship status, and concerns.
- `logo-palettes.csv`: quantized color samples from logo-reference images.
- `contact-sheet-01.jpg` through `contact-sheet-04.jpg`: visual review sheets.

### Counts

| Category | Count |
| --- | ---: |
| Total images | 37 |
| PNG | 24 |
| JPEG | 13 |
| Portrait | 20 |
| Landscape | 13 |
| Square | 4 |
| Exact duplicate groups | 0 |
| AI-generated concept/pseudo-photo files | 24 |
| Compressed logo references | 13 |
| Files below 300 px on one dimension | 3 |

### Editorial Groups

| IDs | Group | Assessment |
| --- | --- | --- |
| 1-5 | SYNTHEX holding concepts | Strong mood/lighting references; invented identity treatments |
| 6-9 | Four-company selector concepts | Useful world differentiation; invented subsidiary badges |
| 10-19 | Sector/world concepts | Useful 3D storyboard references; must not imply factual proof |
| 20-24 | Agricultural pseudo-photography | Synthetic; JOLLAQ branding is invented; do not use as documentary photography |
| 25-27 | SYNTHEX logo references | Best available identity source, but inconsistent compressed rasters |
| 28, 30, 36 | JOLLAQ logo references | File 28 is strongest; English/Arabic masters and vector source still needed |
| 32-35 | Al Maria logo references | Conflicting designs; file 32 contains visible "EKPORT" text error |
| 29, 31, 37 | SHAMCO logo references | Three materially different marks; official variant must be selected |
| None | SYNTHEX Industrial official logo | Missing |

## 4. Brand and Color Findings

The supplied SYNTHEX references support the requested navy/blue/cyan/orange/chrome direction. The provisional palette should be refined to:

```css
--synthex-navy: #062e52;
--synthex-blue: #075c91;
--synthex-cyan: #16a8b8;
--synthex-orange: #f7941d;
--synthex-silver: #b7c4cc;
--synthex-graphite: #090c10;
--synthex-white: #f4f7f8;
```

These values are provisional because JPEG gradients, compression, lighting effects, and white-balance differences prevent exact brand-color recovery.

Subsidiary evidence:

- JOLLAQ references support black, dark cargo brown, and warm gold. Deep commodity green can remain a website-world accent, but it is not established by the supplied logo.
- Al Maria references support midnight/royal blue, gold, white, and restrained ivory. The logo wording and registration claim must be verified before use.
- SYNTHEX Industrial has no official identity asset. Use a theme derived from the holding palette without inventing a replacement logo.
- SHAMCO variants disagree. Blue, green, and gold appear in one candidate; another uses metallic blue/gold; another uses silver/gold. Theme tokens must remain provisional until the official mark is chosen.

## 5. Content Audit and Map

The prompt supplies enough material for structural planning, but not final publishable copy.

| Section | Available content | Status |
| --- | --- | --- |
| Holding hero | Parent brand, 35+ years, diversified trade/supply/industry/distribution | Draftable; exact legal wording pending |
| Company selector | Four operating arms and names | Draftable; official naming/casing pending |
| Holding overview | International trade, institutional supply, contracts, materials, commodities, manufacturing, distribution | Draftable |
| Timeline | 35+ years, 2012 phosphate milestone, current paint expansion | Claims require source confirmation and exact dates |
| Vision/mission/values | Direction is implied but no approved text supplied | Missing |
| JOLLAQ | Commodities, petroleum derivatives/Homs Refinery contracts, aluminum profiles | Draftable; claims and legal entity details pending |
| Al Maria | Government/institutional supply, oils, phosphate exports, public-sector relationships | Draftable; claims and legal entity details pending |
| Industrial | Chemicals, paint raw materials, aluminum, cement, steel, new paint manufacturing | Draftable; project stage and factual details pending |
| SHAMCO | Logistics, agents/distributors, nationwide market coverage | Draftable; coverage proof and legal details pending |
| Unified network | Relationship of four arms under holding | Draftable |
| Contact/footer | No approved email, phone, address, registration details, privacy/legal text, or social links | Missing |
| Arabic | Logo snippets only; no approved Arabic corporate copy | Missing |

### Claims Requiring Client Verification

- Exact legal names and entity relationships for the holding and all four companies.
- Mr. Hisham Abdeen's preferred English and Arabic spelling, formal title, and permission to feature him.
- Founding year and whether "35+ years" applies to the holding, predecessor business, or a specific company.
- "Since 1990" and "Rural Damascus - Syria" wording embedded in the SYNTHEX raster.
- The 2012 phosphate milestone and any associated contract/public-sector names.
- Homs Refinery contract wording and permission to identify the organization.
- Government-contract, public-sector, edible-oil, phosphate-export, and nationwide-coverage claims.
- Paint manufacturing project's current stage, location, launch timing, and approved description.
- Al Maria registration number shown in logo variants.
- Official Arabic legal names, product terminology, and transliterations.

## 6. Asset-to-Section Mapping

| Experience area | Strongest references | Use decision |
| --- | --- | --- |
| Holding hero | 1, 4, 5, 10 | Rebuild as original real-time 3D; do not use raster logos as geometry |
| Company selector | 6, 7, 8, 9 | Use only to guide materials, silhouettes, and world differentiation |
| Holding/global network | 2, 10, 11 | Rebuild as abstract network/architecture |
| JOLLAQ world | 12, 13 | Rebuild as commodity particles/cargo geometry |
| Al Maria world | 14, 15 | Rebuild as abstract planes/routes; no fake documents |
| Industrial world | 16, 17 | Strongest 3D-material references in the set |
| SHAMCO world | 18, 19 | Rebuild abstractly; do not claim unverified map coverage |
| Real-world photography | 20-24 | Reject as factual proof; request authentic operations/facilities/team photography |
| Header/footer brand marks | 25-37 | Hold until official master variants are confirmed |

## 7. Recommended Technical Approach

Recommended greenfield stack for Phase 2:

- Next.js App Router with TypeScript and static generation for crawlable bilingual HTML, metadata, images, and deployment flexibility.
- React Three Fiber, Three.js, and Drei for the WebGL layer.
- GSAP with ScrollTrigger as the single timeline/scroll animation system.
- CSS Modules plus global semantic CSS custom properties for themes. Avoid a utility framework unless Phase 1 demonstrates a clear need.
- Structured locale content in typed TypeScript data, with `/en/` and `/ar/` entry routes and company hashes such as `/en/#jollaq`.
- A small reducer/state-controller for company state. Do not add XState unless the Phase 1 prototype proves the state transitions are more complex than expected.
- Playwright for browser flows and viewport/RTL checks; unit tests for navigation reducer, hash restoration, locale content, and fallback decisions.
- Originals remain outside the public bundle. Approved derivatives are generated as AVIF/WebP/JPEG with responsive dimensions.

Official documentation supports static App Router output, lazy-loading client libraries, React Three Fiber performance scaling, and GSAP media-query/reduced-motion handling.

## 8. Proposed Phase 1 Blueprint

### Narrative Order

1. Short, skippable holding intro.
2. SYNTHEX Holding hero and primary proposition.
3. Four-company selector immediately below the hero.
4. Holding overview and strategic sectors.
5. 35+ year story/timeline.
6. Vision, mission, and values.
7. JOLLAQ world.
8. Al Maria world.
9. SYNTHEX Industrial world.
10. SHAMCO world.
11. Unified holding/network conclusion.
12. Partnership/contact call to action.
13. Corporate footer.

### Navbar State Model

States: `holding`, `jollaq`, `al-maria`, `industrial`, `shamco`.

Inputs:

- Selector click/tap.
- Keyboard selection.
- Intersection observer section activation.
- Initial hash restoration.
- `hashchange`, `popstate`, and browser back/forward.
- Locale route switch.

Rules:

- Explicit user navigation pushes history.
- Passive scroll activation replaces the current hash to avoid filling history.
- Back/forward restores section, theme, focus context, and navbar model.
- The navbar remains mounted and morphs through semantic CSS variables and layout states.
- Keyboard navigation uses a roving tab stop in the company selector plus normal landmark/link navigation.

### Theme Architecture

Each company config owns:

- Stable ID and localized legal/display names.
- Semantic color tokens and surface materials.
- Navigation labels and contextual CTA.
- Section IDs and localized content blocks.
- Icon family.
- 3D scene key, quality settings, and transition parameters.
- Static fallback image/illustration.

The holding remains the parent frame: shared grid, type scale, chrome/geometry language, and persistent return/switch control.

### Responsive Strategy

- Large desktop: full hero scene, controlled postprocessing, four spatial selector objects.
- Laptop/tablet: reduced particles, shadows, DPR, and camera travel.
- Mobile: simplified geometry or pre-rendered fallback, two-column/stacked selector, no pinned scroll traps.
- Reduced motion: no continuous camera drift, no parallax dependency, direct opacity/material transitions.
- No WebGL: complete semantic page plus approved static art.

### 3D Storyboard and Performance Tiers

| Scene | Narrative action |
| --- | --- |
| Holding hero | Molecular S assembles from engineered bonds and chrome/glass nodes |
| Selector | Four material systems branch from a shared holding core |
| JOLLAQ | Grain/commodity particles move through cargo and supply paths |
| Al Maria | Formal planes, route lines, and contract-like layers establish institutional scale |
| Industrial | Metal extrusions and chemical structures transition into controlled paint fluid |
| SHAMCO | Nodes and route pulses connect warehouse, agents, and market endpoints |
| Conclusion | Four systems reconnect into one precise holding structure |

Performance tiers:

- Tier 0: semantic HTML and static approved images.
- Tier 1: low-complexity WebGL, no postprocessing, low DPR, sparse particles.
- Tier 2: full desktop geometry, restrained reflections, selective postprocessing.

### Phase 1 Deliverables

- Approved sitemap and section order.
- Desktop/mobile low-fidelity wireframes.
- Browser-based structural prototype with working hashes and navbar state transitions.
- Typed company/theme/content schema draft.
- English/Arabic content matrix with missing-field markers.
- 3D storyboard frames and quality-tier budget.
- Asset approval matrix naming the exact logo variant allowed for each company.

## 9. Decisions, Assumptions, and Unresolved Issues

Decisions:

- Preserve every supplied file unchanged under `source-assets/`.
- Treat generated images as references, not corporate evidence.
- Treat all supplied logos as provisional raster references.
- Do not invent an Industrial logo.
- Do not scaffold production code in Phase 0.

Assumptions:

- The final experience is one long-form bilingual page with locale routes and company hashes.
- Contact submission behavior is undefined; Phase 1 should design the CTA without implementing an unapproved data endpoint.
- The holding logo's molecular S is the correct parent visual language, pending official master artwork.

Unresolved:

- Official corporate profile and approved Arabic/English copy.
- Official vector logos and selected variants.
- Legal entity names, contact details, policies, registrations, and social links.
- Authentic photography/video and rights/provenance.
- Approved hosting/deployment target and form-delivery requirements.

## 10. Phase 0 Checks

- ZIP extracted successfully without modifying originals.
- 37/37 images opened successfully through the audit script.
- Dimensions, formats, file sizes, orientation, hashes, and sampled colors recorded.
- Exact duplicate scan completed: none found.
- Four contact sheets generated and visually reviewed.
- Logo candidates reviewed at original resolution.
- No production framework or UI was created.

## 11. Reference Documentation

- Next.js static exports: https://nextjs.org/docs/app/guides/static-exports
- Next.js lazy loading: https://nextjs.org/docs/app/guides/lazy-loading
- React Three Fiber performance scaling: https://r3f.docs.pmnd.rs/advanced/scaling-performance
- GSAP matchMedia and reduced motion: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
