// "Home" of the Loop tab: the customer's products grouped per category, each with its monthly subtotal.
// Rows reuse LoopItemCard (tap → product detail). The "+" opens the service catalogue (screen 'category' without a category).
import { StyleSheet, View } from 'react-native'
import { categoriesFor, categoryOf, productById } from '@kbc-loop/shared/engine/catalog.js'
import { Icon } from '../../ui/Icon.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { money } from '../item/format.js'
import { LoopItemCard } from '../LoopItemCard.js'
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

export function LoopHome({ customer, items, actions }) {
  const groups = homeGroups(items, customer.type)
  const add = () => actions.navigate('category', { categoryId: null })
  return (
    <View>
      <View style={styles.head}>
        <T style={styles.title} role="heading">Your home</T>
        <Press onPress={add} style={styles.add} label="Add a product" hitSlop={8}>
          <Icon name="plus" size={22} color="#fff" strokeWidth={2.4} />
        </Press>
      </View>
      {groups.length === 0 ? <T style={styles.empty}>Nothing in your home yet. Tap + to add a product.</T> : null}
      {groups.map((g) => (
        <View key={g.category.id} style={styles.group}>
          <View style={styles.groupHead}>
            <T style={styles.groupName}>{g.category.name}</T>
            <T style={styles.groupSum}>{money(g.monthly)}/month</T>
          </View>
          {g.items.map((item) => <LoopItemCard key={item.key} item={item} actions={actions} />)}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 4 },
  title: { fontSize: 19, fontWeight: '700', color: colors.kmNavy },
  add: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.kmBlue, alignItems: 'center', justifyContent: 'center' },
  empty: { color: colors.kmSub, marginTop: 12 },
  group: { marginTop: 14 },
  groupHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 },
  groupName: { fontSize: 15, fontWeight: '700', color: colors.kmNavy },
  groupSum: { fontSize: 13, color: colors.kmSub, fontWeight: '600' },
})
