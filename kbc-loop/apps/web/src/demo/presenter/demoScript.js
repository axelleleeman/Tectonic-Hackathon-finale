// Draaiboek voor de automatische presentatiemodus (± 45 seconden).
// Elke stap is een gewone reducer-actie, dus dezelfde logica als bij klikken.
import { PREVENTIVE_ISSUE } from '@kbc-loop/shared/data/index.js'

export const demoScript = [
  { caption: 'Lotte opens KBC Mobile. Kate notices the phone repair.', wait: 3500, action: { type: 'RESET' } },
  { caption: 'In KBC Mobile: KBC Loop, with categories from circular partners.', wait: 3500, action: { type: 'NAVIGATE', screen: 'shop' } },
  { caption: 'Kate suggests borrowing a phone from ReFone, repairs included.', wait: 4000, action: { type: 'NAVIGATE', screen: 'product', active: { productId: 'phone', signalId: 'phone-repair' } } },
  { caption: 'One tap: KBC arranges financing and insurance.', wait: 3000, action: { type: 'BORROW', productId: 'phone' } },
  { caption: 'Everything Lotte borrows is listed in My KBC.', wait: 3500, action: { type: 'NAVIGATE', screen: 'mykbc' } },
  { caption: 'Her Philips light reports wear by itself…', wait: 4000, action: { type: 'TRIGGER_TELEMETRY' } },
  { caption: '…and Philips schedules the replacement before it fails.', wait: 3500, action: { type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: PREVENTIVE_ISSUE, preventive: true } },
  { caption: 'Repaired instead of thrown away. Lotte earns Kate Coins.', wait: 4000, action: { type: 'ADVANCE_REPAIR', itemKey: 'lotte-0' } },
  { caption: 'Partner: Philips sees repairs, lifetime and recurring revenue.', wait: 5000, action: { type: 'SET_VIEW', view: 'partner' } },
  { caption: 'KBC: financed volume, recurring margin and CO₂ impact. Triple win.', wait: 6000, action: { type: 'SET_VIEW', view: 'kbc' } },
]
