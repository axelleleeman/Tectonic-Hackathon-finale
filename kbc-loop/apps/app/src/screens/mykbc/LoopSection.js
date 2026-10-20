// KBC Loop in Mijn KBC: statistieken, geleende producten met hun levenscyclus en de impact
// (ecoWise voor particulieren, Kube ESG voor kmo's). Dit deel is volledig interactief.
import { StyleSheet, View } from 'react-native'
import { loopTotals } from '@kbc-loop/shared/engine/impact.js'
import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { serviceById } from '@kbc-loop/shared/engine/integrations.js'
import { Stat } from '../../ui/Stat.js'
import { T } from '../../ui/T.js'
import { SectionHead } from '../common.js'
import { LoopItemCard } from '../LoopItemCard.js'
import { RowCard } from './RowCard.js'
import { NewLink } from './shared.js'
import { type } from '../../theme.js'

export function LoopSection({ customer, items, actions }) {
  const t = loopTotals(items)
  const impact = serviceById(customer.type === 'kmo' ? 'kubeEsg' : 'ecoWise')
  const toShop = () => actions.navigate('shop')

  return (
    <View>
      <SectionHead title="KBC Loop" right={<NewLink onPress={toShop} label="Nieuw product lenen via KBC Loop" />} />
      <View style={styles.tiles}>
        <Stat value={t.active} label="in gebruik" />
        <Stat value={t.repairs} label="keer hersteld i.p.v. weggegooid" />
        <Stat value={`${num(t.co2Kg)} kg`} label="CO₂ vermeden" hint={t.co2Kg ? `≈ ${num(t.carKm)} km auto` : null} />
      </View>
      {items.length === 0
        ? <RowCard icon="loop" name="Je leent nog niets" sub="Ontdek de circulaire partners" onPress={toShop} />
        : null}
      {items.map((i) => <LoopItemCard key={i.key} item={i} actions={actions} />)}
      {t.active > 0 ? <T style={type.fine}>Totaal {euro(t.monthly)}/maand, incl. onderhoud, herstel en verzekering.</T> : null}
      <RowCard icon="chart" name={`Je impact in ${impact.name}`} sub={impact.label} />
    </View>
  )
}

const styles = StyleSheet.create({
  tiles: { flexDirection: 'row', gap: 8, marginBottom: 2 },
})
