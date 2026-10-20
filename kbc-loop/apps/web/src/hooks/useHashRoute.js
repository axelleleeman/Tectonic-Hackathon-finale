// Minimal hash router for the web demo:
//   (no hash)            → the KBC "All apps" page
//   #loop                → KBC LOOP, Home tab
//   #loop/mykbc          → KBC LOOP, My KBC tab (products in your home + Kate Coins)
//   #loop/marketplace    → KBC LOOP, Loop tab (the marketplace)
//   #loop/presentation   → presenter panel, dashboards and app (not in the tab bar; URL only)
import { useCallback, useEffect, useState } from 'react'

const HASHES = { home: '#loop', mykbc: '#loop/mykbc', loop: '#loop/marketplace', presentation: '#loop/presentation' }
const ROUTES = Object.fromEntries(Object.entries(HASHES).map(([route, hash]) => [hash, route]))

const parse = (hash) => ROUTES[hash.replace(/\/$/, '')] ?? null

/** Returns [route | null, go]. go(null) returns to the KBC apps page; go(route) opens a KBC LOOP view. */
export function useHashRoute() {
  const [route, setRoute] = useState(() => parse(window.location.hash))

  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash))
    window.addEventListener('hashchange', onChange)
    window.addEventListener('popstate', onChange)
    return () => {
      window.removeEventListener('hashchange', onChange)
      window.removeEventListener('popstate', onChange)
    }
  }, [])

  const go = useCallback((next) => {
    const target = HASHES[next] ? next : null
    window.history.pushState(null, '', target ? HASHES[target] : window.location.pathname + window.location.search)
    setRoute(target)
    window.scrollTo(0, 0)
  }, [])

  return [route, go]
}
