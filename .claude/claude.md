# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Zearn Teacher Prototype — project instructions

Read this at the start of every session. For full design specs see `design.md`.
`summary.md` is a historical handoff doc from an earlier session — it's not kept up to date; don't treat it as current status.

---

## What this project is

High-fidelity interactive HTML prototypes for the **Zearn AI Targeted Materials**
flow. Two self-contained HTML files, each with inlined base64 assets, served
locally via a Python HTTP server on port 8765.

- `tower-alerts-prototype-iBGSV5YMFky3cZJiZNEY.html` — Reports → Tower Alerts page (10 student
  alert cards, filters, modal).
- `create-resources-95a534VKBScVGb3WUOvN.html` — AI Targeted Materials page (renders webp preview
  images inside a scrollable card, with loading state, modals, recreate flow, and CTAs).

No build step. No framework. Vanilla HTML/CSS/JS, intentionally.

---

## Working preferences

**Always ask 3–5 short clarifying questions before building a new page or
feature.** Cover scope, data, navigation, and interactivity. Angy prefers
this and explicitly invites it.

**Clone Figma 1:1.** Do not redesign, do not invent data. When in doubt about a
value, the Figma design context is the source of truth (over PNG/PDF exports).

**Style tweaks should be terse.** One-line acknowledgements, not paragraphs.

**Do not add UI elements that aren't in the Figma/PNG**, even with good
rationalization. If a value needs to be made visible for debugging or demoing
wiring, put it in the URL, document title, or a data attribute — not into
visible UI. Ask before adding anything not in the design source.

**Verify visually after meaningful changes.** Use `mcp__Claude_Preview__preview_screenshot`
after changes, and `preview_inspect` to confirm exact computed styles. Don't
claim something is fixed without verifying it rendered.

---

## Git: never commit or push unless asked

**Do not run `git commit`, `git add` for the purpose of committing, `git push`,
or any destructive git operation (reset --hard, force push, branch -D, etc.)
unless the user explicitly asks for it.** Even after finishing a feature, leave
changes uncommitted unless they say "commit and push" (or similar). Showing
`git status` / `git diff` to summarize what changed is fine; making a commit
is not.

When the user does ask for a commit:
- Use the repo-local identity `AngyBrooksZ <angy@zearn.org>` (already configured;
  don't touch global config).
- Stage specific files by name, not `git add -A` or `git add .`.
- Never `--amend` unless explicitly asked (creates a NEW commit if a previous
  commit needs adjusting).
- Never skip hooks (`--no-verify`).

---

## File map

| Path | What it is |
|---|---|
| `create-resources-95a534VKBScVGb3WUOvN.html` | The AI Targeted Materials page (main work focus lately) |
| `tower-alerts-prototype-iBGSV5YMFky3cZJiZNEY.html` | The Tower Alerts source page (Create Resources link → modal → create-resources-95a534VKBScVGb3WUOvN.html) |
| `assets/` | Top-level asset root. Holds `images/` and `not-used/` only. |
| `assets/images/svg/` | All icon/sparkle SVG source files. Base64-inlined into the HTML (not loaded by path at runtime). |
| `assets/images/webp/{mini_lessons,student_materials,sample_scripts}/` | Preview images rendered at page load. Filenames keep their original prefix — `mini_lesson_{key}.webp`, `student_materials_{key}@2x.webp`, `sample_script_{key}.webp`. Referenced by the `*_VARIANTS` maps in create-resources. |
| `assets/not-used/` | Archive of everything not referenced by the app: old design-reference PNGs/SVGs/PDFs, the legacy runtime PDFs, the per-key preview PNGs, and the archived `targeted_materials/download/pdf/` tree (the unwired Download feature — rebuild later). Nothing here is loaded at runtime. |
| `.claude/launch.json` | Preview server config (Python http.server on port 8765) |
| `.claude/settings.local.json` | Claude Code permissions / settings (local-only, gitignored) |

---

## Local preview

```
mcp__Claude_Preview__preview_start({ name: "prototype" })
```

Then http://localhost:8765/create-resources-95a534VKBScVGb3WUOvN.html or /tower-alerts-prototype-iBGSV5YMFky3cZJiZNEY.html.
Reuses the running server if already started.

For verification, prefer `preview_inspect` (computed styles) over screenshots
for confirming specific values; screenshots for layout/visual sanity.

---

## Design tokens (use these consistently)

Always reference the CSS custom properties in each file's `:root`. Don't
hard-code hex values inline. The key tokens:

```
--yellow:        #fad232    (active nav tab, yellow stripe)
--aqua:          #007694    (links, lessons, primary buttons; hover inverts to aqua fill + white text)
--aqua-pressed:  #005c73    (--aqua darkened 22%; :active press state)
--purple:        #7029a5    (alert card border, alert count, tower-circle, BETA pill)
--purple-bg:     #faf1ff    (active sidenav background, CTA card background)
--fuchsia:       #f182ea    (active sidenav left border, sparkles accent)
--fuchsia-spark: #ea74e3    (big sparkle icon fill)
--charcoal:      #303b40    (primary text)
--charcoal-2:    #435259    (breadcrumb text)
--gray-bg:       #f6f6f6    (page background)
--gray-10:       #ebebeb    (section header bands: PROBLEM / TEACHER GUIDANCE)
--gray-15:       #e1e1e1    (subnav item bottom border, skeleton bars)
--gray-30:       #c7c7c7    (sub-nav border, modal divider)
--gray-40:       #b4b4b4    (Coming Soon disabled text, vertical bar indicator)
--gray-60:       #8e8e8e    (Coming Soon label)
--gray-65:       #838383    ("Generated …" timestamp)
--gray-75:       #6e6e6e    (Problem Set label)
--green:         #00875a    (completed alert check icon)
--answer-red:    #d2000f    (red italic answer text in problems)
--card-dropshadow: 1px 1px 3px 0 rgba(0,0,0,0.24)  (X1Y1B3 — all white cards)
```

Fonts: Source Sans Pro 400 / 600 / 700 for the app. Oxygen on a few rare
places.

---

## Patterns

### Modal pattern (shared `wireModal()` helper)

Both HTML files have a `wireModal(selector)` helper. Adding a new modal:

1. Markup at end of body with class `*-modal-overlay` containing a card.
   The card has a button with class `modal-close` somewhere inside it.
2. Wire it up inside the existing `DOMContentLoaded` block:
   ```js
   const m = wireModal("#myModalId");
   triggerEl.addEventListener("click", () => m.open());
   ```
3. `wireModal()` handles close-X, overlay-click, and Escape automatically.
4. Wrap caller in `DOMContentLoaded` because modal markup lives AFTER the
   inline `<script>` in the body.

### SVG inlining

All icons are inlined as base64 data URIs (NOT URL-encoded — `#` colors break).
Before inlining: strip `width="100%" height="100%"`, replace
`preserveAspectRatio="none"` with `xMidYMid meet`, add explicit width/height
from the viewBox. Otherwise `<img>` renders at 0×0.

> **Heads-up on color**: each base64-inlined SVG has its `fill="#..."`
> **baked into the encoded string**. CSS custom properties (`var(--aqua)`)
> can't reach inside an `<img src="data:…">`. Consequences:
>
> - If the brand color ever changes (e.g. `--aqua` → some other hex), every
>   inlined icon currently using that color must be **re-encoded** from
>   source. Search the HTML for the literal hex inside `data:image/svg+xml;
>   base64,…` payloads.
> - For state-driven recolors (hover invert, press darken) we don't re-encode
>   per state — we apply `filter: brightness(0) invert(1)` (white) or
>   `filter: brightness(0.78)` (22% darker) on the `<img>` itself. That's
>   how the secondary-button + create-resources-link hover/press treatments
>   work today.

### Preview rendering & printing (webp)

- The app renders **webp preview images**, not live PDFs. PDF.js was removed
  (no `getDocument` / `renderPdf` / `currentPdfUrl`). Each material's preview
  `<img>` gets its `src` from the `*_VARIANTS` maps when generated.
- **Print** (`printCurrentMaterials`) collects the on-screen, visible
  `img.lesson-preview` elements that have a `src`, builds a hidden iframe with
  those images (one per page), and calls `print()` on it — so it prints exactly
  what's generated, in DOM order (mini lesson → worksheet → sample script).
  Note: calling `print()` opens the native dialog, which blocks the renderer —
  don't fire it during automated preview verification; test the selector instead.
- **Download** is unwired (button is CSS-hidden); its PDF code was removed and
  the PDFs archived to `assets/not-used/`. To be rebuilt later.

---

## JS architecture — create-resources page

The inline `<script>` in `create-resources-*.html` is a mini state machine.
Key concepts to understand before editing it:

### URL param `lessonKey`
`?lessonKey=G5M6L19` (or `G3M3L7`, `G4M5L6`, `G8M2L10`) selects which
variant's assets to load. Drives `currentVariant` and the `*_VARIANTS` lookups.
Falls back to a default if absent.

### Variant maps
Three `const` objects keyed by lesson key:
- `MINI_LESSON_VARIANTS` — preview `.webp` path per lesson
- `WORKSHEET_VARIANTS` — preview `.webp` path per lesson
- `SAMPLE_SCRIPT_VARIANTS` — preview `.webp` path per lesson

If no variant matches the URL key, `matchedWorksheet` / `matchedSampleScript`
are `null` and the `.no-worksheet` class is added to `<html>` to hide the
Student Materials CTA.

### `state` object
```js
state = {
  generated:   { worksheet: false, sampleScript: false },
  currentView: "miniLesson",          // "miniLesson" | "worksheet" | "sampleScript"
  generatedAt: { miniLesson, worksheet, sampleScript },  // timestamp strings
}
```

### CTA slot pattern
Each material lives in its own section (`#section-miniLesson`, `#section-worksheet`,
`#section-sampleScript`). Each section contains both the preview `<img>` AND the
CTA card. Adding `.visible` to the section reveals the image and hides the CTA
via CSS (no JS toggling needed per element). The `state.generated[mat]` flag
drives whether the section is `.visible`.

### Key functions
| Function | What it does |
|---|---|
| `triggerLoadingThenRender(material)` | Runs the 9s loading animation, then renders the target material. `null` = recreate `currentView`; `"worksheet"` / `"sampleScript"` = first-time generation. |
| `syncSidenavAndCtas()` | Syncs all DOM classes to `state` — sidenav active/generated/current indicators and CTA `.is-generated` states. Call after any `state` mutation. |
| `updateNavSlider()` | Repositions the purple sliding highlight in the sidenav to the active item. Called by `syncSidenavAndCtas()`. |
| `renderMaterial(material)` | Shows the `<img>` preview for the given material key; adds `.visible` to its section; updates `state`. |
| `adjustPageAreaHeight()` | Recalculates `.page-area` height to fit viewport after CTAs appear or the window resizes. |

### HTML class flags on `<html>`
- `.loading` → initial 9s skeleton state
- `.loaded` → real content visible
- `.recreating` → mid-generation state (sidenav + button group stay, page area shows loading)
- `.ctas-visible` → end-of-page CTAs revealed (added 1.5s after render)
- `.no-worksheet` → lesson has no student materials variant; hides that CTA

---

## Known quirks / "I keep hitting this" gotchas

1. **Claude Preview strips class attributes added during page load.** Setting
   `<body class="loading">` in HTML, or `document.body.classList.add(...)` in
   the inline script — both get wiped. Workarounds:
   - Add the class to `<html>` (`document.documentElement`) — that survives.
   - Or default to the loading state in CSS and add `.loaded` later via
     setTimeout (post-load additions survive).
2. **Inline `<script>` runs before `<modal>` markup is parsed** if the script
   is above the modal in body. Always wrap modal wiring in
   `document.addEventListener("DOMContentLoaded", () => { ... })`.
3. **CSS class strip via Preview only affects classes added DURING load.**
   Post-load class adds (via setTimeout, click handlers, etc.) persist.
4. **The 1080×1920 Figma viewports often render under-2x in Preview.**
   Visual layout may look smaller than expected; check `preview_inspect`
   for the actual computed sizes.

---

## Asset conventions

- **`assets/images/svg/*.svg`** — icon source files downloaded from Figma. These
  are NOT loaded at runtime by the HTML. Instead they get inlined into the HTML as
  **base64 data URIs** inside `<img src="data:image/svg+xml;base64,...">`.
  When you add a new icon: download the SVG, fix it (strip `width="100%"
  height="100%"`, replace `preserveAspectRatio="none"` with `xMidYMid meet`,
  add explicit width/height from the viewBox), base64-encode, paste inline.
  Because they're inlined, moving/renaming a source SVG never affects the app.
- **`assets/images/webp/{mini_lessons,student_materials,sample_scripts}/*.webp`** —
  the preview images that ARE fetched at runtime (via the `*_VARIANTS` maps in
  create-resources). Paths must match exactly. Print also reads these on-screen
  webp previews (see `printCurrentMaterials`).
- **No runtime PDFs.** PDF.js / `getDocument()` / `renderPdf()` were removed; the
  app renders webp previews only. The legacy runtime PDFs and the Download-feature
  PDFs (`targeted_materials/download/pdf/`) are archived under `assets/not-used/`
  pending a Download rebuild — don't wire anything to them.
- **`assets/not-used/`** — design references, screenshots, archived PDFs, and the
  per-key preview PNGs. Nothing here is loaded at runtime; retained as historical
  references. Don't delete or rely on these.
- **Naming**: kebab-case for SVGs (`back-arrow.svg`, `modal-close-x.svg`); webp
  previews keep their `{type}_{key}` filename (some carry an `@2x` suffix). Any
  PDFs that get re-introduced use Title Case with spaces (`Mini Lesson A.pdf`)
  since those are user-facing filenames matching what the user uploads.

### HTML filename obfuscation

**Every new `.html` file in this project must be named with a trailing
hyphen + 20 random alphanumeric characters**, e.g.
`my-page-aB3kP9xQwT2mN5vL7Yfz.html`. This is one layer of "security
through obscurity" so the prototype URLs aren't guessable by anyone who
hasn't been given the link. When you create or rename an HTML file:

1. Generate the suffix with `LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 20`.
2. Use that suffix exactly once per file (don't reuse across files).
3. Update every internal reference: `<a href>`, `location.href`, query-string
   navigations, docs in `.claude/*.md`, any preview URLs in instructions.
4. If renaming an existing file (vs creating a new one), do all reference
   updates BEFORE the `mv` so nothing is left dangling.

Do NOT add this suffix to non-HTML files (`*.svg`, `*.pdf`, `*.css`, etc.).

---

## Out of scope (don't spend time on these)

Unless the user explicitly asks, the following are NOT goals of this prototype
and shouldn't be built:

- **No real backend.** All "generation" is simulated with `setTimeout`. Don't
  add API calls, fetch logic, or server code.
- **No authentication.** No login flow, no user accounts, no session
  management.
- **No responsive / mobile design.** The prototype is built for a desktop
  viewport (~1280px wide). Don't add media queries or mobile breakpoints.
- **No accessibility beyond basic alt text and aria-labels.** No screen
  reader testing, no full ARIA wiring, no keyboard-navigation polish.
- **No real student data.** Everything is hardcoded synthetic content (the
  ALERTS array, the lesson content in PDFs). No analytics, no telemetry.
- **No state persistence across reloads.** Anything that needs to survive a
  reload (like the "Don't show again" pref) was explicitly scoped to be
  in-memory only.
- **No cross-browser polishing.** Targeting modern Chrome. Don't add IE
  fallbacks, Firefox-specific tweaks, or Safari workarounds unless the
  user reports a specific issue.
- **No external dependencies** beyond what's already loaded (Google Fonts).
  PDF.js has been removed. Don't add npm packages, no build step, no bundler.

---

## Git

- Repo: `git@github.com:zearn/ai-generate-teacher-materials-prototype-mvp.git`
  (MVP iteration; cloned with full history from
  `ai-generate-teacher-materials-prototype`, now independent)
- Repo-local git identity: `AngyBrooksZ <angy@zearn.org>` (global is still
  `angyb` for personal projects — don't change global).
- Pushes use SSH. There was a pending HTTPS PAT awaiting Zearn org approval
  the last time we checked — may or may not be active now.
- See the "Git: never commit or push unless asked" section above for the
  rule on when to actually run git commands.
