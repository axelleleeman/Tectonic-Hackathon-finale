// KBC Loop in My KBC, fully interactive: the impact hero (Kate Coins and CO₂ saved), the borrowed products
// with their lifecycle and actions, and the monthly total. The link to the external impact service
// (ecoWise for individuals, Kube ESG for SMEs) is not part of KBC Loop and is shown dimmed.
import { StyleSheet, View } from 'react-native'
import { loopTotals } from '@kbc-loop/shared/engine/impact.js'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { serviceById } from '@kbc-loop/shared/engine/integrations.js'
import { Dimmed } from '../../ui/Dimmed.js'
import { ImpactSummary } from '../../ui/ImpactSummary.js'
import { T } from '../../ui/T.js'
import { HeadLink, SectionHead } from '../common.js'
import { LoopItemCard } from '../LoopItemCard.js'
import { RowCard } from './RowCard.js'
import { NewLink } from './shared.js'
import { type } from '../../theme.js'

export function LoopSection({ customer, items, coins, actions }) {
  const t = loopTotals(items)
  const impact = serviceById(customer.type === 'kmo' ? 'kubeEsg' : 'ecoWise')
  const toShop = () => actions.navigate('shop')
  const toCosts = () => actions.navigate('costs')

  return (
    <View>
      <SectionHead title="KBC Loop" right={(
        <View style={styles.headLinks}>
          {items.length > 0 ? <HeadLink onPress={toCosts} label="View your KBC Loop costs">Costs</HeadLink> : null}
          <NewLink onPress={toShop} label="Borrow a new product with KBC Loop" />
        </View>
      )} />
      <ImpactSummary items={items} coins={coins} onCosts={items.length > 0 ? toCosts : undefined} />
      {items.length === 0
        ? <View style={styles.empty}><RowCard icon="loop" name="You are not borrowing anything yet" sub="Discover the circular partners" onPress={toShop} /></View>
        : null}
      {items.map((i) => <LoopItemCard key={i.key} item={i} actions={actions} />)}
      {t.active > 0 ? (
        <T style={type.fine}>Total {euro(t.monthly)}/month, including maintenance, repairs and insurance. Tap a product for its details.</T>
      ) : null}
      <Dimmed radius={10}>
        <RowCard icon="chart" name={`Your impact in ${impact.name}`} sub={impact.label} />
      </Dimmed>
    </View>
  )
}

const styles = StyleSheet.create({
  empty: { marginTop: 12 },
  headLinks: { flexDirection: 'row', alignItems: 'center', gap: 18 },
})
