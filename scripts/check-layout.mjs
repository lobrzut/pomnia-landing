#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
/**
 * Render every real page and reject the download-page failure mode:
 * footer above the title, or a content column only a few words wide.
 *
 *   node scripts/check-layout.mjs
 *
 * Needs Chrome (google-chrome or CHROME) and puppeteer-core resolvable from
 * NODE_PATH or ./node_modules. Static landmark order is also in check-docs.mjs.
 */
import { createRequire } from 'node:module'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)

let puppeteer
try {
  puppeteer = require('puppeteer-core')
} catch {
  console.error('check-layout: puppeteer-core is not installed (NODE_PATH or node_modules)')
  process.exit(1)
}

function chromePath() {
  if (process.env.CHROME) return process.env.CHROME
  return '/usr/bin/google-chrome-stable'
}

function pages() {
  const out = []
  const walk = (rel) => {
    for (const name of readdirSync(join(root, rel || '.'), { withFileTypes: true })) {
      if (name.name.startsWith('.') || name.name === 'assets' || name.name === 'img' || name.name === 'scripts') continue
      const child = rel ? `${rel}/${name.name}` : name.name
      if (name.isDirectory()) walk(child)
      else if (name.name.endsWith('.html')) out.push(child)
    }
  }
  walk('')
  return out.sort()
}

const port = 8765
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
  cwd: root,
  stdio: 'ignore',
})

function urlFor(rel) {
  if (rel === 'index.html') return `http://127.0.0.1:${port}/`
  return `http://127.0.0.1:${port}/${rel}`
}

const fails = []
const verified = []

const browser = await puppeteer.launch({
  executablePath: chromePath(),
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

try {
  // Give the static server a moment.
  await new Promise((r) => setTimeout(r, 200))
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(20000)

  for (const rel of pages()) {
    const html = readFileSync(join(root, rel), 'utf8')
    if (/noindex/i.test(html) || /http-equiv="refresh"/i.test(html)) {
      verified.push(`${rel}  redirect/noindex — skipped render`)
      continue
    }
    const langs = html.includes('id="btn-pl"') ? ['en', 'pl'] : ['en']
    for (const width of [1280, 390]) {
      for (const theme of ['dark', 'light']) {
        for (const lang of langs) {
          const label = `${rel} ${lang} ${width}px ${theme}`
          await page.setViewport({ width, height: width === 1280 ? 900 : 844, deviceScaleFactor: 1 })
          await page.goto(urlFor(rel), { waitUntil: 'domcontentloaded' })
          await page.evaluate((theme, lang) => {
            localStorage.setItem('pomnia-theme', theme)
            localStorage.setItem('pomnia-lang', lang)
          }, theme, lang)
          await page.reload({ waitUntil: 'networkidle0' })
          const m = await page.evaluate(() => {
            const header = document.querySelector('header')
            const main = document.querySelector('main')
            const footer = document.querySelector('footer')
            const visible = (el) => el && getComputedStyle(el).display !== 'none' && el.getClientRects().length > 0
            const h1 = [...document.querySelectorAll('main h1')].find(visible)
            const para = [...document.querySelectorAll('main .lede, main p')].find(visible)
            const y = (el) => (el ? el.getBoundingClientRect().top + window.scrollY : null)
            return {
              has: Boolean(header && main && footer),
              order: Boolean(header && main && footer
                && header.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING
                && main.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING),
              footerInMain: Boolean(main && footer && main.contains(footer)),
              shells: document.querySelectorAll('.docs-shell').length,
              langPl: document.documentElement.classList.contains('lang-pl'),
              mainWidth: main ? main.getBoundingClientRect().width : 0,
              textWidth: para ? para.getBoundingClientRect().width : (main ? main.getBoundingClientRect().width : 0),
              h1Top: y(h1),
              footerTop: y(footer),
              mainTop: y(main),
            }
          })
          const minText = width >= 1000 ? 420 : 260
          const problems = []
          if (!m.has) problems.push('missing header, main, or footer')
          if (!m.order) problems.push('header/main/footer out of order')
          if (m.footerInMain) problems.push('footer inside main')
          if (m.shells > 1) problems.push(`${m.shells} docs-shell wrappers`)
          if (m.footerTop != null && m.mainTop != null && m.footerTop < m.mainTop + 40) problems.push('footer is not below main')
          if (m.h1Top != null && m.footerTop != null && m.footerTop < m.h1Top) problems.push('footer is above the title')
          if (m.textWidth < minText) problems.push(`text column ${Math.round(m.textWidth)}px (want ≥ ${minText})`)
          if (langs.includes('pl') && m.langPl !== (lang === 'pl')) problems.push(`language class lang-pl=${m.langPl}`)
          if (problems.length) fails.push(`${label}: ${problems.join('; ')}`)
          else verified.push(label)
        }
      }
    }
  }
} finally {
  await browser.close()
  server.kill()
}

console.log(`verified ${verified.length}`)
for (const line of verified) console.log('  ' + line)
if (fails.length) {
  console.error(`\n${fails.length} layout failure(s)`)
  for (const f of fails) console.error('  ' + f)
  process.exit(1)
}
console.log('\nlayout ok')
