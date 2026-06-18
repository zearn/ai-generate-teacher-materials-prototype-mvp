# Astro Migration Plan

Planning doc for moving the Zearn AI Targeted Materials prototype from two
self-contained vanilla HTML files to an Astro project. Captures the decisions
made and the proposed structure. **Nothing here is built yet** — this is the
scope for review.

---

## Decisions (2026-06-17)

- **Framework: Astro.** Chosen over staying vanilla (doesn't fix duplicated page
  chrome) and over React/Vue SPA (overkill for mostly-clickable screens; heavier
  for two designers to maintain). Astro ships static HTML, is HTML-shaped, and
  gives shared layouts/components + global design tokens.
- **Maintainers:** two designers, collaborating via this GitHub repo.
- **Interactivity:** mostly clickable screens + modals/states; light JS only.
  No heavy app state. (If a genuinely interactive piece is ever needed, Astro can
  embed a **Vue** island — a deliberate nod to Zearn eng's Vue + Vite stack.)
- **Source of truth:** the **repo** (tokens + components), not Figma. Figma stays
  the design source for *new* screens.
- **New pages/components come from Figma frames** via the Figma MCP
  (`get_design_context` on the frame → build to match), continuing the
  "clone 1:1" workflow.
- **Icon system: true inline `<svg>`** rendered by an `<Icon>` component, with
  `fill="currentColor"` / `var(--token)` — so icon colors join the token system
  (fixes the baked-in-base64 color limitation). The existing `.svg` files in
  `assets/images/svg/` become the build-time source; Figma's `var(--fill-0, …)`
  cruft gets stripped on the way in.
- **Output:** static site (easy to host + share a URL). Single-file portability
  is no longer a goal.

---

## Proposed structure

```
src/
  styles/
    tokens.css        # :root brand palette (the ONE source of color hex)
    base.css          # resets, typography (Source Sans Pro; Oxygen for footer)
    components.css     # shared component styles (or co-locate per .astro)
  layouts/
    BaseLayout.astro       # <html>, <head>, font links, global CSS, <slot/>
    AppShell.astro         # top nav + (optional) sub-nav wrapper
  components/
    TopNavAI.astro         # AI-page top nav (simplified); full nav = its own component later
    SubNavAI.astro         # AI-page sub-nav (back link + student title)
    SideNavAI.astro        # AI-page sidenav: Mini Lesson / Student Materials / Sample Script / Coming Soon
    # (page-specific chrome carries an "AI" suffix; Icon/Button/Modal stay generic)
    Modal.astro            # generic shell (wireModal logic → small JS)
    Button.astro           # primary / secondary / icon variants + states
    CtaCard.astro          # end-of-page "Create" CTAs
    AlertCard.astro        # Tower Alerts card
    DisclaimerBanner.astro
    Icon.astro             # inline <svg> by name; fill via currentColor/token
  icons/                   # cleaned source svgs (fill=currentColor), consumed by Icon.astro
  pages/
    tower-alerts.astro     # → /tower-alerts
    create-resources.astro # → /create-resources
    # future pages drop in here
public/
  targeted_materials/...   # webp previews + download pdfs (served as-is)
```

### Design tokens (`tokens.css`)
- `:root` defines the brand palette as CSS custom properties named by token:
  `--aqua-75`, `--gray-30`, `--purple-90`, etc. (hex from the Brand Colors
  palette in `design.md`).
- **Hex appears only here.** Every component references `var(--token)`.
- This is the resolution of the paused HTML token refactor — it now lives in one
  shared file instead of duplicated `:root` blocks per HTML file.

### Layouts
- `BaseLayout` owns `<head>`, fonts, and imports global CSS.
- `AppShell` composes `TopNav` (+ `SubNav` where used) so every page shares one
  header definition — the main thing that kills duplication today.

### Components
- Each repeated chunk (nav, sidenav, modal, button, CTA, alert card) becomes one
  component with props for its variants/states. Change once, every page updates.
- `Modal.astro` carries the open/close/Escape/overlay behavior (port of the
  existing `wireModal` helper) as a small inline script or island.

### Icon system
- `Icon.astro` inlines the matching cleaned SVG and applies `fill: currentColor`
  (or a token). Usage: `<Icon name="back-arrow" />`, color set by CSS context.
- Hover/press recolors become `fill: var(--aqua-85)` etc. — no `filter` hacks.

### Pages
- One `.astro` file per screen under `src/pages/`, composed from components.
- New screens are built from their Figma frame.

---

## Resolved (2026-06-17)

- **Aqua interaction model** (confirmed):
  - *Links + icons:* `aqua-75` default → `aqua-85` hover → `aqua-95` pressed
    (color only, no invert).
  - *Primary button bg:* `aqua-75` → `aqua-85` hover → `aqua-95` press.
  - *Secondary button:* `aqua-75` border + content on white bg → bg fills
    `aqua-75` on hover (content knocks out to white — the "invert") → bg
    `aqua-85` on press.
- **`aqua-95` typo fixed** in `design.md`: now reads "link + icons on **press**".
- **Color shifts accepted** — use exact brand hexes everywhere, including the
  visibly darker `--green #00875a → green-80 #007041` and the minor shifts to
  aqua-pressed (`aqua-85`), line (`gray-30`), footer (`gray-90`),
  charcoal-2 (`charcoal-90`), line-2 (`gray-55`).

## Remaining tasks (not blocking the scaffold)

1. **Drop unused tokens** during migration: `--fuchsia-spark`, `--fuchsia-5`,
   `--gray-55` (the var), `--help-bg`.
2. **Update `CLAUDE.md`** — it still describes the old "self-contained base64
   HTML" architecture; rewrite once the Astro structure lands (not before).

---

## Migration approach (incremental, low-risk)

1. Scaffold Astro in the repo (keep the existing HTML files untouched).
2. Build `tokens.css` from the Brand Colors palette.
3. Build the icon system (clean a handful of SVGs → `Icon.astro`).
4. Port shared components, then rebuild **one** page (create-resources) to parity
   as a proof — review ergonomics before doing the second page.
5. Resolve the open token items (above) as part of building `Button`/links.
6. Once both pages reach parity and are approved, retire the old HTML files and
   update `CLAUDE.md`.

## Out of scope (unchanged)
No real backend, auth, responsive/mobile, real student data, or state
persistence — same constraints as the current prototype.

---

## Interactivity migration

Astro renders **static HTML at build time**; there is no client runtime unless
you opt in. So the migration splits each screen into two halves:

- **Markup → Astro components** (server-rendered `.astro` files).
- **Behavior → client `<script>`** (vanilla TS, processed/bundled by Astro).
  This is a near 1:1 port of today's inline `<script>` — *not* a rewrite into a
  reactive framework. Reach for a **Vue island** (`client:*`) only if a single
  piece genuinely needs reactivity; nothing here currently does.

### Guiding principles
- One client script per page (`src/scripts/create-resources.ts`,
  `tower-alerts.ts`), imported from the page's `.astro` via
  `<script>import "../scripts/create-resources.ts"</script>`. Astro script tags
  are `type=module` and **deferred**, so they run after the DOM is parsed —
  this replaces the old `DOMContentLoaded` wrapping for modal markup.
- Shared behavior (the modal helper) → a small importable module
  (`src/scripts/modal.ts`), the direct port of `wireModal()`.
- **Server→client data** (e.g. the variant→webp maps): emit from `.astro`
  frontmatter into a `<script type="application/json">` tag or `data-*`
  attributes, and read it in the client script. Keeps hex/paths in one place.
- Keep the robust loading pattern: **default to the loading state in CSS** and
  add `.loaded` to `<html>` via `setTimeout` (survives the Claude-Preview
  class-strip quirk; harmless on the Astro dev server too).

### Piece-by-piece mapping

| Current behavior | Astro home | Notes |
|---|---|---|
| `state` machine (generated flags, currentView, generatedAt) | `create-resources.ts` | Ported as-is; plain module-scoped object. |
| `?lessonKey=` variant selection + `*_VARIANTS` maps | frontmatter → JSON `<script>` → client | See "Variant routing" decision below. |
| 9s loading → `loaded`; cycling messages; skeleton | CSS animations + 1 `setTimeout` | Markup always rendered; visibility via `.loading`/`.loaded` on `<html>`. |
| Sparkle loading illustration (animates fill `fuchsia-5`↔`fuchsia-60`) | inline-`<svg>` component + CSS `@keyframes` on `fill` using **tokens** | One of the few true-inline-SVG cases; colors now tokenized. |
| `renderMaterial` / `.visible` section toggling (CTA slot pattern) | `create-resources.ts` | Section components rendered; script toggles `.visible`. |
| `triggerLoadingThenRender`, recreate flow, `.recreating` | `create-resources.ts` | Timers/state stay client-side. |
| `syncSidenavAndCtas`, `updateNavSlider` (purple slider) | `create-resources.ts` | DOM-class sync; unchanged logic. |
| `wireModal()` (open/close/Esc/overlay) + byg/ays modals | `src/scripts/modal.ts` + `Modal.astro` | Shared helper; component renders markup. |
| `printCurrentMaterials` (hidden iframe of visible webps) | `create-resources.ts` | Ported verbatim; DOM-driven. |
| `.no-worksheet` flag | client script | Set from whether `lessonKey` has a worksheet variant. |
| Tower-alerts `ALERTS` array + filters + cards | `AlertCard.astro` (data in frontmatter) + `tower-alerts.ts` for filter interactivity | Cards server-rendered from the array; filtering is client JS. |
| Create-Resources modal → navigate with URL params | `<a>` / client nav to the routed page | Builds `?student=…&lesson=…`. |

### Resolved: variant model = shuffle bag (query-param page)
Not a `lessonKey`-matched variant — the page simulates an AI generating
*different* aligned materials each time. A pool of mini-lesson **sets** (5 in the
end state, 4 today); each set = mini lesson + 1-of-N aligned student materials +
1-of-N aligned sample scripts. On arrival a **random** set shows; top RECREATE
draws the **next** in a **unique random cycle** (no repeats until all shown, then
reshuffle). Generating a material picks a random 1-of-N of the *current* set;
recreating it **toggles** to the other (A1↔A2). Recreating the mini lesson
**resets** generated materials to ungenerated (re-generate aligned to the new
lesson). The set is **random, not** matched to the previous screen's
grade/mission/lesson (that's context only) → one **query-param page**
(`?student=…`), client-side bag, **no `lessonKey` matching**. Data lives in
`src/data/lessonSets.ts`. (Static-route-per-variant is moot — sets are random.)

### Risks / sequencing
- **Script timing:** Astro deferred modules run post-parse — good, but confirm
  any code that measured layout (`adjustPageAreaHeight`) runs after fonts/images
  settle (use `load`/`requestAnimationFrame`, not just parse).
- **Asset paths:** webp previews + download PDFs move to `public/` and are
  referenced by absolute `/…` paths (no import needed). Icons go through
  `Icon.astro` (imported, inlined).
- **Don't tokenize SVG colors blindly:** only the single-color UI icons should
  become `currentColor`; brand/multi-color art (logo, sparkles) keeps its fills.
- **Suggested port order:** `Icon.astro` → `Button` + link styles (resolves the
  aqua state model) → `Modal` → `TopNav`/`SubNav`/`Sidenav` → assemble
  `create-resources` → verify in browser → then `tower-alerts`.

---

## Progress (as of 2026-06-17)

**Done & building (`npm run build` green):**
- Astro scaffold: `package.json`, `astro.config.mjs`, `tsconfig.json`,
  `src/layouts/BaseLayout.astro`, `src/pages/index.astro` (placeholder),
  `src/styles/base.css`.
- `src/styles/tokens.css` — **290 brand tokens**, generated directly from the
  `## Brand Colors` palette in `design.md` (single source of color; zero drift).
- `base.css` already encodes the link state model (`aqua-75/85/95`).
- `.gitignore` updated for `node_modules/`, `dist/`, `.astro/`.
- **Icon system — complete.** `src/components/Icon.astro` inlines a cleaned SVG
  from `src/icons/` (36 files) as true `<svg>`. Inline-SVG cruft removed
  (`preserveAspectRatio="none"`, `overflow="visible"`, `style="display:block"`) —
  inline `<svg>` defaults to `xMidYMid meet`, so removal *is* the normalization.
  **27** single-color UI glyphs use `fill="currentColor"` (color follows CSS
  context — the migration's goal); **9** brand-art files (zearn-logo, the
  sparkles, tower-circle, purple-people, modal-checkbox-checked) keep literal
  fills. The component defaults size from the `viewBox` (override via
  `size`/`width`/`height` props or CSS — emitted as attributes so component CSS
  still wins) and namespaces every id per render so a repeated icon can't cause
  clipPath/id collisions. Verified in-browser (currentColor recolor, art fills
  preserved, 0 duplicate ids, sizing).
- **Button + links — done.** Links in `base.css` (`a` → aqua-75/85/95; icons
  inherit via `currentColor`). `src/components/Button.astro`: variants
  `primary`/`secondary`/`icon`, sizes `sm` (32/14) + `md` (40/16), optional
  `href` (→ `<a>`), `minWidth`, `id`. Resolved aqua states (primary 75→85→95;
  secondary/icon invert to aqua-75 + white, press aqua-85). Icon knockout via
  `color:#fff` + `currentColor` — no filter hack. Verified in-browser. (No
  CTA-pill variant yet — add when assembling create-resources.)
- **Modal — done.** `src/scripts/modal.ts` = verbatim `wireModal` port
  (open/close/Esc/overlay-click/scroll-lock). `src/components/Modal.astro` =
  generic shell (overlay → aqua-40-stripe card → close-X → `title` prop + body
  slot → optional footer slot). Plus real `BeforeYouGoModal.astro` (primary BACK
  TO TOWER ALERTS `<a>` + Print; Download omitted pending rebuild) and
  `AreYouSureModal.astro` (secondary CANCEL + primary RECREATE; custom checkbox).
  Verified in-browser (byg 600px / ays 470px; variants + checkbox).
- **TopNavAI / SubNavAI / SideNavAI — done (markup + visual states).** The `AI`
  suffix marks page-specific chrome for the AI Targeted Materials page (vs the
  generic Icon/Button/Modal). `TopNavAI.astro` (simplified; full Curriculum/Reports
  variant deferred), `SubNavAI.astro`, `SideNavAI.astro` (Mini Lesson active +
  Student Materials/Sample Script sparkle
  Buttons + Problem Set Coming Soon; `nav-slider` parked under the active item by
  a placeholder positioner). Extended `Button` with `xs` (24px) + `swapIcon`
  (sparkle↔refresh, toggled by `.is-swapped`); added `--card-dropshadow` to
  `base.css`. Sidenav state machine + loading skeleton deferred to assembly.
  Verified in-browser.

**In progress / next up:**
- **Assemble `create-resources`** — compose chrome (TopNav/SubNav) + disclaimer +
  sidenav + main column, port the page state machine + loading flow, and wire the
  modals (back-link → byg, sparkle/RECREATE → ays). Then verify → `tower-alerts`.
  Preview with `preview_start("astro")` (port 4321).

**Everything else from the existing prototype is untouched** — the two HTML
files still work and are the source of truth for parity until ported.
