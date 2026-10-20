// Rewards a customer can redeem with Kate Coins (REDEEM_REWARD in the loop reducer).
// kind: 'discount' (value = EUR off the next monthly fee) | 'impact' | 'service'

export const rewards = [
  { id: 'fee-discount', title: '€ 10 off your next month', cost: 300, kind: 'discount', value: 10 },
  { id: 'plant-tree', title: 'Plant a tree in Belgium', cost: 150, kind: 'impact' },
  { id: 'priority-repair', title: 'Priority repair visit', cost: 200, kind: 'service' },
  { id: 'free-upgrade', title: 'Free upgrade fee', cost: 800, kind: 'service' },
]

/** The reward with this id, or undefined. */
export const rewardById = (id) => rewards.find((r) => r.id === id)
