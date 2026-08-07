# Pomnia landing page

Static site for [pomnia.ai](https://pomnia.ai). No build step — plain HTML.

- `index.html` — the page
- `privacy.html` — privacy notice
- `docs/index.html` — Start here (PL|EN)
- `docs/mcp.html` — Connect MCP quickstart (PL|EN)
- `index-classic.html` — the earlier waitlist/beta page, kept for reference.
  Not linked from anywhere; do not deploy it as `index.html`.
- **Deploy:** see [`docs/LANDING-DEPLOY.md`](../docs/LANDING-DEPLOY.md) in the product repo
  (Cloudflare Pages: output directory = this folder).

## Preview locally

```bash
# from this directory — any static server
npx --yes serve -l 5173
# then open http://localhost:5173/ and http://localhost:5173/docs/
```

## Download URL

Hero + nav + closing CTA point at:

`https://github.com/lobrzut/pomnia/releases/latest`

That always resolves to whatever GitHub marks as Latest (today still may lag local
`package.json` until Claude’s premiere publish lands).

## Ground rules for this page

- **No data collection.** No form, no analytics, no cookies. `privacy.html` invites
  the reader to verify this in the Network tab, so it has to stay true. If anything
  is ever added that makes a request, that page changes in the same commit.
- **No external requests.** The only outbound links are to GitHub and (from the
  privacy page) to UODO — links, not loads. No CDN, no web fonts.
  Docs language toggle uses `localStorage` only (no network).
- **Claims must match the product.** Memory layer (AGPL), not an agentic wrapper.
  Unsigned Windows + SmartScreen honesty stays in the hero and the download section.
- `prefers-reduced-motion` disables the background animation entirely.

## Numbers on the page that have to track reality

- **`~136 MB`** under the download button — re-measure when the installer size moves.
- **Token costs in the Recall card** (~1000 to write a note, a few hundred to
  read one back). Re-measure if the note format changes.
