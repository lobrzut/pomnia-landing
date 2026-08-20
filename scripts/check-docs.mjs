#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
/**
 * Audit the docs for drift between the Polish and English halves.
 *
 * Every page carries both languages inline, paired by `data-lang`. Nothing
 * checks that the two halves say the same thing, so an edit to one side lands
 * and the other quietly keeps the old claim — which is how "macOS installer —
 * not shipping yet" survived in Polish after the English was corrected.
 *
 * Facts survive translation and are therefore checkable without reading:
 * paths, ports, commands, filenames, URLs and numbers should appear on both
 * sides of a pair. Prose should not — this deliberately says nothing about
 * wording, only about the load-bearing tokens inside it.
 *
 *   node scripts/check-docs.mjs            # report
 *   node scripts/check-docs.mjs --strict   # exit 1 when anything mismatches
 */
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const strict = process.argv.includes('--strict')

const stripTags = (h) => h.replace(/<[^>]*>/g, ' ')
const decode = (t) =>
  t
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&rarr;/g, '→')

/** Tokens that must survive translation. Wording must not be compared. */
function facts(html) {
  const out = { code: [], links: [], nums: [] }
  for (const m of html.matchAll(/<code>([\s\S]*?)<\/code>/g)) {
    out.code.push(decode(stripTags(m[1])).replace(/\s+/g, ' ').trim())
  }
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    // In-page anchors and mailto differ legitimately between halves.
    if (!m[1].startsWith('#') && !m[1].startsWith('mailto:')) out.links.push(m[1])
  }
  // Versions, ports and quantities. Bare years and list ordinals are noise.
  for (const m of decode(stripTags(html)).matchAll(/\b\d[\d._:-]{1,}\b/g)) {
    const v = m[0]
    if (/^20\d\d$/.test(v)) continue
    out.nums.push(v)
  }
  return out
}

const bag = (arr) => {
  const m = new Map()
  for (const v of arr) m.set(v, (m.get(v) ?? 0) + 1)
  return m
}

/** Items in `a` that `b` does not carry as often. */
function missing(a, b) {
  const B = bag(b)
  const out = []
  for (const [v, n] of bag(a)) {
    const have = B.get(v) ?? 0
    if (have < n) out.push(v)
  }
  return out
}

/**
 * Pair the halves by document order.
 *
 * Blocks alternate en, pl, en, pl … so index i of one list answers index i of
 * the other. A length mismatch is itself a finding: one language has a block
 * the other does not.
 */
function blocks(html, lang) {
  const out = []
  const re = new RegExp(`<(\\w+)([^>]*\\sdata-lang="${lang}"[^>]*)>`, 'g')
  let m
  while ((m = re.exec(html))) {
    const tag = m[1]
    const start = m.index
    // Walk nested same-tag opens so the slice ends on the matching close.
    let depth = 1
    let i = re.lastIndex
    const open = new RegExp(`<${tag}[\\s>]`, 'g')
    const close = new RegExp(`</${tag}>`, 'g')
    while (depth > 0 && i < html.length) {
      open.lastIndex = i
      close.lastIndex = i
      const o = open.exec(html)
      const cl = close.exec(html)
      if (!cl) break
      if (o && o.index < cl.index) {
        depth++
        i = o.index + 1
      } else {
        depth--
        i = cl.index + cl[0].length
      }
    }
    out.push(html.slice(start, i))
  }
  return out
}

const dir = join(root, 'docs')
const files = readdirSync(dir).filter((f) => f.endsWith('.html')).sort()
let findings = 0

for (const file of files) {
  const html = readFileSync(join(dir, file), 'utf8')
  const en = blocks(html, 'en')
  const pl = blocks(html, 'pl')
  const lines = []

  if (en.length !== pl.length) {
    lines.push(`  block count: en=${en.length} pl=${pl.length}  (one language has a block the other lacks)`)
  }

  const n = Math.min(en.length, pl.length)
  for (let i = 0; i < n; i++) {
    const a = facts(en[i])
    const b = facts(pl[i])
    const report = (label, x, y) => {
      const onlyEn = missing(x, y)
      const onlyPl = missing(y, x)
      if (onlyEn.length) lines.push(`  [${i}] ${label} only in EN: ${onlyEn.slice(0, 6).join(' · ')}`)
      if (onlyPl.length) lines.push(`  [${i}] ${label} only in PL: ${onlyPl.slice(0, 6).join(' · ')}`)
    }
    report('code', a.code, b.code)
    report('link', a.links, b.links)
    report('number', a.nums, b.nums)
  }

  if (lines.length) {
    console.log(`\n${file}`)
    for (const l of lines.slice(0, 14)) console.log(l)
    if (lines.length > 14) console.log(`  … ${lines.length - 14} more`)
    findings += lines.length
  }
}

console.log(`\n${findings ? `${findings} mismatch(es) across ${files.length} pages` : `no drift across ${files.length} pages`}`)
if (strict && findings) process.exit(1)
