// Minimal hash router for the web demo:
//   (no hash)                  → the KBC "All apps" page
//   #loop                      → KBC LOOP start screen (metrics + your home)
//   #loop/catalog              → the product catalogue (alias: #loop/marketplace)
//   #loop/catalog/<categoryId> → the catalogue, opened on one category
//   #loop/product/<itemKey>    → detail page of one product the customer has
//   #loop/costs                → cost overview
//   #loop/rewards              → Kate Coins rewards
//   #loop/consent              → choose what happens with your data
//   #loop/presentation         → presenter panel, dashboards and app (URL only, not linked from the page)
//   #partner                   → partner portal (KBC Partner Hub view: KPIs and live repair tickets)
import { useCallback, useEffect, useState } from 'react'

const HASHES = { home: '#loop', catalog: '#loop/catalog', product: '#loop/product', costs: '#loop/costs', rewards: '#loop/rewards', consent: '#loop/consent', presentation: '#loop/presentation', partner: '#partner' }
const ALIASES = { '#loop/marketplace': 'catalog', '#loop/mykbc': 'home' }
const ROUTES = { ...Object.fromEntries(Object.entries(HASHES).map(([route, hash]) => [hash, route])), ...ALIASES }
const PARAM = /^[A-Za-z0-9_-]{1,64}$/ // category ids and item keys only; anything else is ignored
const WITH_PARAM = { catalog: true, product: true } // routes that take a parameter (product requires one)

function parse(hash) {
  const clean = hash.replace(/\/$/, '')
  if (ROUTES[clean] && ROUTES[clean] !== 'product') return { route: ROUTES[clean], param: null }
  const m = clean.match(/^#loop\/(catalog|marketplace|product)\/([^/]+)$/)
  if (m) {
    let param = ''
    try { param = decodeURIComponent(m[2]) } catch { /* malformed escape: ignored */ }
    if (PARAM.test(param)) return { route: m[1] === 'marketplace' ? 'catalog' : m[1], param }
  }
  return { route: null, param: null }
}

/**
 * Returns { route, param, go }. go(null) returns to the KBC apps page; go(route, param?) opens a KBC LOOP view
 * (param = category id for the catalogue, item key for a product).
 */
export function useHashRoute() {
  const [loc, setLoc] = useState(() => parse(window.location.hash))

  useEffect(() => {
    const onChange = () => setLoc(parse(window.location.hash))
    window.addEventListener('hashchange', onChange)
    window.addEventListener('popstate', onChange)
    return () => {
      window.removeEventListener('hashchange', onChange)
      window.removeEventListener('popstate', onChange)
    }
  }, [])

  const go = useCallback((next, param = null) => {
    const p = WITH_PARAM[next] && param && PARAM.test(param) ? param : null
    const route = HASHES[next] && (next !== 'product' || p) ? next : null
    const hash = route ? `${HASHES[route]}${p ? `/${p}` : ''}` : null
    window.history.pushState(null, '', hash ?? window.location.pathname + window.location.search)
    setLoc({ route, param: p })
    window.scrollTo(0, 0)
  }, [])

  return { ...loc, go }
}
