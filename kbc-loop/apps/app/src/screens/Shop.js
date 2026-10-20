// The Loop tab: a segmented control with "Home" (the customer's products per category, + to add one)
// and "Impact" (CO₂ saved, Kate Coins and a compact row of figures). The segment choice is local state.
import { useState } from 'react'
import { Segmented } from './aanbod/Segmented.js'
import { LoopHome } from './aanbod/LoopHome.js'
import { LoopImpact } from './aanbod/LoopImpact.js'

const SEGMENTS = [
  { id: 'home', label: 'Home' },
  { id: 'impact', label: 'Impact' },
]

export function Shop({ customer, items, signals, coins, actions }) {
  const [segment, setSegment] = useState('home')
  return (
    <>
      <Segmented options={SEGMENTS} value={segment} onChange={setSegment} />
      {segment === 'home'
        ? <LoopHome customer={customer} items={items} signals={signals} actions={actions} />
        : <LoopImpact items={items} coins={coins} actions={actions} />}
    </>
  )
}
