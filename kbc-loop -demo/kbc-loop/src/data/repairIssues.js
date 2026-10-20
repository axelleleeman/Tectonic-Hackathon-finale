// Snelkeuzes bij "Meld een defect", per product.

export const repairIssues = {
  'lamp-home': ['Lamp flikkert', 'Lamp brandt niet meer', 'Sturing reageert niet'],
  'lamp-shop': ['Armatuur defect', 'Sensor werkt niet', 'Flikkering in winkel'],
  phone: ['Scherm gebarsten', 'Batterij loopt snel leeg', 'Laadt niet meer'],
  washer: ['Pompt niet af', 'Lekt water', 'Start niet'],
  laptop: ['Batterij versleten', 'Toetsenbord defect', 'Start niet op'],
}

export const DEFAULT_ISSUES = ['Werkt niet meer', 'Maakt vreemd geluid', 'Iets anders']

export const issuesFor = (productId) => repairIssues[productId] ?? DEFAULT_ISSUES

export const PREVENTIVE_ISSUE = 'Preventief: slijtage gemeld door de lamp zelf'
