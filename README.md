# Zearn AI Targeted Materials — Prototype

Setup and workflow guide for contributors.

High-fidelity interactive prototype for the Zearn AI Targeted Materials flow, built
as an Astro static site and deployed to GitHub Pages.

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
