// Totale kost over de looptijd: kopen (incl. herstellingen en losse verzekering) vs. lenen.

export function costs(product) {
  const months = product.termMonths
  const buy = product.buyPrice + product.expectedRepairs + (product.insuranceMonthly ?? 0) * months
  const borrow = product.monthly * months
  return { months, buy, borrow, saving: buy - borrow }
}
