/* Theme, language, and the mobile site menu. No network. */
(() => {
  const html = document.documentElement
  const themeBtn = document.getElementById('theme-btn')

  function applyTheme(theme) {
    const t = theme === 'light' ? 'light' : 'dark'
    html.dataset.theme = t
    if (!themeBtn) return
    const toLight = t === 'dark'
    themeBtn.textContent = toLight ? 'Light' : 'Dark'
    themeBtn.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false')
    themeBtn.setAttribute('aria-label', toLight ? 'Switch to light theme' : 'Switch to dark theme')
  }

  applyTheme(html.dataset.theme === 'light' ? 'light' : 'dark')
  themeBtn?.addEventListener('click', () => {
    const next = html.dataset.theme === 'light' ? 'dark' : 'light'
    try { localStorage.setItem('pomnia-theme', next) } catch (_) {}
    applyTheme(next)
  })

  const btnEn = document.getElementById('btn-en')
  const btnPl = document.getElementById('btn-pl')
  function setLang(lang) {
    const pl = lang === 'pl'
    html.classList.toggle('lang-pl', pl)
    html.lang = pl ? 'pl' : 'en'
    if (btnEn) {
      btnEn.classList.toggle('active', !pl)
      btnEn.setAttribute('aria-pressed', String(!pl))
    }
    if (btnPl) {
      btnPl.classList.toggle('active', pl)
      btnPl.setAttribute('aria-pressed', String(pl))
    }
    try { localStorage.setItem('pomnia-lang', pl ? 'pl' : 'en') } catch (_) {}
  }
  if (btnEn && btnPl) {
    let saved = 'en'
    try { saved = localStorage.getItem('pomnia-lang') || 'en' } catch (_) {}
    setLang(saved === 'pl' ? 'pl' : 'en')
    btnEn.addEventListener('click', () => setLang('en'))
    btnPl.addEventListener('click', () => setLang('pl'))
  }

  const toggle = document.querySelector('.nav-toggle')
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = html.classList.toggle('nav-open')
      toggle.setAttribute('aria-expanded', String(open))
    })
  }
})()
