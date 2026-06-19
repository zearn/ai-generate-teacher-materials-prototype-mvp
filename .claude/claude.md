# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Zearn Teacher Prototype — project instructions

Read this at the start of every session. **For current status + next steps, read
`docs/session-handoff.md` first.** For full design specs see `docs/design.md`;
for the migration plan + architecture decisions see `docs/astro-migration-plan.md`.
`.claude/summary.md` is an older historical handoff — not kept up to date; prefer
`docs/session-handoff.md`.

---

## What this project is

High-fidelity interactive prototypes for the **Zearn AI Targeted Materials** flow,
built as an **Astro** static site (v5.7). Two pages:

- `/tower-alerts` — Reports → Tower Alerts page (alert cards, filters, modal).
- `/create-resources` — AI Targeted Materials page (webp preview images, loading
  state, modals, recreate flow, sidenav state machine).

Served locally via `npm run dev` (port 4321). `npm run build` produces a static
site in `dist/`.

---

## Working preferences

**Always ask 3–5 short clarifying questions before building a new page or
feature.** Cover scope, data, navigation, and interactivity. Angy prefers
this and explicitly invites it.

**Clone Figma 1:1.** Do not redesign, do not invent data. When in doubt about a
value, the Figma design context is the source of truth (over PNG/PDF exports).

**Style tweaks should be terse.** One-line acknowledgements, not paragraphs.

**Docs edits are pre-approved** (see `settings.local.json`): `docs/*.md`
(`design.md`, `astro-migration-plan.md`) and the `.claude/*.md` files. Edit them
without asking, but **always announce what you changed** so Angy can follow
along. Note: files in `.claude/` are gated by Claude Code as "sensitive" and may
still prompt regardless of the allow-list — that's why `design.md` was moved to
`docs/` (freely editable). `claude.md`/`summary.md` must stay in `.claude/`.

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

**Each commit and each push requires its own explicit request.** A prior "commit"
or "push" instruction in the same session does NOT authorize the next one.
There is no standing permission — not across sessions, not within a session.
Every git write action needs a fresh "yes, do it now" from the user.

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
| `src/pages/tower-alerts.astro` | Tower Alerts page — ALERTS data + full markup + page-scoped CSS |
| `src/pages/create-resources.astro` | AI Targeted Materials page — static markup; all state in client script |
| `src/scripts/tower-alerts.ts` | Tower Alerts interactivity: panel collapse, toggle, tooltip, scroll-shadow, CTM modal |
| `src/scripts/create-resources.ts` | Create Resources state machine: loading, shuffle bag, sidenav sync, modals, print |
| `src/scripts/modal.ts` | Shared `wireModal(selector)` helper — open/close/Esc/overlay-click/scroll-lock |
| `src/components/Icon.astro` | Inline SVG by name from `src/icons/`; single-color icons use `fill="currentColor"` |
| `src/components/Button.astro` | primary / secondary / icon variants; sizes xs/sm/md/cta; optional `href` |
| `src/components/Modal.astro` | Generic modal shell (overlay + stripe card + close-X + title + body slot + footer slot) |
| `src/components/TopNavAI.astro` | AI-page top nav (logo + title + BETA pill + yellow underline) |
| `src/components/SubNavAI.astro` | AI-page sub-nav (back-arrow link + student title) |
| `src/components/SideNavAI.astro` | AI-page sidenav (Mini Lesson / Student Materials / Sample Script / Coming Soon + nav-slider) |
| `src/components/BeforeYouGoModal.astro` | "Before You Go" modal (BACK TO TOWER ALERTS + Print) |
| `src/components/AreYouSureModal.astro` | "Are You Sure?" recreate-confirm modal (CANCEL + RECREATE + "Don't show again") |
| `src/components/CreateTargetedMaterialsModal.astro` | CTM modal on Tower Alerts (fuchsia stripe, student/objective fields, CREATE) |
| `src/data/lessonSets.ts` | Lesson set data: MINI_LESSONS pool (4 sets → 5 planned), aligned student/script variants |
| `src/icons/` | 36 cleaned SVG source files consumed by Icon.astro at build time |
| `src/layouts/BaseLayout.astro` | `<html>`, `<head>`, fonts, global CSS (`tokens.css`, `base.css`) |
| `src/styles/tokens.css` | 290 brand tokens as CSS custom properties — the ONLY place hex values live |
| `src/styles/base.css` | Resets, typography, `--card-dropshadow`, link states (`a` → aqua-75/85/95) |
| `src/styles/create-resources.css` | Global CSS for create-resources (crosses components; imported by the page) |
| `public/previews/` | Webp preview images served as-is by the dev/build server |
| `assets/images/svg/` | Original icon SVG downloads (historical reference; not loaded at runtime) |
| `assets/not-used/` | Archived design refs, legacy PDFs, per-key preview PNGs — nothing here is live |
| `.claude/launch.json` | Preview server config (Astro dev server on port 4321) |
| `.claude/settings.local.json` | Claude Code permissions / settings (local-only, gitignored) |

---

## Local preview

```
mcp__Claude_Preview__preview_start({ name: "astro" })
```

Then `http://localhost:4321/tower-alerts` or `/create-resources`.
Reuses the running dev server if already started.

For verification, prefer `preview_inspect` (computed styles) over screenshots
for confirming specific values; screenshots for layout/visual sanity.

---

## Design tokens (use these consistently)

All hex values live **only** in `src/styles/tokens.css` (290 tokens). Every
component references `var(--token-name)`. Never hard-code hex values inline.

Key tokens by usage:

```
--yellow-20:     #FAD232    active nav tab background
--aqua-75:       #007694    links, primary button bg, icon default
--aqua-85:       #005D77    links/buttons hover, secondary button press
--aqua-95:       #004155    links/buttons press
--aqua-40:       #1CC7E6    modal top stripe (generic Modal.astro)
--aqua-60:       #0099BB    selected modal-option border
--aqua-10:       #D9F7FF    selected modal-option background
--purple-90:     #7029A5    alert count, BETA pill text/border, tower-circle, sidenav slider
--purple-5:      #FAF1FF    BETA pill bg, sidenav active bg, objective-card bg, CTA card bg
--purple-15:     #F1D9FE    objective-card border
--fuchsia-45:    #F182EA    CTM modal top stripe; sidenav active left border; sparkle icon
--fuchsia-50:    #EA74E3    sparkle animation fill (via CSS @keyframes)
--charcoal-95:   #303B40    primary text
--charcoal-90:   #414C52    breadcrumb text, modal close-X
--gray-5:        #F6F6F6    page background
--gray-10:       #EBEBEB    PROBLEM / TEACHER GUIDANCE header bands, skeleton bars
--gray-15:       #E1E1E1    subnav item borders, skeleton bars
--gray-30:       #C7C7C7    filter-box border, modal dividers, sub-nav border
--gray-40:       #B4B4B4    Coming Soon disabled text
--gray-55:       #989898    line-2 separators
--gray-60:       #8E8E8E    Coming Soon label
--gray-65:       #838383    "Generated …" timestamp
--gray-75:       #6E6E6E    Problem Set label
--green-80:      #007041    completed alert check circle bg
--red-75:        #D2000F    red italic answer text in problems
--card-dropshadow: 1px 1px 3px 0 rgba(0,0,0,0.24)   white card shadow (base.css)
```

Fonts: Source Sans Pro 400 / 600 / 700 for the app; Oxygen on footer elements.

---

## Patterns

### Icon system (`Icon.astro`)

`<Icon name="back-arrow" />` inlines the matching SVG from `src/icons/`.

- **27 single-color UI icons** have `fill="currentColor"` — color follows CSS
  `color` context. Set color on the parent element or the `<Icon>` wrapper.
- **9 brand-art icons** (zearn-logo, tower-circle, sparkles, purple-people,
  modal-checkbox-checked, etc.) keep literal fills baked in — don't try to
  recolor them via CSS.
- `size={N}` sets both width and height (px). Or set via CSS.
- Icon ids are namespaced per render — no clipPath collisions when an icon repeats.

To add a new icon: drop the cleaned SVG into `src/icons/`, ensure single-color
paths use `fill="currentColor"` (or keep literal fills for brand art), then use
`<Icon name="your-icon" />`.

### Modal pattern (`wireModal` + `Modal.astro`)

`wireModal(selector)` from `src/scripts/modal.ts` returns `{ open, close }` and
auto-wires `.modal-close` button, overlay-click, Escape, and body scroll-lock.

**Generic modal** uses `Modal.astro` (overlay + aqua-40 top stripe + close-X +
`title` prop + `<slot>` body + optional `<slot name="footer">`):
```ts
import { wireModal } from "../scripts/modal";
const m = wireModal("#myModal");
triggerEl.addEventListener("click", () => m.open());
```

**Dedicated modals** (CTM, BeforeYouGo, AreYouSure) have unique structure and
are their own `.astro` files, but still use the same `.modal-overlay` / `.modal-close`
root convention so `wireModal` drives them identically.

Astro `<script>` tags are deferred modules (run after DOM parse) — **no
`DOMContentLoaded` wrapper needed** when the script imports from a page `.astro`.

### Loading / loaded CSS gating

The create-resources page uses class flags on `<html>` to gate visibility:
```
.loading    → initial skeleton state (default)
.loaded     → real content visible (added via setTimeout after generation)
.recreating → mid-generation (sidenav + button-group stay; page area shows loader)
.ctas-visible → end-of-page CTAs revealed (1.5s after initial render)
```

Add `.loaded` to `document.documentElement` (not `document.body`) — Claude
Preview strips body classes added at load time but leaves `<html>` alone.

### Preview rendering & printing (webp)

- The app renders **webp preview images** from `public/previews/`. No PDFs at runtime.
- **Print** (`printCurrentMaterials`) collects visible `img.lesson-preview` elements,
  builds a hidden iframe with those images, and calls `print()` — prints exactly
  what's on screen, in DOM order. Don't fire during automated preview verification.
- **Download** is unwired (button is CSS-hidden, code omitted). To be rebuilt later.

---

## JS architecture — create-resources page

`src/scripts/create-resources.ts` is the page state machine.

### Shuffle bag (variant model)
A pool of mini-lesson **sets** (`MINI_LESSONS` in `src/data/lessonSets.ts`);
each set = mini lesson + aligned student-materials variants + sample-script variants.
- On arrival: a **random** set from the bag shows.
- Top RECREATE → draws the **next** set in a unique random cycle (no repeats until
  all shown, then reshuffle) + resets dependent materials to ungenerated.
- Generating student materials / sample script → picks a random 1-of-N of the
  **current** set's variants; re-generating toggles A1↔A2.
- URL param `?student=` drives the subnav title only — there is no `lessonKey`
  matching; set selection is always random.

### `state` object
```ts
state = {
  generated:   { worksheet: false, sampleScript: false },
  currentView: "miniLesson",  // "miniLesson" | "worksheet" | "sampleScript"
  generatedAt: { miniLesson: string, worksheet: string, sampleScript: string },
}
```

### Key functions

| Function | What it does |
|---|---|
| `triggerLoading(material)` | Runs the loading animation, then renders the target material. `null` = recreate current; `"worksheet"` / `"sampleScript"` = first-time generation. |
| `syncSidenavAndCtas()` | Syncs all DOM classes to `state` (sidenav active/generated/current, slider, CTA `.is-generated`). Call after any `state` mutation. |
| `updateNavSlider()` | Repositions the purple sliding highlight in the sidenav. Called by `syncSidenavAndCtas()`. |
| `renderMaterial(material)` | Shows the webp preview for the given material; adds `.visible` to its section; updates `state`. |
| `printCurrentMaterials()` | Prints all visible webp previews via hidden iframe. |

---

## Known quirks / "I keep hitting this" gotchas

1. **Claude Preview strips class attributes added to `<body>` during load.**
   Always add loading-state classes to `document.documentElement` (`<html>`),
   not `document.body`. Post-load additions (setTimeout callbacks, click handlers)
   are fine on either.
2. **Astro `<script>` is deferred — no `DOMContentLoaded` needed.** The module
   runs after DOM parse, so modal elements are already in the tree. The old
   HTML prototype needed a `DOMContentLoaded` wrapper; the Astro port does not.
3. **`LOADING_MS` is set to 3000 (3s) for dev testing.** Change to 9000 before
   any demo that should show the full generation animation.
4. **The nav-slider positioning** uses `getBoundingClientRect()` — call after
   fonts/images have settled (`load` or `requestAnimationFrame`), not just on parse.
5. **`preview_screenshot` vs `preview_inspect`.** Screenshots show layout but
   not exact values. Use `preview_inspect` with specific CSS properties to confirm
   computed colors, sizes, and font weights.

---

## Asset conventions

- **`src/icons/*.svg`** — cleaned SVG source files consumed by `Icon.astro` at
  build time. Single-color paths use `fill="currentColor"`; brand art keeps
  literal fills. Naming: kebab-case (`back-arrow.svg`, `modal-close-x.svg`).
  These are NOT fetched at runtime — they're inlined by the build.
- **`public/previews/*.webp`** — preview images fetched at runtime by the
  create-resources page. Paths are referenced as `/previews/filename.webp`
  (absolute, served from `public/`). Naming keeps the original format:
  `mini_lesson_{set}_{variant}.webp`, `student_materials_{set}_{variant}@2x.webp`,
  `sample_script_{set}_{variant}.webp`.
- **No runtime PDFs.** The app renders webp previews only. Legacy PDFs and the
  Download-feature PDFs are in `assets/not-used/` pending a Download rebuild.
- **`assets/images/svg/`** — the original Figma SVG downloads (historical refs;
  not loaded at runtime). The `src/icons/` files are the cleaned build-time copies.
- **`assets/not-used/`** — design references, archived PDFs, per-key preview PNGs.
  Nothing here is loaded. Don't delete or rely on these.

### Route naming (Astro pages)
Astro pages use clean routes: `/tower-alerts`, `/create-resources`. No obfuscated
suffixes on `.astro` files. If you need a new page:
1. Create `src/pages/my-page.astro` → route becomes `/my-page`.
2. No random suffix needed — Astro routes aren't guessable by content.
3. Update internal `<a href>` references and docs as needed.

---

## Out of scope (don't spend time on these)

Unless the user explicitly asks, the following are NOT goals of this prototype
and shouldn't be built:

- **No real backend.** All "generation" is simulated with `setTimeout`. Don't
  add API calls, fetch logic, or server code.
- **No authentication.** No login flow, no user accounts, no session management.
- **No responsive / mobile design.** The prototype targets a desktop viewport
  (~1280px wide). Don't add media queries or mobile breakpoints.
- **No accessibility beyond basic alt text and aria-labels.** No screen
  reader testing, no full ARIA wiring, no keyboard-navigation polish.
- **No real student data.** All data is hardcoded synthetic content (ALERTS
  array, lesson sets, lesson content in webps). No analytics, no telemetry.
- **No state persistence across reloads.** In-memory only (e.g. `skipAysModal`).
- **No cross-browser polishing.** Targeting modern Chrome.
- **No new npm packages** beyond the Astro/TypeScript stack already in
  `package.json`. Don't add UI libraries, component frameworks, or bundlers.
  Astro can embed a Vue island if genuinely needed — nothing currently does.

---

## Git

- Repo: `git@github.com:zearn/ai-generate-teacher-materials-prototype-mvp.git`
  (MVP iteration; independent from the original prototype repo)
- Repo-local git identity: `AngyBrooksZ <angy@zearn.org>` (already configured;
  don't touch global config).
- Pushes use SSH.
- See the "Git: never commit or push unless asked" section above for the
  rule on when to actually run git commands.
