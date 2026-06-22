# Zearn AI Targeted Materials — Prototype

Setup and workflow guide for contributors.

High-fidelity interactive prototype for the Zearn AI Targeted Materials flow, built
as an Astro static site and deployed to GitHub Pages.

---

## About this project: migrated from plain HTML to Astro

This prototype started life as a set of hand-written HTML files. It was migrated to
**[Astro](https://astro.build)** — a framework for building websites — while still
producing the exact same thing at the end: a plain **static site** (just HTML, CSS,
and a little JavaScript) with no server or database behind it. Same hosting, same
behavior in the browser; what changed is *how the source is organized*.

### Why we migrated — what it buys us

- **No more copy-paste duplication.** Shared pieces — the top nav, sidenav, buttons,
  icons, modals — are written **once** as reusable components and dropped into each
  page. In the old HTML, the same nav markup was pasted into every file; fixing one
  thing meant editing it everywhere (and missing a copy).
- **One place for styling.** All colors live as named design tokens in one file
  (`src/styles/tokens.css`), and the rest of the CSS in one stylesheet — instead of
  scattered inline styles. Change a brand color in one spot, it updates everywhere.
- **Icons and fonts handled automatically.** SVG icons are pulled in by name; fonts
  and image paths are wired up correctly for the live site at build time, so we don't
  hand-manage file paths.
- **Safer changes.** A build step catches certain mistakes before they ship, and
  every change goes through a preview + PR review.

The trade-off: there's now a **build step** and a **dev server**, so you can't just
double-click an HTML file to view it. That's what the setup steps below handle.

### How working in Astro differs from editing plain HTML

| Plain HTML | This project (Astro) |
|---|---|
| Open the `.html` file in a browser | Run a **dev server** (`start servers`), view at `localhost:4321/...` — it auto-refreshes as you edit |
| One big `.html` file per page | Pages live in `src/pages/`; shared UI is **components** in `src/components/` (`.astro` files) |
| Edit nav/buttons in every file | Edit the **one** component — every page updates |
| Inline `style="..."` and hex colors | CSS lives in `src/styles/`; colors are **tokens** (`var(--purple-90)`), no inline styles |
| Just save the file | A **build** turns the source into the static site (runs automatically on deploy) |

You don't need to be an Astro expert to make changes here — Claude handles the
framework details. The main day-to-day difference is: **start the dev server to
preview**, and know that a visual element you want to change might live in a shared
component rather than the page itself.

---

## One-time setup

1. **Install [Node.js](https://nodejs.org) 22 or higher.** The build requires Node 22+ — older versions will fail.

2. **Clone the repo:**
   ```
   git clone git@github.com:zearn/ai-generate-teacher-materials-prototype-mvp.git
   ```

3. **Install dependencies** (inside the project folder):
   ```
   npm install
   ```
   Only needed once, or after someone updates `package.json`.

4. **Install and authenticate the GitHub CLI** — needed so Claude can open and
   merge PRs as you (used by the `ship it` shortcut below):
   ```
   brew install gh      # macOS (Homebrew); see cli.github.com for others
   gh auth login
   ```
   **Write** access to the repo is enough — you don't need Maintain or Admin.
   The PR pipeline runs as *you*, with your own GitHub credentials.

---

## Start of session

1. **Pull the latest changes from GitHub:**
   ```
   git pull
   ```

2. **Tell Claude:** `start servers`

3. **Open the local preview in your browser.** The index page links to both screens:

   ```
   localhost:4321/ai-generate-teacher-materials-prototype-mvp/
   ```

   The two pages live at obfuscated paths (the prototype is private-by-obfuscation,
   so the URLs aren't guessable):

   | Page | Local URL |
   |---|---|
   | Tower Alerts | `localhost:4321/ai-generate-teacher-materials-prototype-mvp/tower-alerts-iBGSV5YMFky3cZJiZNEY` |
   | AI Targeted Materials | `localhost:4321/ai-generate-teacher-materials-prototype-mvp/create-resources-95a534VKBScVGb3WUOvN` |

---

## Creating and merging a PR

### Shortcut: `ship it`

When your changes are ready, just tell Claude: **`ship it`**

That one phrase runs the whole pipeline: branch + commit → open a PR →
review the diff and fix anything it finds → squash-merge to `main` → pull so your
local copy matches GitHub → delete the merged branch and tidy up. Saying `ship it`
is itself your authorization for that run's commit/push/merge.

Requirements: `gh` installed and authenticated (see One-time setup), and **Write**
access to the repo — that's all. Your PR will also get an automatic GitHub Copilot
review comment; it's informational and doesn't block the merge.

### Step by step (if you'd rather drive it manually)

1. **When you're done with changes, tell Claude:** `create a PR`
   Claude will commit your work to a branch, push it, and open a PR on GitHub.

2. **Optional — Review the PR on GitHub** by opening the link Claude gives you.
   GitHub Copilot can do an AI review if you want a second opinion.

3. **Tell Claude:** `review the PR and merge it if there are no issues`
   Claude will check for problems and squash-merge to `main`.

> **Note:** Apart from the `ship it` shortcut (which authorizes that single run),
> Claude will not commit, push, or merge unless you explicitly ask each time —
> there's no standing permission. If you want it to act, say so directly.

---

## Live site

The site redeploys automatically within ~2 minutes of any push to `main`. No manual
build step needed.

| Page | Live URL |
|---|---|
| Tower Alerts | `zearn.github.io/ai-generate-teacher-materials-prototype-mvp/tower-alerts-iBGSV5YMFky3cZJiZNEY` |
| AI Targeted Materials | `zearn.github.io/ai-generate-teacher-materials-prototype-mvp/create-resources-95a534VKBScVGb3WUOvN` |
