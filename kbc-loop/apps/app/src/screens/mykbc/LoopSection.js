// KBC Loop in My KBC, fully interactive: the key figures and the borrowed products as calm rows
// (tap one for its lifecycle and actions); "Costs" opens the cost overview. The link to the external impact service
// (ecoWise for individuals, Kube ESG for SMEs) is not part of KBC Loop and is shown dimmed.
import { StyleSheet, View } from 'react-native'
import { serviceById } from '@kbc-loop/shared/engine/integrations.js'
import { Dimmed } from '../../ui/Dimmed.js'
import { ImpactSummary } from '../../ui/ImpactSummary.js'
import { HeadLink, SectionHead } from '../common.js'
import { LoopItemCard } from '../LoopItemCard.js'
import { RowCard } from './RowCard.js'
import { NewLink } from './shared.js'

export function LoopSection({ customer, items, coins, actions }) {
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
      <ImpactSummary items={items} coins={coins} />
      {items.length === 0
        ? <View style={styles.empty}><RowCard icon="loop" name="Nothing borrowed yet" sub="Discover the partners" onPress={toShop} /></View>
        : null}
      {items.map((i) => <LoopItemCard key={i.key} item={i} actions={actions} />)}
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
