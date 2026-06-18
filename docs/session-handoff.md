# Session handoff — 2026-06-17

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
   **NEXT: assemble `create-resources`** (compose chrome + disclaimer + main
   column + state machine), verify, then **tower-alerts**.
5. Decide variant routing (query param vs `getStaticPaths` per variant) — see
   the plan; recommended: query param for the first pass.
6. Remaining cleanup: drop unused tokens (`--fuchsia-spark`, `--fuchsia-5`,
   `--gray-55`, `--help-bg`); rewrite `claude.md` for the Astro architecture
   **after** the structure lands. **Doc nits (we matched the prototype on both,
   reconcile when convenient):** design.md says button labels are 16px but the
   prototype's RECREATE is 14px; design.md says the modal top stripe is aqua-75
   but the prototype uses aqua-40 (#1CC7E6).

## Working notes for the agent
- **Permissions:** read/grep/glob/inspect + `docs/**` and `src/**` edits are
  pre-approved. **`.claude/` files are gated as "sensitive" and will prompt**
  regardless of allow-rules — that's why the docs were moved to `docs/`.
  `claude.md`/`summary.md` must stay in `.claude/`.
- **Git:** never commit/push unless asked; never commit on the default branch
  (branch first). Repo identity is `AngyBrooksZ <angy@zearn.org>`.
- **Style:** clone the design 1:1; don't invent UI; announce `docs/` + `.claude/`
  doc edits; ask 3–5 clarifying questions before building something new.
- **Effort:** mechanical porting is fine at medium; reserve max for genuinely
  hard design/debug problems.
