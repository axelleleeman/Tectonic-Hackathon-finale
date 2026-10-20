// Copy for the data choices (web consent page and app consent screen): what is shared, why, and who sees it.
import { MIN_GROUP_SIZE } from '../config/index.js'

export const CHOICES = [
  { key: 'kateTips', title: 'Personal tips from Kate', what: 'Kate looks at the products you borrow and your payments to suggest repairs, upgrades or savings.', who: 'Only you see these tips.' },
  { key: 'insights', title: 'Anonymised insights for KBC', what: `Your usage counts towards anonymised statistics in KBC Loop Insights, only in groups of at least ${MIN_GROUP_SIZE} customers.`, who: 'KBC staff see group totals, never your name.' },
  { key: 'partners', title: 'Repair details for the partner', what: 'When you report a defect, your name, address and the issue go to the repair partner so a technician can visit.', who: 'Only the partner handling your repair.' },
  { key: 'telemetry', title: 'Connected devices', what: 'Devices that support it report wear, so a part can be replaced before it breaks.', who: 'You, KBC and the repair partner.' },
]

export const NEVER = [
  'We never sell your data.',
  'We never share your name with a partner without your consent.',
  `KBC Loop Insights only shows anonymised groups of at least ${MIN_GROUP_SIZE} customers.`,
  'You can change these choices at any time.',
]

// How far Kate goes on her own (state.dataPreferences[customerId].kateLevel). 'proactive' is the default.
export const KATE_LEVELS = [
  { id: 'basic', label: 'Basic', line: 'Kate only looks when you ask.' },
  { id: 'proactive', label: 'Proactive', line: 'Kate spots signals in your spending and suggests circular alternatives.' },
  { id: 'ecosystem', label: 'Ecosystem', line: 'Anonymous preferences unlock exclusive partner offers.' },
]
export const KATE_LEVEL_IDS = KATE_LEVELS.map((l) => l.id)
export const DEFAULT_KATE_LEVEL = 'proactive'
/** The level as stored, or the default when it is missing or unknown (older state). */
export const kateLevelOf = (level) => (KATE_LEVEL_IDS.includes(level) ? level : DEFAULT_KATE_LEVEL)
