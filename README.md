# Pomnia landing page

Static site for [pomnia.ai](https://pomnia.ai). No build step — plain HTML.

- `index.html` — the page
- `privacy.html` — privacy notice
- `index-classic.html` — the earlier waitlist/beta page, kept for reference.
  Not linked from anywhere; do not deploy it as `index.html`.
- **Deploy:** see [`docs/LANDING-DEPLOY.md`](../docs/LANDING-DEPLOY.md)

## Before publishing — must be filled in

`index.html` carries two placeholders that are deliberately invalid, so the page
cannot go live half-wired:

Download CTA in `index.html` is wired to `https://github.com/lobrzut/pomnia/releases/latest`.

The repository link is already wired to `github.com/lobrzut/pomnia`. The download
link is deliberately still a placeholder: there is no release yet, and a dead
Download button is worse than no page.

Publishing is on hold until the Windows build **and** the packaged server are both
ready. macOS is out of scope for now — the footer badge says `Windows` only, and
the closing section says macOS and the server are next. Update both when that
changes; a badge is a promise.

## Ground rules for this page

- **No data collection.** No form, no analytics, no cookies. `privacy.html` invites
  the reader to verify this in the Network tab, so it has to stay true. If anything
  is ever added that makes a request, that page changes in the same commit.
- **No external requests.** The only outbound links are to GitHub and (from the
  privacy page) to UODO — links, not loads. No CDN, no web fonts.
- **Claims must match the product.** Copy was audited against `src/core/adapters`:
  conversations come from Claude Code, Cursor and Antigravity; Claude Desktop yields
  only its JSONL agent sessions; VS Code / Windsurf / Continue are config snapshots
  and are *not* searchable memory. Snapshot restore is not implemented, and the page
  says so.
- `prefers-reduced-motion` disables the background animation entirely.

## Numbers on the page that have to track reality

Two claims go stale unless someone updates them:

- **`~135 MB`** under the download button. Measured on 0.1.36/0.1.37, which came
  in at 136.2 MiB after the second bundled Electron runtime (`pomnia-brain.exe`,
  added in 0.1.24) was replaced with `utilityProcess` - down from 213.3 MiB.
  A further drop to roughly 100-120 MB is possible if the OCR wasm/canvas
  duplication comes out of `asarUnpack`. Deliberately rounded down: an
  understated size is fine, an overstated one is a lie the reader can check with
  one click.
- **Token costs in the Recall card** (~1000 to write a note, a few hundred to
  read one back). Measured across 31 session notes and 18 checkpoints in the
  vault, averaging 3.4 KB and 1.7 KB. Re-measure if the note format changes.

Both are on the page precisely because they are checkable. That only works while
they are true.
