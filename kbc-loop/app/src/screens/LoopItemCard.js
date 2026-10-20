// Een geleend product met zijn levenscyclus (geleverd → nieuw leven) en acties.
import { StyleSheet, View } from 'react-native'
import { productById, partnerOf } from '@kbc-loop/shared/engine/catalog.js'
import { euro, formatDate } from '@kbc-loop/shared/engine/format.js'
import { COINS } from '@kbc-loop/shared/config/index.js'
import { Press } from '../ui/Press.js'
import { LinkButton } from '../ui/Button.js'
import { T } from '../ui/T.js'
import { cardShadow, colors } from '../theme.js'

const STAGES = ['Geleverd', 'In gebruik', 'Herstel', 'Terugname', 'Nieuw leven']

function stageState(item, n) {
  if (item.returned) return 'on'
  if (n < 2) return 'on'
  if (n === 2 && (item.repairs > 0 || item.repair)) return item.repair ? 'busy' : 'on'
  return ''
}

export function LoopItemCard({ item, actions }) {
  const p = productById(item.productId)
  return (
    <View style={[styles.sub, item.returned && styles.returned]}>
      <View style={styles.head}>
        <T style={styles.icon}>{p.icon}</T>
        <View style={styles.headText}>
          <T style={styles.name}>{p.name}</T>
          <T style={styles.small}>{partnerOf(p).name} · sinds {formatDate(item.since, { withYear: !item.since.startsWith('2026') })} · {euro(p.monthly)}/maand</T>
        </View>
      </View>
      <View style={styles.lifecycle}>
        {STAGES.map((st, n) => {
          const s = stageState(item, n)
          return (
            <View key={st} style={[styles.stage, s === 'on' && styles.stageOn, s === 'busy' && styles.stageBusy]}>
              <T style={[styles.stageText, s === 'on' && styles.stageTextOn, s === 'busy' && styles.stageTextBusy]} numberOfLines={1} adjustsFontSizeToFit>
                {st}{n === 2 && item.repairs > 0 ? ` ×${item.repairs}` : ''}
              </T>
            </View>
          )
        })}
      </View>
      {item.returned ? (
        <T style={styles.secondLife}>♻ Gerefurbished door {partnerOf(p).short}: dit product leeft verder bij een nieuwe klant. +{COINS.return} Kate Coins</T>
      ) : (
        <View style={styles.actions}>
          <Press style={styles.report} onPress={() => actions.navigate('repair', { itemKey: item.key })}>
            <T style={styles.reportText}>⚠ Meld een defect</T>
          </Press>
          <LinkButton small onPress={() => actions.returnItem(item.key)}>Inleveren</LinkButton>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  sub: { backgroundColor: '#fff', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, marginVertical: 10, ...cardShadow },
  returned: { opacity: 0.85 },
  head: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  headText: { flex: 1 },
  icon: { fontSize: 24 },
  name: { fontWeight: '700', color: colors.ink },
  small: { color: colors.muted, fontSize: 12, marginTop: 2 },
  lifecycle: { flexDirection: 'row', gap: 3, marginTop: 10 },
  stage: { flex: 1, paddingVertical: 5, paddingHorizontal: 2, borderRadius: 6, backgroundColor: colors.line, alignItems: 'center' },
  stageOn: { backgroundColor: colors.green },
  stageBusy: { backgroundColor: colors.yellow },
  stageText: { fontSize: 9.5, color: colors.muted, textAlign: 'center' },
  stageTextOn: { color: '#fff' },
  stageTextBusy: { color: '#5c4400' },
  actions: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 10 },
  report: { flex: 1, padding: 9, borderRadius: 10, borderWidth: 1, borderColor: colors.noteLine, backgroundColor: colors.noteBg, alignItems: 'center' },
  reportText: { fontWeight: '600', fontSize: 14, color: colors.ink },
  secondLife: { fontSize: 13, color: colors.savingInk, marginTop: 10 },
})
