# pomnia-landing

Static site for [pomnia.ai](https://pomnia.ai). No build step — plain HTML.

- `index.html` — marketing page
- `privacy.html` — site privacy + product encryption honesty
- `docs/index.html` — Start here (PL|EN)
- `docs/capabilities.html` — what Pomnia can / cannot do (PL|EN)
- `docs/where-is-my-data.html` — premiere 3-box mental model (folder / index / app)
- `docs/how-memory-works.html` — distill / chunk / embed / search deep-dive (PL|EN)
- `docs/automation.html` — what is automatic vs agent+MCP discipline (PL|EN)
- `docs/architecture.html` — Vault vs AppData paths, unlock/lock, pipelines (PL|EN)
- `docs/mcp.html` — Connect MCP quickstart (PL|EN)
- `docs/updates-install.html` — Windows install, SmartScreen, notify-only updates (PL|EN)
- `docs/troubleshooting.html` — Diagnostics + common premiere blockers (PL|EN)
- `docs/start-here.html` — redirect → `/docs/`
- `index-classic.html` — legacy URL; redirects to `/` with `noindex` (do not revive as the homepage).
- `sitemap.xml` / `robots.txt` / `llms.txt` — crawler + agent discovery aids.
- **Deploy:** Cloudflare Pages — connect `lobrzut/pomnia-landing`, production branch `main`,
  build command empty, output directory `/` (repo root). Custom domain `pomnia.ai` + `www`.

## Preview locally

```bash
# from this directory — any static server
npx --yes serve -l 5173
# then open http://localhost:5173/ and http://localhost:5173/docs/
```

## Download URL

Hero + nav + closing CTA point at:

`https://github.com/lobrzut/pomnia/releases/latest`

That always resolves to whatever GitHub marks as Latest.

Desktop, macOS, Linux GUI, and **Pomnia Mini** are on that same Latest release.
Mini ships as `PomniaMini-<version>.zip`. The filename on Latest must match the
package version (`PomniaMini-0.1.91.zip` on `v0.1.91`). Desktop buttons use the
`/releases/latest` redirect and do not embed a version, so Mini does the same:
link the Latest release page and name `PomniaMini-x.y.z.zip` in the copy.
Do not hardcode `/releases/latest/download/PomniaMini-0.1.91.zip` — that URL
goes stale on the next tag while `/releases/latest` does not.

The ship name (lobrzut/pomnia#4, `release:mini`) is `PomniaMini-<version>.zip`.
Unpack once and run `PomniaMini.exe`. Not the portable exe, and not
`PomniaMini-<version>-portable.zip` (that older zip unpacks into `%TEMP%` on
every launch). No embedded Brain: Mini connects to a remote brain-core.

## Ground rules for this page

- **No data collection.** No form, no analytics, no cookies. `privacy.html` invites
  the reader to verify this in the Network tab, so it has to stay true. If anything
  is ever added that makes a request, that page changes in the same commit.
- **No external requests.** The only outbound links are to GitHub and (from the
  privacy page) to UODO — links, not loads. No CDN, no web fonts.
  Docs language toggle uses `localStorage` only (no network).
- **Claims must match the product.** Memory layer (AGPL), not an agentic wrapper.
  Unsigned Windows + SmartScreen honesty stays in the hero and the download section.
  Vault blob encryption ≠ plaintext notes / search index — see Where is my data? + Privacy.
- `prefers-reduced-motion` disables the background animation entirely.

## Numbers on the page that have to track reality

- **`~136 MB`** under the download button — re-measure when the installer size moves.
- **Token costs in the Recall card** (~1000 to write a note, a few hundred to
  read one back). Re-measure if the note format changes.
