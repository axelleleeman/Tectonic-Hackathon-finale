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
