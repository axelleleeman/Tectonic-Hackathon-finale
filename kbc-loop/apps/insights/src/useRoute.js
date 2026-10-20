// Tiny hash router: #/overview, #/groups, #/campaigns, #/campaigns/new?group=<id>, #/campaigns/<segmentId>.
import { useCallback, useEffect, useState } from 'react'

function parse(hash) {
  const [path, search = ''] = hash.replace(/^#\/?/, '').split('?')
  const parts = path.split('/').filter(Boolean)
  return { page: parts[0] || 'overview', id: parts[1] ? decodeURIComponent(parts[1]) : null, params: new URLSearchParams(search) }
}

export function useRoute() {
  const [route, setRoute] = useState(() => parse(window.location.hash))
  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  const go = useCallback((to) => { window.location.hash = to }, [])
  return { ...route, go }
}

export const href = {
  overview: '#/overview',
  groups: '#/groups',
  campaigns: '#/campaigns',
  newCampaign: (groupId) => (groupId ? `#/campaigns/new?group=${encodeURIComponent(groupId)}` : '#/campaigns/new'),
  campaign: (groupId) => `#/campaigns/${encodeURIComponent(groupId)}`,
}
