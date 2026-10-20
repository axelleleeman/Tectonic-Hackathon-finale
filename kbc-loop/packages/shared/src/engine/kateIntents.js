// Herkent eenvoudige vragen aan Kate (trefwoorden; in productie een taalmodel).

const intents = [
  { id: 'defect', words: ['kapot', 'defect', 'flikkert', 'stuk', 'werkt niet', 'herstel', 'brandt niet'] },
  { id: 'overview', words: ['wat leen', 'mijn loop', 'abonnement', 'overzicht'] },
  { id: 'tip', words: ['tip', 'voorstel', 'besparen', 'advies'] },
]

export function matchIntent(text) {
  const t = text.toLowerCase()
  return intents.find((i) => i.words.some((w) => t.includes(w)))?.id ?? null
}
