// The Loop tab: a segmented control with "Home" (the customer's products per category, + to add one),
// "Impact" (CO₂ saved, Kate Coins and a compact row of figures) and "Rewards" (redeem Kate Coins).
// The segment choice is local state.
import { useState } from 'react'
import { Segmented } from './aanbod/Segmented.js'
import { LoopHome } from './aanbod/LoopHome.js'
import { LoopImpact } from './aanbod/LoopImpact.js'
import { RewardsPanel } from './rewards/RewardsScreen.js'
import { useLoopState } from './rewards/useLoopState.js'

const SEGMENTS = [
  { id: 'home', label: 'Home' },
  { id: 'impact', label: 'Impact' },
  { id: 'rewards', label: 'Rewards' },
]

function RewardsSegment({ customer, coins, actions }) {
  const state = useLoopState()
  return <RewardsPanel state={state} customer={customer} coins={coins} actions={actions} style={{ marginTop: 20 }} />
}

export function Shop({ customer, items, signals, coins, actions }) {
  const [segment, setSegment] = useState('home')
  return (
    <>
      <Segmented options={SEGMENTS} value={segment} onChange={setSegment} />
      {segment === 'home' ? <LoopHome customer={customer} items={items} signals={signals} actions={actions} /> : null}
      {segment === 'impact'
        ? <LoopImpact items={items} coins={coins} actions={actions} onOpenRewards={() => setSegment('rewards')} />
        : null}
      {segment === 'rewards' ? <RewardsSegment customer={customer} coins={coins} actions={actions} /> : null}
    </>
  )
}
