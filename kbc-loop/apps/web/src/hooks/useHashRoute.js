// Minimal hash router for the web demo:
//   (no hash)                  → redirected to #loop (the portal opens directly)
//   #loop                      → KBC LOOP start screen (metrics + your home)
//   #loop/catalog              → the product catalogue (alias: #loop/marketplace)
//   #loop/catalog/<categoryId> → the catalogue, opened on one category
//   #loop/product/<itemKey>    → detail page of one product the customer has
//   #loop/catalog/product/<id> → catalogue detail page of one product (route 'catalogProduct')
//   #loop/partner/<partnerId>  → partner page: profile, key facts and products (route 'partnerPage')
//   #loop/costs                → cost overview
//   #loop/rewards              → Kate Coins rewards
//   #loop/consent              → choose what happens with your data
//   #loop/presentation         → presenter panel, dashboards and app (URL only, not linked from the page)
//   #partner                   → partner portal (KBC Partner Hub view: KPIs and live repair tickets)
import { useCallback, useEffect, useState } from 'react'

const HASHES = { home: '#loop', catalog: '#loop/catalog', product: '#loop/product', costs: '#loop/costs', rewards: '#loop/rewards', consent: '#loop/consent', presentation: '#loop/presentation', partner: '#partner', catalogProduct: '#loop/catalog/product', partnerPage: '#loop/partner' }
const ALIASES = { '#loop/marketplace': 'catalog', '#loop/mykbc': 'home' }
const ROUTES = { ...Object.fromEntries(Object.entries(HASHES).map(([route, hash]) => [hash, route])), ...ALIASES }
const PARAM = /^[A-Za-z0-9_-]{1,64}$/ // category ids and item keys only; anything else is ignored
const WITH_PARAM = { catalog: true, product: true, catalogProduct: true, partnerPage: true } // routes that take a parameter
const NEEDS_PARAM = { product: true, catalogProduct: true, partnerPage: true } // ...and those that require one

// Scroll memory: the position of each list-like page is remembered when you leave it, so coming back
// (browser back or an in-page back link) lands where you were instead of at the top.
const RESTORE = { home: true, catalog: true } // detail pages always open at the top
const positions = new Map()
const keyOf = () => window.location.hash || '#'
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

function scrollFor(route, key) {
  const y = RESTORE[route] ? positions.get(key) ?? 0 : 0
  // Wait two frames so the new view has rendered its content before scrolling.
  requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, y)))
}

function parse(hash) {
  const clean = hash.replace(/\/$/, '')
  if (ROUTES[clean] && !NEEDS_PARAM[ROUTES[clean]]) return { route: ROUTES[clean], param: null }
  const deep = clean.match(/^#loop\/(catalog\/product|partner)\/([^/]+)$/)
  if (deep) {
    let param = ''
    try { param = decodeURIComponent(deep[2]) } catch { /* malformed escape: ignored */ }
    if (PARAM.test(param)) return { route: deep[1] === 'partner' ? 'partnerPage' : 'catalogProduct', param }
  }
  const m = clean.match(/^#loop\/(catalog|marketplace|product)\/([^/]+)$/)
  if (m) {
    let param = ''
    try { param = decodeURIComponent(m[2]) } catch { /* malformed escape: ignored */ }
    if (PARAM.test(param)) return { route: m[1] === 'marketplace' ? 'catalog' : m[1], param }
  }
  return { route: null, param: null }
}

/**
 * Returns { route, param, go }. go(null) clears the hash (the app then shows #loop); go(route, param?) opens a KBC LOOP view
 * (param = category id for the catalogue, item key for a product).
 */
export function useHashRoute() {
  const [loc, setLoc] = useState(() => parse(window.location.hash))

  useEffect(() => {
    let current = keyOf()
    const onScroll = () => positions.set(current, window.scrollY)
    const onChange = () => {
      current = keyOf()
      const next = parse(window.location.hash)
      setLoc(next)
      scrollFor(next.route, current)
    }
    // Keep the position of the page we are on up to date (also catches in-page navigation via go()).
    const track = () => { current = keyOf() }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('hashchange', onChange)
    window.addEventListener('popstate', onChange)
    window.addEventListener('kbcloop:navigate', track)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('hashchange', onChange)
      window.removeEventListener('popstate', onChange)
      window.removeEventListener('kbcloop:navigate', track)
    }
  }, [])

  const go = useCallback((next, param = null) => {
    const p = WITH_PARAM[next] && param && PARAM.test(param) ? param : null
    const route = HASHES[next] && (!NEEDS_PARAM[next] || p) ? next : null
    const hash = route ? `${HASHES[route]}${p ? `/${p}` : ''}` : null
    positions.set(keyOf(), window.scrollY)
    window.history.pushState(null, '', hash ?? window.location.pathname + window.location.search)
    window.dispatchEvent(new Event('kbcloop:navigate'))
    setLoc({ route, param: p })
    scrollFor(route, keyOf())
  }, [])

  return { ...loc, go }
}
