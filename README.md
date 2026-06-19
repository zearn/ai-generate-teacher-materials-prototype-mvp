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

1. **When you're done with changes, tell Claude:** `create a PR`
   Claude will commit your work to a branch, push it, and open a PR on GitHub.

2. **Optional — Review the PR on GitHub** by opening the link Claude gives you.
   GitHub Copilot can do an AI review if you want a second opinion.

3. **Tell Claude:** `review the PR and merge it if there are no issues`
   Claude will check for problems and squash-merge to `main`.

> **Note:** Claude will not commit, push, or merge unless you explicitly ask each
> time — there's no standing permission. If you want it to act, say so directly.

---

## Live site

The site redeploys automatically within ~2 minutes of any push to `main`. No manual
build step needed.

| Page | Live URL |
|---|---|
| Tower Alerts | `zearn.github.io/ai-generate-teacher-materials-prototype-mvp/tower-alerts-iBGSV5YMFky3cZJiZNEY` |
| AI Targeted Materials | `zearn.github.io/ai-generate-teacher-materials-prototype-mvp/create-resources-95a534VKBScVGb3WUOvN` |
