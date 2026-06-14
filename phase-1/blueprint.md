# SYNTHEX Holding Website - Phase 1 Experience Blueprint

Date: 2026-06-14  
Status: Approval draft  
Scope: Information architecture, interaction model, theme architecture, responsive wireframes, and 3D storyboard. This is not production UI.

## 1. Experience Position

SYNTHEX Holding owns the opening, the closing, the persistent navigation frame, and the relationship between all four operating companies. The companies receive distinct visual worlds without becoming separate websites.

The central narrative is:

> One holding system coordinates strategic supply, institutional trade, industrial materials and manufacturing, and nationwide distribution.

This sentence is an experience premise, not approved marketing copy.

## 2. Sitemap and Narrative Order

The approved implementation target is one long-form page per locale:

- `/en/`
- `/ar/`

Company deep links:

- `/en/#jollaq`
- `/en/#al-maria`
- `/en/#industrial`
- `/en/#shamco`
- Arabic equivalents retain the same stable hashes.

### Page Sequence

| Order | Stable ID | Ownership | Purpose | Target height |
| ---: | --- | --- | --- | --- |
| 1 | `holding` | SYNTHEX Holding | Hero, proposition, primary actions | 90-110 svh |
| 2 | `companies` | Holding frame | Four-company spatial selector | 80-100 svh |
| 3 | `overview` | Holding | Strategic sectors and operating model | 70-90 svh |
| 4 | `story` | Holding | 35+ year narrative and verified milestones | 80-100 svh |
| 5 | `principles` | Holding | Vision, mission, values | 65-85 svh |
| 6 | `jollaq` | JOLLAQ | Commodities and essential supply | 180-240 svh |
| 7 | `al-maria` | Al Maria | Institutional and international trade | 180-240 svh |
| 8 | `industrial` | SYNTHEX Industrial | Materials and manufacturing expansion | 180-240 svh |
| 9 | `shamco` | SHAMCO | Logistics and nationwide distribution | 180-240 svh |
| 10 | `network` | Holding | Four systems reconnect | 80-110 svh |
| 11 | `contact` | Holding | Partnership/contact path | 60-80 svh |
| 12 | `footer` | Holding | Corporate/legal navigation | Content height |

The selector appears immediately after the hero as required. Holding overview precedes the company worlds so users understand the parent structure before entering a subsidiary context.

## 3. Company Section Pattern

Each company world follows one reusable content sequence:

1. Company threshold: name, relationship to holding, opening statement.
2. Concise overview: one approved paragraph.
3. Capability field: three to five structured capability groups.
4. Proof/story module: only verified supplied content.
5. Connection module: how the company contributes to the holding network.
6. Contextual partnership action.
7. Transition corridor into the next company.

The visual scene may remain continuous, but semantic content remains normal HTML with stable landmarks and headings.

## 4. Navigation State Model

### Primary States

```text
holding
jollaq
al-maria
industrial
shamco
```

Holding-owned sections (`holding`, `companies`, `overview`, `story`, `principles`, `network`, `contact`, `footer`) resolve to the `holding` theme.

### Events

```text
INITIALIZE_FROM_URL
SELECT_COMPANY
NAVIGATE_TO_SECTION
SECTION_BECAME_DOMINANT
HASH_CHANGED
POPSTATE
LOCALE_CHANGED
ESCAPE_TO_HOLDING
```

### Precedence

1. Initial URL/hash restoration.
2. Browser back/forward and external hash changes.
3. Explicit user selection from navbar or selector.
4. Passive dominant-section observation.

Passive scroll updates must never fight an explicit smooth-scroll action. Observer updates are suspended until the target is reached or a short timeout expires.

### History Rules

| Cause | History action | Focus action |
| --- | --- | --- |
| Initial load | None | Preserve browser default |
| Selector/nav click | `pushState` | Focus target heading after scroll settles |
| Enter/Space on selector | `pushState` | Focus target heading |
| Passive scroll | `replaceState` | No focus movement |
| Back/forward | Browser-controlled | Restore target without stealing focus |
| Locale switch | Replace locale route, preserve hash | Focus locale control |
| Escape in company world | `pushState` to `#companies` | Focus active selector option |

### Navbar Transformation

The navbar remains one mounted component. Each state controls:

- Parent mark treatment and company label.
- Surface opacity, border, and material cue.
- Active accent and focus color.
- Contextual link set.
- Section-progress indicator.
- Company switcher trigger.
- Contextual CTA label.
- Compact icon language.

The holding return control is always visible when a company state is active.

## 5. Selector Interaction

Desktop:

- Four spatial objects in a 2x2 projected field around the holding core.
- Arrow keys move spatially.
- Home/End select first/last.
- Enter/Space activates.
- Hover/pointer movement changes depth only; it does not activate a company.

Mobile:

- Semantic horizontal snap list or two-column grid.
- No orbital drag requirement.
- Normal vertical scrolling remains primary.

Accessibility:

- Implement as a labelled radio-like selection group or tablist only if the controlled relationship is semantically valid.
- Production recommendation: labelled list of links with roving arrow-key enhancement. Native link behavior remains available.
- Visible focus is never replaced by scene highlighting.

## 6. Theme and Content Architecture

Every company config owns:

- Stable company ID.
- Localized display and legal names.
- Parent relationship label.
- Theme tokens.
- Navbar model.
- Icon family.
- Content groups.
- Scene key and parameters.
- Performance-tier overrides.
- Static fallback asset.
- Contact intent.

Shared holding primitives own:

- Grid and spacing scale.
- Typography scale.
- Chrome/silver material language.
- Motion durations/easing.
- Focus and contrast rules.
- Section shell and proof-module patterns.
- Locale and direction behavior.

See `schema.ts` for the typed draft.

## 7. Responsive Wireframes

### Desktop, 1440+

```text
+--------------------------------------------------------------------+
| HOLDING MARK | contextual links              companies | EN | CTA |
+--------------------------------------------------------------------+
| H1 proposition                    | persistent 3D holding structure |
| concise supporting copy           | pointer-reactive, scroll-linked |
| primary CTA  secondary CTA        | static fallback beneath canvas  |
+--------------------------------------------------------------------+
|             FOUR-COMPANY SPATIAL SELECTOR                           |
|     [JOLLAQ]    [AL MARIA]   [INDUSTRIAL]    [SHAMCO]              |
+--------------------------------------------------------------------+
| Holding overview / sectors / story / principles                     |
+--------------------------------------------------------------------+
| COMPANY THRESHOLD             | company-specific dimensional world |
| HTML content rail             | scene rail / proof module          |
| capability groups             |                                    |
+--------------------------------------------------------------------+
```

### Tablet, 768-1199

```text
+--------------------------------------------------+
| mark | company switcher | locale | menu          |
+--------------------------------------------------+
| copy (55%)               | simplified scene      |
+--------------------------------------------------+
| selector: 2 x 2 cards with depth treatment       |
+--------------------------------------------------+
| content and scene alternate in stacked bands     |
+--------------------------------------------------+
```

### Mobile, 320-767

```text
+----------------------------------+
| mark/company        locale | menu|
+----------------------------------+
| eyebrow                          |
| H1                               |
| supporting copy                  |
| CTAs                             |
| fixed-ratio simplified scene     |
+----------------------------------+
| company links, 1 column          |
| no scroll pinning                |
+----------------------------------+
| semantic content                 |
| static/lightweight scene modules |
+----------------------------------+
```

Mobile rules:

- No full-page scroll hijacking.
- No section requires landscape orientation.
- Sticky navigation consumes no more than roughly 64 px.
- Moving scenes sit behind an explicit readability surface.
- Tap targets are at least 44x44 CSS px.

## 8. Bilingual and RTL Model

- Locale is a route-level concern, not a component toggle that swaps text after hydration.
- Stable company hashes do not change by locale.
- `dir="rtl"` applies at the document root for Arabic.
- CSS logical properties control spacing and placement.
- Scene camera direction does not need to mirror, but directional UI, timelines, progress, arrows, and content flow do.
- Legal names and product terms remain source-controlled fields; no automatic runtime translation.
- The structural prototype uses only generic Arabic interface labels and explicit missing-copy notices.

## 9. 3D Storyboard

| Scene | Entry | Active action | Exit/connection | Assets |
| --- | --- | --- | --- | --- |
| Holding hero | Loose chrome/glass nodes emerge from darkness | Bonds assemble an abstract molecular S; subtle pointer parallax | Four energy paths separate from the central structure | References 1, 4, 5, 10 |
| Selector | Camera widens around holding core | Four engineered material slabs/portals become selectable | Chosen system moves toward camera and becomes section threshold | References 6-9 |
| Holding overview | Core becomes a network diagram | Sector nodes illuminate with HTML content progression | Network compresses into a timeline rail | References 2, 11 |
| JOLLAQ | Gold/green particles arrive through cargo geometry | Grain, commodity volumes, and supply paths move with controlled flow | Cargo edges become formal gold linework | References 12, 13 |
| Al Maria | Planes lock into institutional architecture | Contract-like layers and world routes align precisely | Gold line becomes an industrial measurement line | References 14, 15 |
| Industrial | Metal sections extrude along measurement axes | Chemical bonds, steel/aluminum geometry, then restrained paint flow | Paint ribbon becomes a route line | References 16, 17 |
| SHAMCO | Route line reaches warehouse/network nodes | Pulses move warehouse-to-agent-to-market | Nodes detach and return to holding core | References 18, 19 |
| Conclusion | Four material systems re-enter one field | They lock into one coherent holding structure | Structure quiets behind contact CTA | References 2, 10, 11 |

No generated document, map, building, contract, or vehicle is treated as factual proof.

## 10. Performance Tiers and Budgets

### Tier Selection

Tier is selected from:

- WebGL capability.
- Reduced-motion preference.
- Viewport size.
- Device memory and hardware-concurrency hints where available.
- Runtime frame-time degradation.

Users are never blocked from content while tier selection occurs.

| Budget | Tier 0: static | Tier 1: reduced | Tier 2: full |
| --- | ---: | ---: | ---: |
| Initial 3D JavaScript | 0 KB | Deferred | Deferred |
| DPR | N/A | 1.0 max | 1.0-1.5 adaptive |
| Draw calls per scene | N/A | <= 45 | <= 90 |
| Visible particles | N/A | <= 600 | <= 2,500 instanced |
| Dynamic lights | N/A | 0-1 | <= 2 |
| Shadow maps | None | None | One selective, <= 1024 |
| Postprocessing | None | None | One restrained pass maximum |
| Active canvases | 0 | 1 | 1 |
| Compressed scene payload | Static image only | Target <= 1.5 MB | Target <= 4 MB deferred |

Runtime rules:

- One persistent canvas, not one canvas per section.
- Dispose geometries, materials, and textures when no longer reachable.
- Reuse materials and instanced geometry.
- Pause or demand-render when the scene is settled/offscreen.
- Avoid React state updates inside the frame loop.
- Degrade tier if sustained frame time exceeds the agreed threshold.

## 11. Content Requirements

Content statuses:

- `approved`: may ship.
- `draft`: may be placed for review but not represented as final.
- `verification-required`: factual claim exists but lacks supporting approval.
- `missing`: structure exists but no source copy is available.
- `prohibited`: must not ship.

See `content-matrix.csv`.

## 12. Asset Approval Rules

See `asset-approval-matrix.csv`.

Until official masters arrive:

- Text-only company names are used in structural work.
- No low-resolution logo is enlarged.
- No raster logo is traced or redesigned.
- No AI-generated pseudo-photo is presented as documentary evidence.
- SYNTHEX Industrial receives a text label, not an invented logo.

## 13. Phase 2 Entry Criteria

Phase 2 may scaffold the application after approval of:

- Narrative order.
- Stable section IDs and hash behavior.
- Five-state navbar model.
- Next.js/TypeScript/R3F/GSAP technical direction.
- Typed configuration/content approach.
- Provisional use of text-only company labels until official logo masters arrive.

Content and identity dependencies may remain open, but they must remain visibly flagged in the application data.

## 14. Decisions and Open Issues

Decisions:

- One long-form page per locale.
- One persistent WebGL canvas.
- One mounted navbar with state-driven transformation.
- Native scroll remains primary.
- Stable Latin hashes across locales.
- Generated imagery is reference-only.

Open issues requiring client input:

- Approved corporate profile and Arabic translation.
- Official vector logos and selected SHAMCO/Al Maria variants.
- Official SYNTHEX Industrial identity.
- Verified timeline, contracts, project stage, geography, and coverage claims.
- Contact/legal details and form-delivery requirements.
- Authentic photography/video and usage rights.

