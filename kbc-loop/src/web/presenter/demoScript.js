// Draaiboek voor de automatische presentatiemodus (± 45 seconden).
// Elke stap is een gewone reducer-actie, dus dezelfde logica als bij klikken.
import { PREVENTIVE_ISSUE } from '../../data/index.js'

export const demoScript = [
  { caption: 'Lotte opent KBC Mobile. Kate merkt de gsm-herstelling op.', wait: 3500, action: { type: 'RESET' } },
  { caption: 'In KBC Mobile: KBC Loop, met categorieën van circulaire partners.', wait: 3500, action: { type: 'NAVIGATE', screen: 'shop' } },
  { caption: 'Kate stelt voor: een gsm lenen bij ReFone, herstel inbegrepen.', wait: 4000, action: { type: 'NAVIGATE', screen: 'product', active: { productId: 'phone', signalId: 'phone-repair' } } },
  { caption: 'Eén tik: KBC regelt financiering en verzekering.', wait: 3000, action: { type: 'BORROW', productId: 'phone' } },
  { caption: 'Alles wat Lotte leent, staat in Mijn KBC.', wait: 3500, action: { type: 'NAVIGATE', screen: 'mykbc' } },
  { caption: 'Haar Philips-lamp meldt zelf slijtage…', wait: 4000, action: { type: 'TRIGGER_TELEMETRY' } },
  { caption: '…en Philips plant de vervanging in voor ze uitvalt.', wait: 3500, action: { type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: PREVENTIVE_ISSUE, preventive: true } },
  { caption: 'Hersteld in plaats van weggegooid. Lotte verdient Kate Coins.', wait: 4000, action: { type: 'ADVANCE_REPAIR', itemKey: 'lotte-0' } },
  { caption: 'Partner: Philips ziet herstellingen, levensduur en terugkerende omzet.', wait: 5000, action: { type: 'SET_VIEW', view: 'partner' } },
  { caption: 'KBC: gefinancierd volume, terugkerende marge en CO₂-impact. Triple win.', wait: 6000, action: { type: 'SET_VIEW', view: 'kbc' } },
]
