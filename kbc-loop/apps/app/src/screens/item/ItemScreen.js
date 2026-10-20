// Product detail of a borrowed item (screen 'item'): hero, key facts and four action tiles that each open
// a flow on this screen (report a problem, upgrade, return, costs & contract). A repair in progress opens
// the shared repair tracker instead. Right after an upgrade the new item first shows UpgradeSuccess.
import { useState } from 'react'
import { partnerOf, productById } from '@kbc-loop/shared/engine/catalog.js'
import { itemCosts } from '@kbc-loop/shared/engine/costs.js'
import { upgradeOptions } from '@kbc-loop/shared/engine/upgrades.js'
import { T } from '../../ui/T.js'
import { ItemHero } from './ItemHero.js'
import { ActionTiles, tilesFor } from './ActionTiles.js'
import { ReportFlow } from './report/ReportFlow.js'
import { UpgradeFlow } from './upgrade/UpgradeFlow.js'
import { UpgradeSuccess } from './upgrade/UpgradeSuccess.js'
import { ReturnFlow } from './return/ReturnFlow.js'
import { ItemCostDetail } from '../costs/ItemCostDetail.js'

export function ItemScreen({ item, items, customer, actions, celebrate, onCelebrated, onUpgrading }) {
  const [view, setView] = useState('overview')
  const product = productById(item.productId)
  if (!product) return <T>This product is no longer in the catalogue.</T>
  const partner = partnerOf(product)
  const cost = itemCosts(item)
  const options = upgradeOptions(product.id, customer.type)
  const toOverview = () => setView('overview')
  const props = { item, product, partner, cost, actions, onExit: toOverview }
  const openRepair = () => actions.navigate('repair', { itemKey: item.key })

  if (celebrate && item.upgradedFrom === celebrate) {
    const oldItem = items.find((i) => i.key === item.upgradedFrom)
    return <UpgradeSuccess {...props} oldItem={oldItem} onDone={onCelebrated} />
  }

  if (view === 'report') return <ReportFlow {...props} />
  if (view === 'upgrade') return <UpgradeFlow {...props} options={options} onUpgrading={onUpgrading} />
  if (view === 'return') return <ReturnFlow {...props} />
  if (view === 'costs') return <ItemCostDetail {...props} customer={customer} />

  const open = (id) => (id === 'report' && item.repair ? openRepair() : setView(id))

  return (
    <>
      <ItemHero item={item} product={product} partner={partner} cost={cost} />
      <ActionTiles tiles={tilesFor(item, options.length)} onOpen={open} />
    </>
  )
}
