# Zearn AI Targeted Materials — design specifications

This document describes the design of the two prototype pages and shared
components. For agent conventions see `.claude/claude.md`; for current state see
`.claude/summary.md`.

---

## Product overview

A teacher views their **Tower Alerts** (students struggling on specific
lessons). From any alert card, the teacher clicks **Create Resources**, which opens a confirmation modal pre-populated with the student's name, mission/lesson, and learning objective. Confirming sends them to the **AI Targeted Materials** page, which shows a generated mini-lesson preview and lets them request additional materials (worksheet, sample script) for that student.

The prototype demonstrates the end-to-end flow with placeholder webp preview
images and a simulated 9-second "AI generation" delay.

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
- **AI disclaimer banner** (yellow-5): "Reminder: AI can make mistakes…"
- **Side-by-side layout** (1024 wide):
  - **Sidenav** (216 wide): Mini Lesson (active state), Student Materials,
    Sample Script subnav items with sparkle buttons, Problem Set / Coming Soon.
  - **Main column** (792 wide):
    - **Button group bar**: "Generated April 6, 2026 - 3:52pm" timestamp +
      Recreate, download, print buttons.
    - **Page area** (792 × 840, scrollable): renders the generated material as
      a webp preview image, followed by end-of-page CTAs (Student Materials,
      Sample Script).

---

## Design system

### Color usage

Each row maps a **brand token** (from the `## Brand Colors` palette at the
bottom of this doc — the source of truth for hex values) to where it's used in
the prototype UI. Only UI chrome is listed — colors that live inside the generated material previews (the webp images) are not documented here.

| Token | Use for |
|---|---|
| `yellow-20` | active nav tab background, yellow stripe under top nav, yellow underline below Lesson Objective |
| `aqua-75` | links + icons, primary button background, secondary button border, secondary button background on hover |
| `aqua-85` | link + icons on hover; primary button background on hover, secondary button background on press |
| `aqua-95` | link + icons on press; primary button background on press |
| `purple-90` | alert card border, alert count, tower circle, BETA pill border/text |
| `purple-5` | active sidenav background, CTA card background |
| `fuchsia-45` | active sidenav left border (4px) and active-item accent fill |
| `charcoal-95` | primary text |
| `charcoal-90` | breadcrumb text |
| `gray-5` | page background |
| `gray-15` | subnav item bottom border, skeleton bars |
| `gray-30` | borders & dividers (breadcrumb shadow, card borders, sub-nav rules, sub-nav bottom border, modal divider) |
| `gray-40` | disabled "Coming Soon" modal option (Create Resources modal) |
| `gray-55` | input / control borders (filter controls) |
| `gray-60` | "Coming Soon" label |
| `gray-65` | "Generated …" timestamp |
| `gray-75` | "Problem Set" (Coming Soon) sidenav label |
| `gray-90` | footer text, links, and divider (Tower Alerts) |
| `green-80` | completed alert check icon |
| `white` | card backgrounds, button fills, icon knockouts |

### Typography

- Body / UI: **Source Sans Pro** — 400 Regular, 600 SemiBold, 700 Bold,
  400 Italic. Loaded from Google Fonts.
- Use Oxygen only for the text in the footer.

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

64px tall, white background, 4px yellow-20 bottom border, drop-shadow on scroll.
**992px inner container** holds logo (absolute left 0) and page title (centered).

### Sub-nav

48px tall, white background, gray-30 bottom border. **992px inner container**
holds "Back to Tower Alerts" (absolute left 0, with circular arrow icon) and
"Targeted Materials for {Student}" (centered, 20px SemiBold).

### Disclaimer banner

yellow-5 background, gray-30 border, 40px tall, 4px radius.
Single-line text "Reminder: AI can make mistakes! Review this content for
accuracy. We do not use student data with generative AI. **View Zearn's AI
data policy.**" Link in aqua-75 SemiBold.

### Sidenav (Figma node 17730:1213)

214 wide white card, 16/12/8 padding, 4px radius, card-dropshadow. Vertical
stack:

- **Mini Lesson** (active): purple-5 background, 4px fuchsia-45 left border,
  12px 16px padding, 18px SemiBold black label.
- **Subnav items** (Student Materials, Sample Script): outer pl-16, inner
  content with pl-16 py-12 + 1px gray-15 border-bottom. Label (16px Regular
  black) on left, **sparkle button** on far right (24px circle, 1px aqua-75
  border, white background, 12px aqua-75 sparkle icon inside). Button is
  flush-right with the bottom-border stroke.
- **Problem Set / Coming Soon**: 12px 16px padding, "Problem Set" 16px
  SemiBold gray-75, "Coming Soon" 16px Regular gray-60.

### Button group bar

White card, 48px tall, drop-shadow, 792 wide. Contains:

- Left: "Generated {date}" 14px Regular gray-65, 20px from left edge.
- Right: 12px-gap cluster: **RECREATE** secondary button (pill, 32px tall,
  aqua-75 border, "RECREATE" label, refresh icon to left) + Download
  icon button (32px circle, aqua-75 border, arrow-down icon) + Print
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

- purple-5 background, 1px purple-15 border, 4px radius.
- 8px inner padding, flex row, items-center, justify-between.
- **Left content** (flex row, 8px gap): 56×56 white circle with 1.167px purple-15
  border containing a 30×29 fuchsia-45 sparkle icon. Then a text block with the
  CTA title (18px SemiBold charcoal-95) and description (16px Regular charcoal-95).
- **Right**: 32px-tall pill button, white, 1px aqua-75 border, 16px
  SemiBold aqua-75 "CREATE" with 16px aqua-75 sparkle icon to its left.

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
    rotated 6.19°. Each fades independently between fuchsia-5 (lightest) and
    fuchsia-60 (darkest) on a 2.4s cycle with staggered offsets (0s / -0.8s
    / -1.6s).

After 9 seconds, the `loaded` class is added to `<html>` and the real sidenav,
button group, PDF, and end-of-PDF CTAs render in their place. PDF rendering
starts after the loading state ends.

### Recreate flow

1. User clicks the **RECREATE** button in the button group.
2. **"Are You Sure?" modal** opens (Figma node 17776:8320): aqua-75 top stripe,
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

1. **"Before You Go" modal** opens (Figma node 17776:8319): aqua-75 top stripe,
   "BEFORE YOU GO" header, message, divider, primary "BACK TO TOWER ALERTS"
   button (navigates) + download + print icon buttons.

### Tower Alerts → Create Resources modal handoff (Figma node 17491:1953)

Click "Create Resources" link on any alert card:

1. **"Create Targeted Materials" modal** opens. Populated with student name,
   mission/lesson extracted from the card data, and the learning objective
   description.
2. Two material options:
   - **Mini Lesson** — selected by default: aqua-10 background, 3px aqua-60 border,
     checked checkbox (the checkmark is nudged 2px lower so it reads centered against
     the label). It is **toggleable** — click the row to uncheck it:
     - **Unchecked:** the row drops to a plain white row with a 1px gray-40 border
       (matching the disabled-CREATE color below), the checkmark swaps to the small
       empty checkbox (same box used on Problem Set), and **CREATE becomes disabled**
       (gray-40 fill, no hover, `cursor: not-allowed`).
     - **Re-checking** restores the selected state and re-enables CREATE. The modal
       always **reopens with Mini Lesson checked** regardless of the prior toggle.
   - **Problem Set** — disabled, "Coming Soon" (empty checkbox, gray-40 label).

   The BETA badge text is nudged up 0.5px (top/bottom padding rebalanced; box height
   unchanged).
3. Click CREATE (enabled only while Mini Lesson is checked): navigates to
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

---

## Brand Colors

**Hex values are defined here and nowhere else** — the brand tokens referenced in the
`### Colors` table above map to these. (The design system's one-row
`## Color Usage` example is realized, in full, by that `### Colors` table.)

### Gray
| Core | Hex |
|---|---|
| `gray-95` | `#3D3D3D` |
| `gray-90` | `#4A4A4A` |
| `gray-85` | `#575757` |
| `gray-80` | `#636363` |
| `gray-75` | `#6E6E6E` |
| `gray-70` | `#797979` |
| `gray-65` | `#838383` |
| `gray-60` | `#8E8E8E` |
| `gray-55` | `#989898` |
| `gray-50` | `#A2A2A2` |
| `gray-45` | `#ABABAB` |
| `gray-40` | `#B4B4B4` |
| `gray-35` | `#BEBEBE` |
| `gray-30` | `#C7C7C7` |
| `gray-25` | `#D0D0D0` |
| `gray-20` | `#D8D8D8` |
| `gray-15` | `#E1E1E1` |
| `gray-10` | `#EBEBEB` |
| `gray-5` | `#F6F6F6` |

### Charcoal
| Core | Hex |
|---|---|
| `charcoal-100` | `#1B2327` |
| `charcoal-95` | `#303B40` |
| `charcoal-90` | `#414C52` |
| `charcoal-85` | `#4D595F` |
| `charcoal-80` | `#59656B` |
| `charcoal-75` | `#647077` |
| `charcoal-70` | `#6F7B82` |
| `charcoal-65` | `#79868D` |
| `charcoal-60` | `#849097` |
| `charcoal-55` | `#8E9AA1` |
| `charcoal-50` | `#97A4AB` |
| `charcoal-45` | `#A1ADB4` |
| `charcoal-40` | `#AAB7BD` |
| `charcoal-35` | `#B4C0C7` |
| `charcoal-30` | `#BDC9D0` |
| `charcoal-25` | `#C6D2D9` |
| `charcoal-20` | `#CFDAE1` |
| `charcoal-15` | `#D8E3EA` |
| `charcoal-10` | `#E1EBF1` |
| `charcoal-5` | `#F0F5F8` |

### Aqua
| Core | Hex |
|---|---|
| `aqua-95` | `#004155` |
| `aqua-90` | `#005068` |
| `aqua-85` | `#005D77` |
| `aqua-80` | `#006A86` |
| `aqua-75` | `#007694` |
| `aqua-70` | `#0082A2` |
| `aqua-65` | `#008EAF` |
| `aqua-60` | `#0099BB` |
| `aqua-55` | `#00A4C6` |
| `aqua-50` | `#00AFD1` |
| `aqua-45` | `#00BADB` |
| `aqua-40` | `#1CC7E6` |
| `aqua-35` | `#39CEEC` |
| `aqua-30` | `#56D6F1` |
| `aqua-25` | `#73DEF6` |
| `aqua-20` | `#8EE5F9` |
| `aqua-15` | `#A9ECFC` |
| `aqua-10` | `#D9F7FF` |
| `aqua-5` | `#ECFBFF` |

### Yellow
| Core | Hex |
|---|---|
| `yellow-95` | `#503900` |
| `yellow-90` | `#604600` |
| `yellow-85` | `#705100` |
| `yellow-80` | `#7F5D00` |
| `yellow-75` | `#8C6800` |
| `yellow-70` | `#997300` |
| `yellow-65` | `#A67D00` |
| `yellow-60` | `#B28700` |
| `yellow-55` | `#BD9100` |
| `yellow-50` | `#C89B00` |
| `yellow-45` | `#D2A500` |
| `yellow-40` | `#DCAF00` |
| `yellow-35` | `#E5B800` |
| `yellow-30` | `#EEC200` |
| `yellow-25` | `#F5CC21` |
| `yellow-20` | `#FAD232` |
| `yellow-15` | `#FFE060` |
| `yellow-10` | `#FFEA88` |
| `yellow-5` | `#FFF5C3` |

### Purple
| Core | Hex |
|---|---|
| `purple-105` | `#120525` |
| `purple-100` | `#2B124C` |
| `purple-95` | `#571684` |
| `purple-90` | `#7029A5` |
| `purple-85` | `#7830AD` |
| `purple-80` | `#853EBC` |
| `purple-75` | `#924CC6` |
| `purple-70` | `#9D59CF` |
| `purple-65` | `#A866D6` |
| `purple-60` | `#B273DC` |
| `purple-55` | `#BB7FE2` |
| `purple-50` | `#C48BE6` |
| `purple-45` | `#CB97EB` |
| `purple-40` | `#D3A2EF` |
| `purple-35` | `#DBADF4` |
| `purple-30` | `#E1B8F8` |
| `purple-25` | `#E7C3FB` |
| `purple-20` | `#ECCEFD` |
| `purple-15` | `#F1D9FE` |
| `purple-10` | `#F5E4FF` |
| `purple-5` | `#FAF1FF` |

### Green
| Core | Hex |
|---|---|
| `green-95` | `#004626` |
| `green-90` | `#00552F` |
| `green-85` | `#006338` |
| `green-80` | `#007041` |
| `green-75` | `#007D49` |
| `green-70` | `#008952` |
| `green-65` | `#00955A` |
| `green-60` | `#06A163` |
| `green-55` | `#1EAC6C` |
| `green-50` | `#30B675` |
| `green-45` | `#42C07F` |
| `green-40` | `#53C988` |
| `green-35` | `#64D292` |
| `green-30` | `#76DB9D` |
| `green-25` | `#87E3A8` |
| `green-20` | `#9AEAB4` |
| `green-15` | `#ABF1C0` |
| `green-10` | `#C1F7CC` |
| `green-5` | `#E5FFEC` |

### Raspberry
| Core | Hex |
|---|---|
| `raspberry-95` | `#74001D` |
| `raspberry-90` | `#8D002F` |
| `raspberry-85` | `#A4003F` |
| `raspberry-80` | `#B8164F` |
| `raspberry-75` | `#C72B5B` |
| `raspberry-70` | `#D63A66` |
| `raspberry-65` | `#E7426D` |
| `raspberry-60` | `#F84A73` |
| `raspberry-55` | `#FF5C81` |
| `raspberry-50` | `#FF7293` |
| `raspberry-45` | `#FF84A2` |
| `raspberry-40` | `#FF95AF` |
| `raspberry-35` | `#FFA3BC` |
| `raspberry-30` | `#FFB1C7` |
| `raspberry-25` | `#FFBED2` |
| `raspberry-20` | `#FFCBDB` |
| `raspberry-15` | `#FFD7E4` |
| `raspberry-10` | `#FFE2EC` |
| `raspberry-5` | `#FFF1F5` |

### Orange
| Core | Hex |
|---|---|
| `orange-95` | `#6C2200` |
| `orange-90` | `#812C00` |
| `orange-85` | `#973400` |
| `orange-80` | `#AA3C00` |
| `orange-75` | `#BD4301` |
| `orange-70` | `#D04B01` |
| `orange-65` | `#E05301` |
| `orange-60` | `#F15B01` |
| `orange-55` | `#FF6400` |
| `orange-50` | `#FF7A00` |
| `orange-45` | `#FF8D0B` |
| `orange-40` | `#FF9D43` |
| `orange-35` | `#FFAB62` |
| `orange-30` | `#FFB87B` |
| `orange-25` | `#FFC492` |
| `orange-20` | `#FFD0A7` |
| `orange-15` | `#FFD8BC` |
| `orange-10` | `#FFE5D0` |
| `orange-5` | `#FFF2E7` |

### Red
| Core | Hex |
|---|---|
| `red-95` | `#750000` |
| `red-90` | `#8E0000` |
| `red-85` | `#A60000` |
| `red-80` | `#BC0000` |
| `red-75` | `#D2000F` |
| `red-70` | `#E51B24` |
| `red-65` | `#E94449` |
| `red-60` | `#E76167` |
| `red-55` | `#E97379` |
| `red-50` | `#ED8286` |
| `red-45` | `#F09093` |
| `red-40` | `#F49D9F` |
| `red-35` | `#F6AAAB` |
| `red-30` | `#F8B6B7` |
| `red-25` | `#FAC2C2` |
| `red-20` | `#FCCDCD` |
| `red-15` | `#FDD9D9` |
| `red-10` | `#FEE4E4` |
| `red-5` | `#FFF1F1` |

### Blue
| Core | Hex |
|---|---|
| `blue-95` | `#063B74` |
| `blue-90` | `#0A498B` |
| `blue-85` | `#0D55A1` |
| `blue-80` | `#1061B5` |
| `blue-75` | `#136DC9` |
| `blue-70` | `#1078D9` |
| `blue-65` | `#0084E6` |
| `blue-60` | `#0093E5` |
| `blue-55` | `#329DEC` |
| `blue-50` | `#57A6F1` |
| `blue-45` | `#71AFF6` |
| `blue-40` | `#89B7F9` |
| `blue-35` | `#9DBFFB` |
| `blue-30` | `#AFC7FD` |
| `blue-25` | `#BECFFE` |
| `blue-20` | `#CCD8FF` |
| `blue-15` | `#D8E0FF` |
| `blue-10` | `#E4E9FF` |
| `blue-5` | `#F1F4FF` |

### Pink
| Core | Hex |
|---|---|
| `pink-95` | `#6D1743` |
| `pink-90` | `#831F51` |
| `pink-85` | `#98275F` |
| `pink-80` | `#AB2F6C` |
| `pink-75` | `#BD3878` |
| `pink-70` | `#CD4185` |
| `pink-65` | `#DC4A90` |
| `pink-60` | `#EA559B` |
| `pink-55` | `#F660A5` |
| `pink-50` | `#FF6DAF` |
| `pink-45` | `#FF80BC` |
| `pink-40` | `#FF91C6` |
| `pink-35` | `#FFA1CF` |
| `pink-30` | `#FFAFD7` |
| `pink-25` | `#FFBDDE` |
| `pink-20` | `#FFCAE4` |
| `pink-15` | `#FFD6EA` |
| `pink-10` | `#FFE2F0` |
| `pink-5` | `#FFF1F7` |

### Fuchsia
| Core | Hex |
|---|---|
| `fuchsia-95` | `#631C61` |
| `fuchsia-90` | `#782475` |
| `fuchsia-85` | `#8A2C86` |
| `fuchsia-80` | `#9C3598` |
| `fuchsia-75` | `#AC3EA8` |
| `fuchsia-70` | `#BB47B6` |
| `fuchsia-65` | `#CA51C4` |
| `fuchsia-60` | `#D65CD0` |
| `fuchsia-55` | `#E067DA` |
| `fuchsia-50` | `#EA74E3` |
| `fuchsia-45` | `#F182EA` |
| `fuchsia-40` | `#F78FF0` |
| `fuchsia-35` | `#FC9CF5` |
| `fuchsia-30` | `#FFAAF8` |
| `fuchsia-25` | `#FFB9FB` |
| `fuchsia-20` | `#FFC7FC` |
| `fuchsia-15` | `#FFD4FD` |
| `fuchsia-10` | `#FFE0FD` |
| `fuchsia-5` | `#FFEFFE` |

### Lime
| Core | Hex |
|---|---|
| `lime-95` | `#004600` |
| `lime-90` | `#005600` |
| `lime-85` | `#006400` |
| `lime-80` | `#007200` |
| `lime-75` | `#007F00` |
| `lime-70` | `#008B0B` |
| `lime-65` | `#009720` |
| `lime-60` | `#16A32F` |
| `lime-55` | `#2DAD36` |
| `lime-50` | `#4AB72E` |
| `lime-45` | `#60C023` |
| `lime-40` | `#75C913` |
| `lime-35` | `#88D13E` |
| `lime-30` | `#99D862` |
| `lime-25` | `#AADF7F` |
| `lime-20` | `#B9E697` |
| `lime-15` | `#C9ECB0` |
| `lime-10` | `#D9F1C7` |
| `lime-5` | `#ECF8E3` |

### Olive
| Core | Hex |
|---|---|
| `olive-95` | `#3B4000` |
| `olive-90` | `#484E00` |
| `olive-85` | `#545B00` |
| `olive-80` | `#606800` |
| `olive-75` | `#6A7400` |
| `olive-70` | `#767F00` |
| `olive-65` | `#808A00` |
| `olive-60` | `#8A9505` |
| `olive-55` | `#949F21` |
| `olive-50` | `#9EA936` |
| `olive-45` | `#A7B249` |
| `olive-40` | `#B1BC5C` |
| `olive-35` | `#BAC46F` |
| `olive-30` | `#C3CD83` |
| `olive-25` | `#CCD596` |
| `olive-20` | `#D5DDAA` |
| `olive-15` | `#DFE5BE` |
| `olive-10` | `#E8ECD1` |
| `olive-5` | `#F3F5E8` |

### Brown
| Core | Hex |
|---|---|
| `brown-95` | `#5F3004` |
| `brown-90` | `#6D3E15` |
| `brown-85` | `#784D25` |
| `brown-80` | `#825A34` |
| `brown-75` | `#8B6743` |
| `brown-70` | `#937351` |
| `brown-65` | `#9B7F60` |
| `brown-60` | `#A28A6D` |
| `brown-55` | `#A9957B` |
| `brown-50` | `#B19F87` |
| `brown-45` | `#B8A994` |
| `brown-40` | `#C0B3A0` |
| `brown-35` | `#C8BCAB` |
| `brown-30` | `#D0C6B7` |
| `brown-25` | `#D7CFC3` |
| `brown-20` | `#DFD8CD` |
| `brown-15` | `#E6E0D8` |
| `brown-10` | `#EDE9E4` |
| `brown-5` | `#F6F4F1` |

### White
| Core | Hex |
|---|---|
| `white` | `#FFFFFF` |

### Black
| Core | Hex |
|---|---|
| `black` | `#000000` |
