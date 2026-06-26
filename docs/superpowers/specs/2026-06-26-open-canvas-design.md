# Open Canvas — Design Spec

**Date:** 2026-06-26  
**Event:** Cursor Cafe (Saturday)  
**Operator constraint:** Phone only — changes via Cursor Cloud Agent

## Summary

Open Canvas is a collaborative living website for Cursor Cafe. Visitors scan a QR code, suggest ideas, and watch the site evolve in real time. The operator triages requests from a mobile `/studio` page and pastes them into Cursor Cloud Agent, which edits the repo and triggers a Vercel deploy.

## User-facing site (`/`)

Single-page experience with four zones:

1. **Header** — title, share link, QR code
2. **Canvas** — renders elements from `data/site-state.json`
3. **Floating CTA** — "Suggest something" opens request form
4. **Drawer** — Timeline (version history) and Wall of Names (contributors)

### Canvas element types (v1)

| Type    | Example request              |
|---------|------------------------------|
| `color` | "Make it purple"             |
| `text`  | "Add Hello Cursor Cafe"      |
| `emoji` | "Put a dancing cat"          |
| `shape` | "Add floating stars"         |

Complex requests are implemented by editing React components directly; the agent logs them in the timeline.

### Request flow (visitor)

1. Tap "Suggest something"
2. Enter name + idea
3. Confirmation message shown
4. When shipped, name appears on contributor wall

## Operator studio (`/studio`)

Mobile-friendly admin page:

- Pending requests queue (newest first)
- "Copy for Cursor" button with formatted prompt
- Current version number and deploy note

## Data model

### `data/site-state.json`

Source of truth for canvas, timeline, and contributors. Cloud Agent edits this file on each implementation.

```json
{
  "version": 1,
  "title": "Open Canvas",
  "tagline": "Scan. Suggest. Shape this site together.",
  "theme": { "background": "...", "accent": "..." },
  "elements": [],
  "timeline": [],
  "contributors": []
}
```

### `data/pending-requests.json`

Queue of visitor submissions. API appends on form submit (filesystem in dev, GitHub API in production).

## Tech stack

| Piece     | Choice                          |
|-----------|---------------------------------|
| Framework | Next.js 15 (App Router)         |
| Hosting   | Vercel (auto-deploy on push)    |
| Styling   | Tailwind CSS                    |
| State     | JSON files in repo              |
| Requests  | API route + GitHub Contents API |

## Cloud Agent workflow

1. Visitor submits request → appended to `pending-requests.json`
2. Operator opens `/studio` on phone → copies formatted prompt
3. Operator pastes into Cursor Cloud Agent
4. Agent updates `site-state.json`, removes request from pending, commits, pushes
5. Vercel redeploys (~30–60s); site shows new version

## Out of scope (v1)

- Authentication
- Voting on requests
- WebSockets / instant updates without deploy
- Sound effects

## Success criteria

- Deployable public URL with QR code
- Visitors can submit requests from phone
- Operator can triage from `/studio` without a laptop
- Timeline and contributor wall reflect each shipped change
- README documents cafe-day playbook
