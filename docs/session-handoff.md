# Session handoff — 2026-06-18 (updated)

Context for the next session. **Read `.claude/claude.md` first, then this, then
[`docs/astro-migration-plan.md`](astro-migration-plan.md) and
[`docs/design.md`](design.md).**

## How this session started
It opened as a quick check — *"is the Figma MCP up and working?"* (it is:
authenticated as Angy Brooks, Zearn org) and *"start the servers"* — then grew
into a broad cleanup + a design-system + an architecture-planning session.

## What we did (in order)

1. **Asset cleanup.** Audited `assets/`, moved everything unused into
   `assets/not-used/` (loose design refs, the per-key preview PNGs, legacy
   runtime PDFs, and the whole `targeted_materials/download/pdf/` tree). The
   12 `.webp` previews are the only images the app loads.
2. **Print → webp; Download removed.** PDF.js was already gone. Rewrote Print as
   `printCurrentMaterials()` — prints the on-screen webp preview(s) via a hidden
   iframe. Removed the Download button's PDF wiring (button stays CSS-hidden,
   rebuild later). Updated the Before-You-Go / Are-You-Sure modal copy.
3. **Asset reorg.** `assets/images/svg/` (37 icons) + `assets/images/webp/{mini_lessons,
   student_materials,sample_scripts}/`. Updated the `*_VARIANTS` webp paths in
   the HTML and the docs.
4. **PR #1** ("Reorganize assets, archive unused files, switch Print to webp") —
   reviewed via `/code-review` (clean), **squash-merged**, branch deleted. Local
   `main` fast-forwarded.
5. **Git identity overhaul.** Global is now `AngyBrooksZ <angy@zearn.org>`.
   Created `~/ClaudeCodeProjects/angyb/` for personal projects and a conditional
   include in `~/.gitconfig` (`gitdir:~/ClaudeCodeProjects/angyb/` →
   `~/.gitconfig-angyb` = `angyb <github@angy.com>`). Moved `PatternMaker`,
   `SlackAvatar`, `UnrasterAI`, `ZearnSimple`, `ZearnTeacher BU` into `angyb/`.
   (`ZearnTeacher BU` keeps its own repo-local `AngyBrooksZ` override.)
6. **Color tokens.** Angy supplied the full brand palette (`brand-colors.md`).
   In `design.md`: rewrote `### Color usage` as a `| Token | Use for |` table
   mapped to nearest brand tokens, appended the full `## Brand Colors` palette
   (the hex source of truth), and converted every prose hex/old-var name to a
   token. Mapping changes confirmed: `gray-25→gray-30`, `green-70→green-80`,
   link/icon states `aqua-75`(default)→`aqua-85`(hover)→`aqua-95`(press),
   secondary-button bg invert kept. All approximate color shifts accepted.
7. **Architecture decision: Astro** (over vanilla / React / Vue SPA). New pages
   will be built **from Figma frames**. Icons → **true inline `<svg>`** so colors
   join the token system. Details + Interactivity-migration analysis in
   `astro-migration-plan.md`.
8. **Astro scaffolded** (builds clean) and the `design.md` /
   `astro-migration-plan.md` docs were relocated from `.claude/` into `docs/`.

## Current repo state
- **Astro scaffold present and `npm run build` passes.** `tokens.css` has all
  290 brand tokens generated from `design.md`.
- **Lots of uncommitted work on `main`** (the Astro scaffold, `docs/` reorg, the
  rewritten `design.md`, `claude.md` edits). `node_modules/`, `dist/`,
  `.astro/`, and `settings.local.json` are gitignored. PR #1 is already merged;
  everything since is uncommitted.
- **Branch `astro-icon-system`** (off `main`) holds the icon-system work,
  uncommitted. Added an `astro` config (port 4321, `npm run dev`) to
  `.claude/launch.json` — preview Astro pages via `preview_start("astro")`.
- **The two HTML prototypes still work and are the source of truth for parity**
  until ported.

## Where we're headed / next steps
Follow `astro-migration-plan.md`. Immediate:
1. ✅ **Icon system — DONE** (branch `astro-icon-system`, uncommitted).
   `src/icons/` (36 SVGs): inline-SVG cruft removed (`preserveAspectRatio="none"`
   + `overflow="visible"` + `style="display:block"`) — inline `<svg>` already
   defaults to `xMidYMid meet`, so removal *is* the normalization. **27**
   single-color UI glyphs → `fill="currentColor"`; **9** brand-art files (logo,
   sparkles, tower-circle, purple-people, modal-checkbox-checked) keep literal
   fills. New **`src/components/Icon.astro`** inlines by name, defaults size from
   the `viewBox` (override via `size`/`width`/`height` props or CSS), and
   uniquifies every id per render (no clipPath collisions when an icon repeats).
   Verified in-browser: currentColor recolors with context, art keeps fills,
   0 duplicate ids, sizing correct. `npm run build` green.
2. ✅ **Button/links — DONE (this pass).** Links already lived in `base.css`
   (`a` → aqua-75/85/95); icons inside links inherit via `currentColor`. New
   **`src/components/Button.astro`**: variants `primary` (filled) / `secondary`
   (outline, inverts) / `icon` (circle); sizes `sm` (32px/14px) + `md`
   (40px/16px); optional `href` (→ `<a>`, e.g. BACK TO TOWER ALERTS), `minWidth`,
   `id`. Resolved aqua states (primary 75→85→95; secondary/icon invert to aqua-75
   fill + white, press aqua-85). Icon knockout is `color:#fff` via `currentColor`
   — no filter hack. RECREATE stays 14px (`sm`) per the prototype, not design.md's
   16px. Verified in-browser. (Still no CTA-pill variant — add when assembling.)
3. ✅ **Modal — DONE (shell + helper).** `src/scripts/modal.ts` is the verbatim
   `wireModal` port (open/close/Esc/overlay-click/scroll-lock). New
   **`src/components/Modal.astro`** is the generic shell: overlay (70% black) →
   card (aqua-40 16px top stripe — matches prototype, *not* design.md's aqua-75)
   → close-X → `.modal-body` (uppercase 22px `title` prop + default slot) →
   optional `.modal-buttons` footer slot. Props: `id`, `title`, `stripeColor`,
   `width`. Verified in-browser (open + all 3 close paths + scroll-lock +
   600px/stripe/title). Plus the real **`BeforeYouGoModal.astro`** (primary BACK
   TO TOWER ALERTS `<a href="/tower-alerts">` + Print; the hidden/unwired
   Download is omitted pending its rebuild) and **`AreYouSureModal.astro`**
   (secondary CANCEL + primary RECREATE w/ sparkle; custom "Don't show again"
   checkbox `#aysDontShow` — in-memory `skipAysModal` wiring belongs in the page
   script). Verified in-browser (byg 600px / ays 470px; variants + checkbox).
4. ✅ **TopNavAI / SubNavAI / SideNavAI — DONE (markup + visual states).**
   Named with an `AI` suffix — page-specific chrome for the AI Targeted Materials
   page, distinct from the generic reusable components (Icon/Button/Modal). The
   eventual tower-alerts nav will be its own component.
   **`TopNavAI.astro`** simplified (logo + centered title + sparkle + BETA pill,
   yellow-20 border; full Curriculum/Reports variant deferred to tower-alerts),
   **`SubNavAI.astro`** (back-arrow link + centered "Targeted Materials for
   {studentName}"), **`SideNavAI.astro`** (Mini Lesson active + Student
   Materials/Sample Script with 24px sparkle Buttons + Problem Set Coming Soon;
   `nav-slider` parked under the active item by a placeholder positioner).
   Extended **`Button`** with an `xs` (24px) size + `swapIcon` (sparkle↔refresh,
   toggled by `.is-swapped`). Added `--card-dropshadow` to `base.css`. Verified
   in-browser. **Deferred to assembly:** the sidenav state machine (active/
   generated/current sync, real `updateNavSlider`, sparkle-click → generation,
   back-link → byg modal) and the loading skeleton.
5. ✅ **Assemble `create-resources` — DONE (Phase 1 + 2a–2d), all verified.**
   **Variant model RESOLVED (shuffle bag):** a pool of mini-lesson *sets* (5 in
   the end state, 4 now); each set = mini lesson + 1-of-N aligned student
   materials + 1-of-N aligned sample scripts. On arrival a random set shows; top
   RECREATE draws the **next** in a **unique random cycle** (no repeats until all
   shown, then reshuffle). Generating a material picks a random 1-of-N of the
   *current* set; recreating it **toggles** to the other (A1↔A2). Recreating the
   mini lesson **resets** generated materials to ungenerated. Set is **random,
   not** matched to the selection (selection = context only) → **query-param
   page**, no `lessonKey` matching. Loading at **3s** for testing (`LOADING_MS`
   → 9000 later). Data: `src/data/lessonSets.ts` (`MINI_LESSONS`; single-variant
   arrays today — 2-of-each + a 5th set drop in later as pure data).
   • **Phase 1 (done):** `src/pages/create-resources.astro` — static loaded state
     (chrome + plain-text disclaimer + sidenav + button-group + page-area showing
     the mini lesson + the two CTA cards). 12 webp previews copied to
     `public/previews/`. Added a `cta` size to `Button` (32px/16px CTA pill).
     Route `/create-resources` (clean, **not** obfuscated like the HTML files —
     confirm if you want obfuscation applied to Astro routes). Verified in-browser.
   • **Phase 2 (in progress) — `src/scripts/create-resources.ts`:**
     ✅ **2a done:** loading flow (skeleton + cycling message + 3-sparkle animation,
     `LOADING_MS`=3000) → `.loaded` → mini-lesson **shuffle bag** (unique cycle) +
     initial render + `formatNow()` timestamp + slider. Loading/loaded gating in
     `src/styles/create-resources.css` (global, page-imported, since it crosses
     components). SideNavAI got the skeleton; its placeholder slider script was
     removed (script's `updateNavSlider` owns it now). Verified in-browser.
     ✅ **2b done:** recreate — top RECREATE → ays modal → confirm → loading →
     draws the **next** mini lesson from the bag + **resets** dependent materials
     to ungenerated + new timestamp; "Don't show again" sets in-memory
     `skipAysModal`; back-link → byg modal (its primary `<a>` navigates to
     `/tower-alerts`). Added the `.recreating` gating; `wireModal` (modal.ts)
     drives both modals. Reset happens on *confirm* (not on RECREATE-click, so
     Cancel loses nothing — a small improvement over the prototype). Verified.
     ✅ **2c done:** on-demand generation — CTA / sidenav sparkle → in-place loader
     (`newMaterialLoading` moved into the section; mini lesson + button-group stay)
     → reveals the **aligned** student-materials / sample-script (random 1-of-N of
     the current set; recreate **toggles** A1↔A2 — degrades to the single variant
     today) + sidenav sync (sparkle↔refresh via `.is-swapped`, generated/current,
     slider). Sidenav nav scrolls + sets current view. Verified in-browser.
     (Scroll-position tracking of current-view is a deferred polish item.)
     ✅ **2d done:** print (`printCurrentMaterials` → hidden iframe of the visible
     webp previews in DOM order; both Print buttons wired via `aria-label="Print"`)
     + `?student=` → subnav title + document title. `.no-worksheet` intentionally
     not wired (unreachable — every set has materials).
   **→ `create-resources` is feature-complete.** Deferred polish: scroll-position
   tracking of the sidenav current-view indicator.
   **NEXT: port `tower-alerts`** — decided: **phased, straight 1:1 port, filters
   match the prototype** (no new functionality). Source: `tower-alerts-prototype-*.html`
   (1243 lines; **4 alerts** — Elijah Park / Porter Levy / Jesse Williamson / Paul
   Derrick — *not* the "10" design.md claims). Needs a NEW **full TopNav**
   (Curriculum/Reports tabs + Assignments/Roster/Resources/Help links + account
   chip + yellow-bar, scroll shadow), breadcrumb, page-header (help tooltip,
   selector pill, hero, print), filter sidebar (completed toggle, date dropdown,
   Students + Content collapsible lists), `AlertCard` (tower-circle icon, student
   row + report link, Create Targeted Materials link, alert count + bang, event
   timeline), load-more, and the **Create Targeted Materials modal** →
   `/create-resources?student=&lesson=&loc=`. Phasing: Phase 1 = static chrome +
   cards (data server-rendered from an `ALERTS` array); Phase 2 = filters + modal
   + nav. Then retire the old HTML + cleanup (item 6).
   **Progress:**
   • ✅ T1a — chrome scaffold (full TopNav + breadcrumb + page-header + selector
     pill + hero + columns skeleton) in `src/pages/tower-alerts.astro` (page chrome
     inline; icons via `<Icon>`; colors tokenized). Verified.
   • ✅ Typography fix (commit c3ca2d2): T1a had used `font: … inherit` shorthands —
     invalid CSS, silently dropped, so all type fell to default sizes. Now verbatim
     `font-weight`/`font-size`/`line-height`. **LESSON (memory
     `port-css-verbatim-visual-diff`):** port prototype CSS verbatim — no `font:`
     shorthand — and verify by side-by-side screenshot diff vs the prototype on
     `:8765`, NOT computed-value checks.
   • ✅ Prototype tweak (commit 50f70a6): Content "ALL" pill now matches Students
     (the first/twirl-less content row gets `padding: 0 8px`).
   • ✅ T1b — filter sidebar + right-column scaffold (commit a90edb2). `STUDENTS`
     (25) + `GRADES` (9) server-rendered; filter-box (toggle, Date/Struggles
     dropdowns), collapsible Students/Content panels with ALL pills + count/weight
     rules, sort-row, results count, empty `#alerts`, LOAD MORE. CSS verbatim with
     mapped tokens (`--line`→gray-30, `--line-2`→gray-55, `--aqua-pressed`→aqua-85).
     Verified by screenshot diff vs `:8765`.
   • ✅ T1c — alert cards (commit 26bbbee). 4 cards server-rendered from `ALERTS`:
     tower-circle, student row + report link, Create Targeted Materials link
     (link-sparkle + `/create-resources?student=&lesson=&loc=`), count + circle-bang,
     breadcrumb-meta, lesson link, desc, event timeline (icon-bang / green check).
     Verified by screenshot diff.
   • ✅ Phase 2 — interactivity + modal (commit 5a418a9, **Opus 4.8**). New
     `CreateTargetedMaterialsModal.astro` (fuchsia stripe, sparkle+BETA heading,
     objective card, Mini Lesson/Problem Set radios, CREATE, disclaimer — CSS 1:1
     with exact tokens; `#DDE0E3` kept literal). New `src/scripts/tower-alerts.ts`:
     panel collapse, Completed toggle, help tooltip, breadcrumb scroll-shadow, modal
     wiring (intercept links → populate student/mission-lesson/objective from
     `data-*` → CREATE navigates). Verified modal + interactions vs prototype;
     `astro build` clean. **`tower-alerts` is now fully ported.**

6. ✅ **Post-port cleanup — DONE.**
   - Token audit: `--fuchsia-spark` and `--help-bg` were already absent from the
     Astro codebase; `--fuchsia-5` and `--gray-55` are actively used and kept.
     Nothing to remove from `tokens.css`.
   - **Old HTML prototypes retired**: `tower-alerts-prototype-*.html` and
     `create-resources-95a534VKBScVGb3WUOvN.html` deleted after a final parity
     screenshot pass (Astro pages match the prototypes 1:1). The Python `prototype`
     server entry was removed from `.claude/launch.json` — only the `astro` server
     remains.
   - **`CLAUDE.md` rewritten** for the Astro architecture: updated "What this
     project is", file map, local preview, design tokens table (brand-system names),
     patterns (Icon.astro, Modal.astro/wireModal, CSS gating, deferred scripts),
     JS architecture (shuffle bag, `state` object, key functions), known quirks
     (Astro-specific), asset conventions (`src/icons/`, `public/previews/`), and
     route naming. Removed HTML filename obfuscation section. Updated "no external
     deps" bullet (Astro/TS stack is now present).
   - **`astro-migration-plan.md`** marked COMPLETE at top; "In progress" section
     updated to reflect both pages ported and HTML prototypes retired.
   **Doc nits (low-priority, reconcile when convenient):** design.md says button
   labels are 16px but the prototype's RECREATE is 14px; design.md says the modal
   top stripe is aqua-75 but the prototype uses aqua-40 (#1CC7E6).

## Current repo state (as of 2026-06-18 end of session)
- **Astro is the only implementation.** Two live pages: `/tower-alerts` and
  `/create-resources`. No more HTML prototype files. Server: `npm run dev` (4321).
- **`main` is fully up to date.** The `astro-migration` branch was fast-forward
  merged directly into `main` (no PR). All migration + visual-regression fixes are
  on `main`. `npm run build` is green.
- **Visual regression fixes applied to `tower-alerts` (commit `324565c`):**
  card borders/colors (`var(--purple)` → `var(--purple-90)`), link underlines
  (hover-only, 4px), card gap (removed double margin), content list (342px,
  all 9 grades visible), new `sparkles-link.svg` icon, event rows (24px, no
  inter-row margin), separator (8px bottom margin).

---

## Next task: CSS consolidation (branch `css-consolidation`)

### Goal
Merge all CSS (except `tokens.css`) into a single `src/styles/styles.css`.
`tokens.css` stays **untouched and separate** — it's the hex source of truth.

### What gets merged into `styles.css`
| Source | Status |
|---|---|
| `src/styles/base.css` | Move entirely into `styles.css` |
| `src/styles/create-resources.css` | Move entirely into `styles.css` |
| `<style>` block inside `src/pages/tower-alerts.astro` | Extract + move |
| `<style>` block inside `src/pages/create-resources.astro` | Extract + move |

After consolidation: delete `base.css` and `create-resources.css`. Remove both
`<style>` blocks from the `.astro` pages.

### Organization inside `styles.css`
```
/* ===== SHARED (used by both pages) ===== */
/* … rules common to both pages … */

/* ===== TOWER ALERTS ===== */
/* … tower-alerts-specific rules … */

/* ===== CREATE RESOURCES ===== */
/* … create-resources-specific rules … */
```

Audit all four sources for **duplicate or near-identical rules** — merge them
into one shared rule and update class references in the `.astro` files if you
rename anything.

### Wiring
- `BaseLayout.astro` currently imports `base.css`. After consolidation, change
  that import to `styles.css` (so both pages pick it up automatically).
- Remove the per-page CSS import (`import "../styles/create-resources.css"`)
  from `create-resources.astro`.
- No new imports needed in `tower-alerts.astro` — it inherits from `BaseLayout`.

### Critical gotcha: Astro style scoping
Astro **auto-scopes** `<style>` blocks by adding a `data-astro-cid-*` hash
attribute to every selector. Once those styles move to a global external file
they are **no longer scoped** — they apply to both pages. Before combining rules,
audit for class name collisions between the two pages (e.g. `.sep`, `.event`,
`.alert` exist in tower-alerts; check whether create-resources uses the same
names for different things). Prefix or rename any colliding classes.

### Working notes
- Branch off `main` as `css-consolidation` before starting.
- Commit once: after the full consolidation is verified (both pages screenshot-
  diffed against their current state — no visual regressions).
- **Recommended model + effort: Sonnet 4.6, normal effort.** This is methodical
  reading + reorganization, not deep reasoning.
- Announce any class renames so Angy can follow along.
