// Total cost over the term: buying (incl. repairs and separate insurance) vs. borrowing.

export function costs(product) {
  const months = product.termMonths
  const buy = product.buyPrice + product.expectedRepairs + (product.insuranceMonthly ?? 0) * months
  const borrow = product.monthly * months
  return { months, buy, borrow, saving: buy - borrow }
}
