# Zearn Teacher Prototype — project instructions

Read this at the start of every session. For full design specs see `design.md`.
For where work was last left, see `summary.md`.

---

## What this project is

High-fidelity interactive HTML prototypes for the **Zearn AI Targeted Materials**
flow. Two self-contained HTML files, each with inlined base64 assets, served
locally via a Python HTTP server on port 8765.

- `tower-alerts-prototype-iBGSV5YMFky3cZJiZNEY.html` — Reports → Tower Alerts page (10 student
  alert cards, filters, modal).
- `create-resources-95a534VKBScVGb3WUOvN.html` — AI Targeted Materials page (loads PDFs via PDF.js
  inside a scrollable card, with loading state, modals, recreate flow, and CTAs).

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
| `assets/` | SVG icons, sparkles, design references. SVGs base64-inlined into HTML. |
| `assets/pdf/` | Runtime PDFs loaded by PDF.js (Mini Lesson A.pdf, Worksheet A.pdf, Sample Script A.pdf, etc.) |
| `webpage complete/` | Production HTML save + 51 CSS files. Gold-standard reference for production tokens. Gitignored. |
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
--yellow:  #fad232    (active nav tab, yellow stripe)
--aqua:    #007694    (links, lessons, primary buttons; hover inverts to aqua fill + white text; --aqua-pressed #00647e for :active)
--purple:  #7029a5    (alert card border, alert count, tower-circle, exclamation)
--purple-bg: #faf1ff  (active sidenav background, Mini Lesson highlight)
--fuchsia: #f182ea    (active sidenav left border, sparkles accent)
--ink:     #303b40    (primary text)
--gray-bg: #f6f6f6    (page background, filter container backgrounds)
--gray-30: #c7c7c7    (sub-nav border, modal divider)
--gray-15: #e1e1e1    (subnav item bottom border)
--card-dropshadow: 1px 1px 3px 0 rgba(0,0,0,0.24)  (X1Y1B3 — all white cards)
```

Fonts: Source Sans Pro 400 / 600 / 700 for the app. Oxygen on a few rare
places (check production CSS in `webpage complete/_files/` if matching an
existing component).

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

### PDF rendering (PDF.js)

- Multi-page PDFs only. **Do not** use a single tall page (PDF.js silently
  drops content from canvases over a certain size — was losing the rainfall
  chart entirely).
- DPR cap at 2 for retina sharpness. With multi-page normal-sized PDFs,
  DPR=2 renders crisp text without dropping content.
- `renderPdf(pdfUrl)` accepts an optional URL; the `currentPdfUrl` variable
  tracks the most recently loaded PDF so recreate uses the right one.

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

- **`assets/*.svg`** — icon source files downloaded from Figma. These are NOT
  loaded at runtime by the HTML. Instead they get inlined into the HTML as
  **base64 data URIs** inside `<img src="data:image/svg+xml;base64,...">`.
  When you add a new icon: download the SVG, fix it (strip `width="100%"
  height="100%"`, replace `preserveAspectRatio="none"` with `xMidYMid meet`,
  add explicit width/height from the viewBox), base64-encode, paste inline.
- **`assets/pdf/*.pdf`** — run-time PDFs loaded by PDF.js via `getDocument()`.
  These ARE fetched at runtime, so the filename must match exactly (spaces and
  all). Loaded via the `renderPdf(pdfUrl)` function — don't hardcode paths
  elsewhere.
- **`assets/*.png`** — design references and screenshots used during
  development. Files suffixed with `-not-used` (e.g. `rainfall-chart-not-used.png`)
  are intentionally retained as historical references; do not delete or rely on them.
- **Anything in `webpage complete/`** — production HTML save from Zearn's site,
  used as a reference for exact production tokens. Gitignored. Don't modify.
- **Naming**: kebab-case for SVGs (`back-arrow.svg`, `modal-close-x.svg`),
  Title Case with spaces for PDFs (`Mini Lesson A.pdf`) since those are
  user-facing filenames that match what the user uploads.

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
- **No external dependencies** beyond what's already loaded (PDF.js from
  CDN, Google Fonts). Don't add npm packages, no build step, no bundler.

---

## Git

- Repo: `git@github.com:zearn/ai-generate-teacher-materials-prototype.git`
- Repo-local git identity: `AngyBrooksZ <angy@zearn.org>` (global is still
  `angyb` for personal projects — don't change global).
- Pushes use SSH. There was a pending HTTPS PAT awaiting Zearn org approval
  the last time we checked — may or may not be active now.
- See the "Git: never commit or push unless asked" section above for the
  rule on when to actually run git commands.
