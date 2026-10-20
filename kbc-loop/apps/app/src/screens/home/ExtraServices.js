// "Extra services": favourites and a horizontal pager with other services.
// KBC Loop (new, the only tappable service) is vivid at the top; everything else is dimmed.
import { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { Press } from '../../ui/Press.js'
import { BadgeNew } from '../common.js'
import { Dimmed } from '../../ui/Dimmed.js'
import { Glyph } from './icons.js'
import { Dots, Section, shared } from './parts.js'
import { colors } from '../../theme.js'

const FAVORITES = ['train', 'bus']
const PEEK = 62
const PAD = 16

const SERVICES = [
  { id: 'loop', title: 'KBC Loop', sub: 'Borrow instead of buying', icon: 'loop', isNew: true },
  { id: 'energy', title: 'Energy insights', sub: 'Get insight into your energy use', icon: 'chart' },
  { id: 'bike', title: 'Shared bike', sub: 'Rent a bike for a day', icon: 'signpost' },
  { id: 'split', title: 'Split group expenses', sub: 'Share and track expenses easily', icon: 'people' },
  { id: 'jobs', title: 'Working at KBC', sub: 'See all our vacancies', icon: 'briefcaseSmall' },
  { id: 'docs', title: 'Digital documents', sub: 'Keep your documents safe', icon: 'docs' },
]

const chunk = (list, n) => list.reduce((pages, x, i) => (i % n ? pages[pages.length - 1].push(x) : pages.push([x]), pages), [])

function ServiceBody({ s }) {
  return (
    <>
      <View style={styles.icon}><Glyph name={s.icon} size={26} color={colors.kmBlue} strokeWidth={1.7} /></View>
      <View style={styles.text}>
        <View style={styles.nameRow}>
          <T style={styles.name} numberOfLines={1}>{s.title}</T>
          {s.isNew ? <BadgeNew style={styles.badge} /> : null}
        </View>
        <T style={styles.sub} numberOfLines={1}>{s.sub}</T>
      </View>
      <Glyph name="heart" size={26} color={colors.kmBlue} strokeWidth={1.5} />
    </>
  )
}

/** One pager page: the KBC Loop row is tappable, the other services are dimmed together. */
function ServicePage({ services, onLoop }) {
  const loop = services.find((s) => s.id === 'loop')
  const others = services.filter((s) => s !== loop)
  return (
    <>
      {loop ? (
        <Press style={styles.row} onPress={onLoop} label="KBC Loop: borrow instead of buying. Open the KBC Loop offers">
          <ServiceBody s={loop} />
        </Press>
      ) : null}
      {others.length ? (
        <Dimmed radius={10}>
          {others.map((s) => <View key={s.id} style={styles.row}><ServiceBody s={s} /></View>)}
        </Dimmed>
      ) : null}
    </>
  )
}

export function ExtraServices({ onLoop }) {
  const [width, setWidth] = useState(0)
  const pageW = Math.max(0, width - PEEK)
  return (
    <Section title="Extra services" link="See more">
      <View style={[shared.card, styles.card]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        <Dimmed>
          <View style={styles.favHead}>
            <T style={[styles.h3, styles.flush]}>Your favourites</T>
            <Dots />
          </View>
          <View style={styles.favs}>
            {FAVORITES.map((f) => (
              <View key={f} style={styles.fav}><Glyph name={f} size={30} color={colors.kmNavy} strokeWidth={1.6} /></View>
            ))}
            <View style={styles.addFav}><Glyph name="plus" size={13} color="#fff" strokeWidth={3} /></View>
          </View>
        </Dimmed>
        <T style={[styles.h3, styles.otherHead]}>Our other extra services</T>
        {pageW ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={pageW} decelerationRate="fast"
            style={styles.pager} contentContainerStyle={styles.pagerContent}>
            {chunk(SERVICES, 3).map((page) => (
              <View key={page[0].id} style={{ width: pageW }}>
                <ServicePage services={page} onLoop={onLoop} />
              </View>
            ))}
          </ScrollView>
        ) : null}
      </View>
    </Section>
  )
}

const TILE = 62

const styles = StyleSheet.create({
  card: { paddingTop: 14, paddingBottom: 12 },
  favHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: PAD },
  h3: { fontSize: 17, fontWeight: '500', paddingHorizontal: PAD },
  favs: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: PAD, marginTop: 10 },
  fav: { width: TILE, height: TILE, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 2px 8px rgba(18, 40, 76, 0.12)' },
  addFav: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.kmGreen, alignItems: 'center', justifyContent: 'center', marginLeft: 26 },
  flush: { paddingHorizontal: 0 },
  otherHead: { marginTop: 22, marginBottom: 6 },
  pager: { flexGrow: 0 },
  pagerContent: { paddingLeft: PAD - 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6, paddingLeft: 4, paddingRight: 14 },
  icon: { width: 52, height: 52, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 2px 8px rgba(18, 40, 76, 0.12)' },
  text: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: '500', flexShrink: 1 },
  badge: { marginLeft: 6 },
  sub: { color: colors.kmSub, fontSize: 12.5 },
})
