# Open Canvas

A living website for **Cursor Cafe** — visitors scan a QR code, suggest ideas, and watch the site evolve in real time. You triage requests from your phone and ship changes via Cursor Cloud Agent.

## Quick start

```bash
npm install
npm run dev
```

- **Live canvas:** http://localhost:3000
- **Your studio (phone bookmark):** http://localhost:3000/studio

## Deploy to Vercel

1. Push this repo to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Set environment variables:
   - `NEXT_PUBLIC_SITE_URL` — your production URL (e.g. `https://open-canvas.vercel.app`)
   - `GITHUB_TOKEN` — a fine-grained PAT with **Contents: Read and write** on this repo
   - `GITHUB_REPO` — `your-username/cursor-fun`
   - `ADMIN_TOKEN` — a secret of your choosing; required to use the canvas reset button
4. Deploy — every push auto-updates the site

> **Why GitHub token?** Vercel's serverless functions can't write to the filesystem. Visitor request submissions are committed to `data/pending-requests.json` via the GitHub API so your `/studio` page can see them.

## Cafe-day playbook

### Before you arrive

1. Deploy to Vercel and test the live URL on your phone
2. Bookmark `/studio` on your phone home screen
3. Put the QR code on a slide or printout (visible on the site via the QR button)
4. Open Cursor on your phone — you'll paste prompts from Studio

### The loop (repeat all afternoon)

1. **Visitor** scans QR → taps "Suggest something" → submits name + idea
2. **You** open `/studio` → see the new request → tap **Copy for Cursor**
3. **You** paste into Cursor Cloud Agent on your phone
4. **Agent** edits `data/site-state.json`, updates timeline + contributor wall, removes the request from pending, commits, pushes
5. **~60 seconds later** Vercel redeploys — everyone sees the change on the projector

### Tips for a great demo

- Start with the empty canvas — let the first visitor feel the magic
- Read requests aloud before implementing ("Sarah wants a dancing cat!")
- Point people to the Timeline to see the story unfold
- Encourage silly ideas — they're the best ones

## How the agent should implement requests

Each request maps to changes in `data/site-state.json`:

| Request type | What to change |
|---|---|
| Color / theme | Update `theme.background`, `theme.accent`, etc. |
| Add text | Push a new `text` element to `elements[]` |
| Add emoji | Push a new `emoji` element with animation |
| Add shapes | Push a new `shape` element |
| Complex / creative | Edit React components + log in timeline |

Always:
- Bump `version`
- Add a `timeline` entry (with `request` and `contributor`)
- Update `contributors[]`: find the matching name and push to their `prompts[]`, or add a new `{ name, contact, prompts: [...] }`
- Remove the request from `data/pending-requests.json`

## Safety & fairness

- **Prompt-injection guard** — visitor ideas are sanitized in `src/lib/sanitize.ts`. Known injection phrasings ("ignore previous instructions", fake system tags, etc.) are rejected before they ever reach the queue, and the agent prompt wraps untrusted text in an `<idea>` block.
- **5-minute cooldown** — each visitor can submit once every 5 minutes. Enforced client-side with a live countdown (`localStorage`) and best-effort server-side by IP (`src/lib/rate-limit.ts`).

## Admin: resetting the canvas

The **Danger zone** at the bottom of `/studio` clears the canvas back to the immaculate blank state (timeline history and contributors are preserved). It calls `POST /api/reset`, which:

- Requires the `x-admin-token` header to match `ADMIN_TOKEN` (when set)
- Writes the blank state to `data/site-state.json` (via GitHub API in production), bumps the version, and logs a "Canvas reset" timeline entry

On Vercel the live canvas updates after the reset commit redeploys (~60s). Your token is remembered in the browser so you only type it once.

## Project structure

```
data/
  site-state.json        ← canvas, timeline, contributors (agent edits this)
  pending-requests.json  ← visitor submissions queue
src/
  app/                   ← pages + API
  components/            ← canvas, timeline, forms
  lib/                   ← types, storage, agent prompts
docs/superpowers/specs/  ← design spec
```

## Built for Cursor Cafe

No laptop required. Just your phone, Cursor, and a crowd with ideas.
