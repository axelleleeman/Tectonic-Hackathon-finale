// "Home" of the Loop tab: the customer's products grouped per category, each with its monthly subtotal.
// Rows reuse LoopItemCard (tap → product detail). The "+" opens the service catalogue (screen 'category' without a category).
import { StyleSheet, View } from 'react-native'
import { categoriesFor, categoryOf, productById } from '@kbc-loop/shared/engine/catalog.js'
import { Icon } from '../../ui/Icon.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { money } from '../item/format.js'
import { LoopItemCard } from '../LoopItemCard.js'
import { SectionHeader } from '../../ui/SectionHeader.js'
import { space, tabular } from '../../ui/tokens.js'
import { KateTips } from './KateTips.js'
import { colors } from '../../theme.js'

/** Active items grouped per category, in catalogue order. */
export function homeGroups(items, customerType) {
  const order = categoriesFor(customerType).map((c) => c.id)
  const groups = new Map()
  for (const item of items) {
    const p = productById(item.productId)
    if (!p || item.returned) continue
    const cat = categoryOf(p)
    if (!cat) continue
    if (!groups.has(cat.id)) groups.set(cat.id, { category: cat, items: [], monthly: 0 })
    const g = groups.get(cat.id)
    g.items.push(item)
    g.monthly += p.monthly
  }
  const rank = (id) => (order.includes(id) ? order.indexOf(id) : order.length)
  return [...groups.values()].sort((a, b) => rank(a.category.id) - rank(b.category.id))
}

export function LoopHome({ customer, items, signals, actions, kateLevel }) {
  const groups = homeGroups(items, customer.type)
  const add = () => actions.navigate('category', { categoryId: null })
  return (
    <View>
      <View style={styles.head}>
        <T style={styles.title} role="heading">Your home</T>
        <Press onPress={add} style={styles.add} label="Add a product" hitSlop={6}>
          <Icon name="plus" size={22} color="#fff" strokeWidth={2.4} />
        </Press>
      </View>
      {groups.length === 0 ? (
        <View style={styles.emptyBox}>
          <T style={styles.empty}>Nothing borrowed yet.</T>
          <Press onPress={add} style={styles.emptyAction} label="Browse the services"><T style={styles.emptyLink}>Browse the services</T></Press>
        </View>
      ) : null}
      {groups.map((g) => (
        <View key={g.category.id} style={styles.group}>
          <SectionHeader title={g.category.name} right={`${money(g.monthly)} / month`} style={styles.groupHead} />
          {g.items.map((item) => <LoopItemCard key={item.key} item={item} actions={actions} />)}
        </View>
      ))}
      <KateTips signals={signals} actions={actions} kateLevel={kateLevel} />
    </View>
  )
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.xl, marginBottom: space.xs },
  title: { fontSize: 19, fontWeight: '700', color: colors.kmNavy },
  add: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.kmBlue, alignItems: 'center', justifyContent: 'center' },
  emptyBox: { marginTop: space.md, alignItems: 'flex-start' },
  empty: { color: colors.kmSub },
  emptyAction: { minHeight: 44, justifyContent: 'center' },
  emptyLink: { color: colors.kmBlue, fontWeight: '600' },
  group: { marginTop: space.lg },
  groupHead: { marginBottom: space.xs, ...tabular },
})
