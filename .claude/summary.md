# Project summary & handoff

For agent conventions see `claude.md`. For design specs see `design.md`.

---

## What we're building

Two interactive HTML prototypes for the Zearn AI Targeted Materials flow:

1. **Tower Alerts page** (`tower-alerts-prototype-iBGSV5YMFky3cZJiZNEY.html`) — teachers see a list
   of struggling students. Clicking "Create Resources" on a card opens a
   confirmation modal pre-populated with that student's context, then routes
   to the Create Resources page.

2. **Create Resources page** (`create-resources-95a534VKBScVGb3WUOvN.html`) — shows a generated
   mini-lesson PDF for that student, with controls to recreate, download,
   print, and generate additional materials (Worksheet, Sample Script). Has
   a simulated 9-second AI-generation loading state.

Both run locally via Python http.server on port 8765. Fully self-contained
HTML files with inlined base64 assets. No build step, no framework.

---

## Where things stand

### Done

- **Tower Alerts page** — pixel-perfect clone of the Figma, full content
  (header, breadcrumbs, filter sidebar, alert cards with timeline).
- **Create Resources modal** on Tower Alerts (Figma node 17491:1953):
  populated with student/mission/lesson/objective from the clicked alert
  card. Navigates to Create Resources page with query params on confirm.
- **Create Resources page** structurally complete:
  - Simplified top nav + sub-nav (992px inner container, full-width header
    bg).
  - Sidenav matching Figma node 17730:1213 (Mini Lesson active, Student
    Materials + Sample Script subnav items, Problem Set / Coming Soon).
  - Button group (Generated timestamp + Recreate/download/print).
  - PDF rendered via PDF.js as stacked canvases inside an 840px scrollable
    card. Multi-page PDF, DPR=2 for retina sharpness. Works correctly with
    `assets/pdf/Mini Lesson A.pdf`.
  - End-of-PDF CTAs (Figma node 17753:1199): Student Materials + Sample
    Script cards stacked below the PDF. Clicking either triggers the
    recreate flow with the corresponding PDF (Worksheet A.pdf or
    Sample Script A.pdf).
- **Loading state** (Figma node 17505:1810): 9-second skeleton + cycling
  message (3 sentences × 3s each, clip-path reveal animation) + animated
  sparkle illustration (3 sparkles fading independently between #FFEFFE
  and #D65CD0).
- **Recreate flow**:
  - Top RECREATE button opens "Are You Sure?" modal (Figma node 17776:8320).
  - Confirm → enters `.recreating` state (sidenav and button group stay
    visible, only page area shows loading) → re-renders PDF after 9s.
  - "Don't show this again" checkbox makes subsequent recreate clicks skip
    the modal — in-memory only, resets on any page reload.
- **Before You Go modal** (Figma node 17776:8319): opens when clicking
  "Back to Tower Alerts" in sub-nav.
- **Shared `wireModal(selector)` helper** in both files — new modals are
  ~3 lines of JS to wire up (just need markup with `.modal-close` inside).

### Git state

- Repo: `git@github.com:zearn/ai-generate-teacher-materials-prototype-mvp.git`
- Two commits pushed:
  1. Initial commit (cloned prototypes + assets)
  2. Unused-asset rename + PDF path update
- Local commits since the second push (modal wiring, loading state, CTAs,
  PDF.js work) **have not been pushed**. The user has the SSH key set up
  for their own terminal but Claude's environment cannot trigger Touch ID
  prompts.
- A fine-grained PAT was awaiting Zearn org admin approval the last time
  we checked — that's the alternative push path.

---

## Known issues / things to be careful about

1. **Claude Preview strips class attributes during page load.** Any class
   added to non-`<html>` elements before `DOMContentLoaded` gets wiped.
   Workaround: put loading-state classes on `<html>` via JS, or default to
   loading state in CSS and add a `.loaded` flag later via setTimeout.

2. **Inline `<script>` runs before later HTML is parsed.** Modal markup
   placed AFTER the script will not be queryable at script-eval time.
   Always wrap modal wiring in `DOMContentLoaded`.

3. **PDF.js drops content from oversize canvases.** Was losing the rainfall
   chart entirely when the PDF was one tall page rendered at DPR=3 (canvas
   was 2376×7329). Fix: keep PDF pages standard letter-size; use multi-page
   PDFs; DPR=2 is safe for retina.

4. **SVG inlining gotcha.** Figma exports use `width="100%" height="100%"`
   and `preserveAspectRatio="none"`. Must replace with explicit
   width/height and `xMidYMid meet` before base64-inlining, or `<img>`
   renders at 0×0.

---

## Suggested next steps

In priority order, based on what's likely next given the current state:

1. **Push the recent commits to GitHub.** Either the user pushes manually
   (their Terminal has SSH agent), or the Zearn PAT gets approved and we
   switch back to HTTPS.

2. **Wire up navigation between sidenav items.** Currently the sidenav
   "Student Materials" and "Sample Script" subnav items are non-interactive
   labels. They could be wired to switch the active item AND trigger the
   same loading + PDF swap as the CTAs.

3. **Active state for sidenav after generating.** When user clicks the
   "Student Materials" CTA and Worksheet A renders, the sidenav's "Mini
   Lesson" should probably stop being the active item (or there's some
   visual indication that Student Materials is now generated). Confirm
   with the designer.

4. **Wire the Sample Script sidenav button.** Currently the sparkle
   button next to Sample Script in the sidenav does nothing.

5. **Real download / print on the Recreate button group.** Currently the
   download button is a no-op and print just calls `window.print()`.

6. **Hosting / sharing the prototype.** The user explored Vercel,
   Cloudflare Pages + Access, GitHub Pages, etc. last session and asked
   their engineers for a recommendation. No decision yet. If they confirm
   a path, set it up.

7. **More mini lesson PDF variants?** The user uploaded `Mini Lesson A.pdf`,
   `Mini Lesson B.pdf`, `Mini Lesson C.pdf` — only A is currently used.
   B and C might be for showing different generations after clicking
   Recreate (i.e., each recreate could cycle through them).

---

## Tips for the next chat session

- **Don't rebuild the modal pattern from scratch.** Use the existing
  `wireModal()` helper. Markup with `.modal-close` inside, then 2 lines of
  JS. See either HTML file for examples.

- **Start by reading `claude.md` and `design.md`.** They contain the design
  tokens, file map, and the recurring gotchas that consumed time in this
  session (Preview class stripping, DOM ordering, PDF.js canvas limits).

- **Ask Angy 3–5 clarifying questions** before building any new page or
  feature. Cover scope, data flow, navigation, and interactivity. She
  explicitly prefers this.

- **Verify with `preview_inspect`, not just `preview_screenshot`.** Screenshots
  miss small computed-style issues; `preview_inspect` confirms exact values.

- **When debugging "JS isn't running" symptoms**, check whether elements exist
  yet (`document.getElementById` will return null if the markup hasn't been
  parsed). DOMContentLoaded fixes 90% of these.

- **The PDFs in `assets/pdf/`** are subject to change as Angy iterates on
  the lesson content. The runtime path is configurable via `renderPdf(url)`
  — don't hardcode paths to a specific filename outside that function.
