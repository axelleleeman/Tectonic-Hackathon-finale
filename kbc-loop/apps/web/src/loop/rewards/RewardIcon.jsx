// Line icons for rewards (24×24, stroke = currentColor), picked by reward id with a fallback per kind.
const PATHS = {
  tag: ['M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1l8 8a1.5 1.5 0 0 1 0 2.1l-6 6a1.5 1.5 0 0 1-2.1 0z', 'M8.5 8.5h.01'],
  tree: ['M12 21v-5M12 3 6.5 10h3L6 15h12l-3.5-5h3z'],
  wrench: ['M14.7 6.3a4 4 0 0 0 5 5L21 13l-2 2-1.3-1.3a4 4 0 0 0-5-5L6 15.4a2 2 0 1 1-2.8-2.8L10 5.8'],
  up: ['M12 19V5M6 11l6-6 6 6'],
  gift: ['M4 11h16v9.5H4zM3 7.5h18V11H3zM12 7.5v13M12 7.5S10.5 3 8 3.5 7.5 7.5 12 7.5zM12 7.5s1.5-4.5 4-4 .5 4-4 4'],
}
const BY_ID = { 'fee-discount': 'tag', 'plant-tree': 'tree', 'priority-repair': 'wrench', 'free-upgrade': 'up' }
const BY_KIND = { discount: 'tag', impact: 'tree', service: 'wrench' }

const rewardIconName = (reward) => BY_ID[reward?.id] ?? BY_KIND[reward?.kind] ?? 'gift'

export function RewardIcon({ reward, size = 20 }) {
  const d = PATHS[rewardIconName(reward)]
  return (
    <svg className="lp-i" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {d.map((p) => <path key={p} d={p} />)}
    </svg>
  )
}
