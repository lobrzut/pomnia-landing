# pomnia-landing

Static site for [pomnia.ai](https://pomnia.ai). No build step — plain HTML.

- `index.html` — marketing page
- `download.html` — which file to take (Desktop, Mini, server). No pinned version
- `changelog.html` — points at GitHub Releases; this site does not copy notes
- `privacy.html` — site privacy + product encryption honesty
- `docs/index.html` — Start here (PL|EN)
- `docs/changelog.html` — same release-notes pointer, inside the docs shell
- `docs/capabilities.html` — what Pomnia can / cannot do (PL|EN)
- `docs/where-is-my-data.html` — premiere 3-box mental model (folder / index / app)
- `docs/how-memory-works.html` — distill / chunk / embed / search deep-dive (PL|EN)
- `docs/automation.html` — what is automatic vs agent+MCP discipline (PL|EN)
- `docs/architecture.html` — Vault vs AppData paths, unlock/lock, pipelines (PL|EN)
- `docs/mcp.html` — Connect MCP quickstart (PL|EN)
- `docs/updates-install.html` — install, SmartScreen, Mini, notify-only updates (PL|EN)
- `docs/linux-self-hosted.html` — brain-core server vs Desktop GUI (PL|EN)
- `docs/sizing.html` — disk, memory, time (PL|EN)
- `docs/sync.html` — sync (PL|EN)
- `docs/upgrading.html` — upgrading (PL|EN)
- `docs/threat-model.html` — threat model (PL|EN)
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

Desktop buttons (Windows, macOS, Linux GUI) and the Windows Mini button point at:

`https://github.com/lobrzut/pomnia/releases/latest`

That always resolves to whatever GitHub marks as Latest. Do not embed a package
version in a `/releases/latest/download/<file>` URL when the filename contains
the version — the next tag 404s it.

**Pomnia Mini, Windows.** On that Latest page the file is `PomniaMini-<version>.zip`.
Unpack once and run `PomniaMini.exe`. Not the portable exe, and not
`PomniaMini-<version>-portable.zip`. A stable name `PomniaMini-win-x64.zip` is
planned in lobrzut/pomnia and is not on the current release, so this site does
not link it. No embedded Brain: Mini connects to a remote brain-core. Its
settings directory is `pomnia-mini`, separate from Desktop `pomnia`.

**Pomnia Mini, Linux.** From the next release the stable asset is
`PomniaMini-linux-x64.AppImage`:

`https://github.com/lobrzut/pomnia/releases/latest/download/PomniaMini-linux-x64.AppImage`

The current Latest tag does not contain that file, so the URL 404s until then.
There is no macOS Mini.

## install.sh

`install.sh` is the public curl|sh entry. From `set -eu` downward it matches
`packages/brain-core/deploy/bootstrap.sh` in lobrzut/pomnia at
`1cfae030036de4fcca4a5dd4b1380ec0b3da7e43`. Edit that file, then copy the body
here. The header comment is the only landing-specific text. The systemd unit
still runs `/usr/bin/node`; the product script checks `node` on `PATH` only.

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

- **Token costs in the Recall card** (~1000 to write a note, a few hundred to
  read one back). Re-measure if the note format changes.
