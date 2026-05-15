# Zearn AI Targeted Materials — design specifications

This document describes the design of the two prototype pages and shared
components. For agent conventions see `claude.md`; for current state see
`summary.md`.

---

## Product overview

A teacher views their **Tower Alerts** (students struggling on specific
lessons). From any alert card, the teacher clicks **Create Resources**, which opens a confirmation modal pre-populated with the student's name, mission/lesson, and learning objective. Confirming sends them to the **AI Targeted Materials** page, which shows a generated mini-lesson PDF and lets them request additional materials (worksheet, sample script) for that student.

The prototype demonstrates the end-to-end flow with placeholder PDFs and a
simulated 9-second "AI generation" delay.

---

## Pages

### 1. Tower Alerts (`tower-alerts-prototype-iBGSV5YMFky3cZJiZNEY.html`)

Source page. The teacher sees:

- **Top nav** with logo, top tabs (Curriculum / Reports), Assignments / Roster /   Resources / Help links, and the account chip.
- **Breadcrumb** Reports > Class Reports > Tower Alerts.
- **Tower Alerts page header** with a help-circle tooltip.
- **Filter sidebar** (left): completed toggle, date filter, students list,
  content list.
- **Alerts column** (right): a stack of alert cards, one per struggling student.
  Each card shows: tower icon, student name, breadcrumb (Grade | Mission | Topic),   lesson title, learning objective description, **Create Resources** link, alert count, and event timeline.

### 2. AI Targeted Materials (`create-resources-95a534VKBScVGb3WUOvN.html`)

Destination page. The teacher sees:

- **Simplified top nav** (no curriculum / reports tabs): logo, "ZEARN AI
  TARGETED MATERIALS" page title with sparkle + BETA pill, centered.
- **Sub-nav**: "Back to Tower Alerts" (left) + "Targeted Materials for {Student
  Name}" (centered).
- **AI disclaimer banner** (light yellow): "Reminder: AI can make mistakes…"
- **Side-by-side layout** (1024 wide):
  - **Sidenav** (216 wide): Mini Lesson (active state), Student Materials,
    Sample Script subnav items with sparkle buttons, Problem Set / Coming Soon.
  - **Main column** (792 wide):
    - **Button group bar**: "Generated April 6, 2026 - 3:52pm" timestamp +
      Recreate, download, print buttons.
    - **Page area** (792 × 840, scrollable): renders the lesson PDF via PDF.js
      as stacked canvases, followed by end-of-PDF CTAs (Student Materials,
      Sample Script).

---

## Design system

### Colors (CSS custom properties on `:root`)

| Token | Value | Use |
|---|---|---|
| `--yellow` | `#fad232` | Active nav tab background, yellow stripe under top nav, yellow underline below Lesson Objective |
| `--aqua` | `#007694` | Links, lesson titles, primary/secondary buttons + icons (across both pages) |
| `--aqua-pressed` | `#005c73` | `--aqua` darkened 22%; used for `:active` press state on secondary buttons |
| `--purple` | `#7029a5` | Alert card border, alert count, tower circle, BETA pill border/text |
| `--purple-bg` | `#faf1ff` | Active sidenav background, CTA card background |
| `--fuchsia` | `#f182ea` | Active sidenav left border (4px) |
| `--fuchsia-spark` | `#ea74e3` | Big sparkle icon fill |
| `--charcoal` | `#303b40` | Primary text |
| `--charcoal-2` | `#435259` | Breadcrumb text |
| `--gray-bg` | `#f6f6f6` | Page background |
| `--gray-10` | `#ebebeb` | Section header bands (PROBLEM / TEACHER GUIDANCE) |
| `--gray-15` | `#e1e1e1` | Subnav item bottom border, skeleton bars |
| `--gray-30` | `#c7c7c7` | Sub-nav bottom border, modal divider |
| `--gray-40` | `#b4b4b4` | "Coming Soon" disabled text, vertical bar indicator |
| `--gray-60` | `#8e8e8e` | Coming Soon label |
| `--gray-65` | `#838383` | "Generated …" timestamp |
| `--gray-75` | `#6e6e6e` | Problem Set label |
| `--green` | `#00875a` | Completed alert check icon |
| `--answer-red` | `#d2000f` | Red italic answer text in problems |
| `--card-dropshadow` | `1px 1px 3px 0 rgba(0,0,0,0.24)` | Shared drop shadow for all white cards |

### Typography

- Body / UI: **Source Sans Pro** — 400 Regular, 600 SemiBold, 700 Bold,
  400 Italic. Loaded from Google Fonts.
- Some legacy production pieces use Oxygen — match what's already in the
  production CSS if matching an existing component.

Standard sizes used in the AI Targeted Materials page:

- 32px Regular — Modal headers
- 24px SemiBold — Loading message, Lesson Objective label
- 22px Regular uppercase — Top nav title "ZEARN AI TARGETED MATERIALS",
  modal sub-headers ("BEFORE YOU GO", "ARE YOU SURE?")
- 20px SemiBold — Sub-nav title "Targeted Materials for {Student}"
- 20px Regular — Modal body messaging
- 18px SemiBold — CTA titles, "Mini Lesson" sidenav active label, "Materials"
- 16px Regular — Body text, CTA descriptions
- 16px SemiBold uppercase — Button labels (CREATE, RECREATE, etc.)
- 14px Regular — "Generated…" timestamp, PDF problem text

### Spacing & layout

- Content max-width: **1024px** centered horizontally
- Sticky header + sub-nav (z-index 100)
- Top nav inner: **992px** centered (logo + page title, sub-nav back + center title)
- Page area card: **792 × 840** with 8px vertical scrollbar styled thin
- Sidenav card: **214 wide**, auto height (sized to content), 16/12/8 padding
- Side-by-side gap: **16px**
- Section padding for CTAs / disclaimer: **36px horizontal** within content area

### Card drop shadow

All white cards use `var(--card-dropshadow)` = `1px 1px 3px 0 rgba(0,0,0,0.24)`.
Cards: `.sidenav`, `.button-group`, `.page-area`.

---

## Components

### Top nav (simplified "user flow" variant on create-resources)

64px tall, white background, 4px yellow bottom border, drop-shadow on scroll.
**992px inner container** holds logo (absolute left 0) and page title (centered).

### Sub-nav

48px tall, white background, gray-30 bottom border. **992px inner container**
holds "Back to Tower Alerts" (absolute left 0, with circular arrow icon) and
"Targeted Materials for {Student}" (centered, 20px SemiBold).

### Disclaimer banner

Light yellow background (`#fff5c3`), gray-30 border, 40px tall, 4px radius.
Single-line text "Reminder: AI can make mistakes! Review this content for
accuracy. We do not use student data with generative AI. **View Zearn's AI
data policy.**" Link in aqua SemiBold.

### Sidenav (Figma node 17730:1213)

214 wide white card, 16/12/8 padding, 4px radius, card-dropshadow. Vertical
stack:

- **Mini Lesson** (active): purple-bg background, 4px fuchsia left border,
  12px 16px padding, 18px SemiBold black label.
- **Subnav items** (Student Materials, Sample Script): outer pl-16, inner
  content with pl-16 py-12 + 1px gray-15 border-bottom. Label (16px Regular
  black) on left, **sparkle button** on far right (24px circle, 1px aqua
  border, white background, 12px aqua sparkle icon inside). Button is
  flush-right with the bottom-border stroke.
- **Problem Set / Coming Soon**: 12px 16px padding, "Problem Set" 16px
  SemiBold gray-75, "Coming Soon" 16px Regular gray-60.

### Button group bar

White card, 48px tall, drop-shadow, 792 wide. Contains:

- Left: "Generated {date}" 14px Regular gray-65, 20px from left edge.
- Right: 12px-gap cluster: **RECREATE** secondary button (pill, 32px tall,
  aqua border, "RECREATE" label, refresh icon to left) + Download
  icon button (32px circle, aqua border, arrow-down icon) + Print
  icon button (same style, printer icon).

### Page area / PDF stack

White card 792 × 840, drop-shadow, rounded-bottom 4px. Contains:

- A `<div class="pdf-stack">` holding 1+ canvases (one per PDF page) rendered
  via PDF.js at 792 wide.
- A `<div class="pdf-ctas">` at the bottom with the two CTAs (see below).

Both elements scroll together inside the 840px-tall card. **Thin floating
scrollbar** on the right (8px, semi-transparent, styled via `::-webkit-scrollbar`)
visually overlays the PDF's right margin.

### End-of-PDF CTAs (Figma node 17753:1199)

Two cards stacked vertically with 8px gap, 16px top / 24px bottom / 36px horizontal
padding on the container. Each card:

- Light purple-bg background, 1px purple/15 (`#f1d9fe`) border, 4px radius.
- 8px inner padding, flex row, items-center, justify-between.
- **Left content** (flex row, 8px gap): 56×56 white-bg circle with 1.167px purple/15
  border containing a 30×29 pink sparkle icon. Then a text block with the
  CTA title (18px SemiBold charcoal) and description (16px Regular charcoal).
- **Right**: 32px-tall pill button, white bg, 1px aqua border, 16px
  SemiBold aqua "CREATE" with 16px aqua sparkle icon to its left.

The CTAs only display when `.loaded` is on `<html>` and hide during `.recreating`.

---

## Interaction patterns

### Initial loading state (Figma node 17505:1810)

Shown for 9 seconds on first page load before the real content. Layout:

- **Sidenav skeleton**: 4 gray-15 pill bars (18px tall, 5px radius, 12/16
  margin) — replaces the real sidenav items.
- **Page area** (532px tall during loading; 840px when loaded): contains
  the loading message + sparkle illustration.
  - **Cycling message**: cycles through 3 sentences, 3 seconds each, fading
    in via clip-path wipe left-to-right over 2 seconds:
    1. "Zearn AI is creating materials for your student right now."
    2. "Remember that AI can make mistakes."
    3. "Please check your materials carefully for relevance and accuracy."
  - **Sparkle illustration**: 3 sparkles (one big, two small) at 130×163,
    rotated 6.19°. Each fades independently between `#FFEFFE` (lightest) and
    `#D65CD0` (darkest) on a 2.4s cycle with staggered offsets (0s / -0.8s
    / -1.6s).

After 9 seconds, the `loaded` class is added to `<html>` and the real sidenav,
button group, PDF, and end-of-PDF CTAs render in their place. PDF rendering
starts after the loading state ends.

### Recreate flow

1. User clicks the **RECREATE** button in the button group.
2. **"Are You Sure?" modal** opens (Figma node 17776:8320): aqua top stripe,
   "ARE YOU SURE?" header, message, "Don't show this again." checkbox,
   divider, Cancel + RECREATE buttons.
3. If user clicks RECREATE in the modal:
   - If checkbox is checked, set in-memory `skipAysModal` flag (resets on page
     reload — sessionStorage would persist, which we don't want).
   - Close modal, add `.recreating` class to `<html>`.
   - Existing PDF canvases cleared. Sidenav + button group stay visible. Page
     area shows loading message + sparkles (same animation as initial load).
   - After 9 seconds: remove `.recreating`, re-render the PDF.

### CTA-triggered generation flow

Click on "Create" CTA button (Student Materials or Sample Script) at the bottom
of the page area:

1. Trigger the same loading flow as Recreate: enter `.recreating` state, clear
   PDF canvases, show loading animation in page area (sidenav + button group
   stay visible).
2. After 9 seconds: render the appropriate generated PDF in the page area
   (Worksheet A.pdf or Sample Script A.pdf).
3. The `currentPdfUrl` updates so subsequent recreate clicks regenerate the
   most-recently-generated material.

### Back to Tower Alerts confirmation

Click "Back to Tower Alerts" in the sub-nav:

1. **"Before You Go" modal** opens (Figma node 17776:8319): aqua top stripe,
   "BEFORE YOU GO" header, message, divider, primary "BACK TO TOWER ALERTS"
   button (navigates) + download + print icon buttons.

### Tower Alerts → Create Resources modal handoff (Figma node 17491:1953)

Click "Create Resources" link on any alert card:

1. **"Create Targeted Materials" modal** opens. Populated with student name,
   mission/lesson extracted from the card data, and the learning objective
   description.
2. Two material options: Mini Lesson (selected by default, aqua) and Problem
   Set (disabled, "Coming Soon").
3. Click CREATE in modal: navigates to
   `create-resources-95a534VKBScVGb3WUOvN.html?student=…&lesson=…` with URL params.

---

## Figma references

All Figma work happens in:
- `Xfh8X70m1Tqe6n29cOYD6N` — "Generate-Teacher-Materials" (the AI Targeted
  Materials flow).
- `c2TQFoGQI7YHEqAczXNzpe` — "LOCAL-DO-NOT-USE-Generate-Teacher-Materials"
  (the original Create Resources page).

Key node IDs used so far:

| Node | What |
|---|---|
| 17491:1953 | Create Targeted Materials modal (on Tower Alerts) |
| 17505:1810 | Loading state for Create Resources |
| 17730:1213 | Sidenav (loaded state) |
| 17753:1199 | End-of-PDF CTAs (Student Materials / Sample Script) |
| 17776:8319 | Before You Go modal |
| 17776:8320 | Are You Sure modal (Recreate) |
| 21185:10600 | Original Create Resources page (legacy file) |

When fetching the design context, pass `disableCodeConnect: true` to skip the
Code Connect prompt (the files aren't connected).
