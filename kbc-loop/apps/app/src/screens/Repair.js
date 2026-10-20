// Repair (screen 'repair'). Without an open repair it shows the "Report a problem" flow (e.g. opened by Kate);
// with one it shows the confirmation with the technician slot and the live 3-step tracker. The demo advances
// the steps with "Next step (demo)"; a completed repair earns Kate Coins.
import { StyleSheet, View } from 'react-native'
import { productById, partnerOf } from '@kbc-loop/shared/engine/catalog.js'
import { COINS } from '@kbc-loop/shared/config/index.js'
import { T } from '../ui/T.js'
import { ReportFlow } from './item/report/ReportFlow.js'
import { ActionButton, Card, SuccessHeader, SummaryRow } from './item/parts.js'
import { ProductArt } from './item/ProductArt.js'
import { Glyph } from './item/Glyph.js'
import { technicianSlot } from './item/format.js'
import { partnerStatusLine, updatedLabel } from './item/partnerStatus.js'
import { cardShadow, colors } from '../theme.js'

function Timeline({ steps, current }) {
  return (
    <View style={styles.timeline} accessible aria-label={`Repair progress: step ${current} of ${steps.length}, ${steps[current - 1].title}`}>
      {steps.map((s, n) => {
        const on = n < current
        const last = n === steps.length - 1
        return (
          <View key={s.title} style={[styles.step, last && styles.stepLast]}>
            <View style={[styles.dot, on && styles.dotOn]}>{on ? <Glyph name="check" size={12} color="#fff" strokeWidth={3} /> : null}</View>
            {!last ? <View style={[styles.line, n < current - 1 && styles.lineOn]} /> : null}
            <T style={[styles.stepTitle, on && styles.stepTitleOn]}>{s.title}</T>
            {s.sub ? <T style={styles.stepSub}>{s.sub}</T> : null}
          </View>
        )
      })}
    </View>
  )
}

export function Repair({ item, actions, run }) {
  const p = productById(item.productId)
  const partner = partnerOf(p)
  const r = item.repair
  const toItem = () => actions.navigate('item', { itemKey: item.key })

  if (!r) return <ReportFlow item={item} product={p} partner={partner} actions={actions} onExit={toItem} />

  const done = r.step >= 3
  const steps = [
    { title: r.preventive ? 'Wear reported by the device itself' : 'Problem reported', sub: `“${r.issue}”${r.photo ? ' · photo attached' : ''}` },
    { title: 'Technician scheduled', sub: partner.name },
    { title: 'Repaired and tested', sub: '' },
  ]
  const finish = () => run([{ type: 'CLOSE_REPAIR', itemKey: item.key }, { type: 'NAVIGATE', screen: 'item', active: { itemKey: item.key } }])

  return (
    <>
      {done ? (
        <SuccessHeader title="Repaired" text={`€ 0 · +${COINS.repair} Kate Coins`} />
      ) : (
        <View style={styles.head}>
          <ProductArt product={p} size="md" />
          <View style={styles.headText}>
            <T style={styles.title} role="heading">{r.step === 1 ? 'Report received' : 'Repair in progress'}</T>
            <T style={styles.sub}>{p.name}</T>
          </View>
        </View>
      )}

      {!done ? (
        <Card style={styles.slot}>
          <View style={styles.slotIcon}><Glyph name="calendar" size={22} color={colors.kmBlue} /></View>
          <View style={styles.headText}>
            <T style={styles.slotLabel}>Technician visit</T>
            <T style={styles.slotValue}>{technicianSlot}</T>
          </View>
        </Card>
      ) : null}

      {partnerStatusLine(r.partnerStatus) ? (
        <View style={styles.partnerStatus} accessibilityLiveRegion="polite" role="status">
          <View style={styles.partnerDot} />
          <View style={styles.headText}>
            <T style={styles.partnerLine}>{partnerStatusLine(r.partnerStatus)}</T>
            <T style={styles.partnerSub}>{partner.name}{updatedLabel(r.updatedOn) ? ` · updated ${updatedLabel(r.updatedOn)}` : ''}</T>
          </View>
        </View>
      ) : null}

      <Card style={styles.card}><Timeline steps={steps} current={r.step} /></Card>

      {r.note ? (
        <Card style={styles.card}>
          <SummaryRow label="Your description" value={r.note} last />
        </Card>
      ) : null}

      {!done ? (
        <>
          <ActionButton onPress={() => actions.advanceRepair(item.key)} label="Next step of the repair (demo)">Next step (demo)</ActionButton>
          <ActionButton variant="secondary" onPress={toItem}>Back to product</ActionButton>
        </>
      ) : (
        <>
          <ActionButton onPress={finish}>Back to product</ActionButton>
        </>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  headText: { flex: 1 },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  sub: { color: colors.kmSub, fontSize: 13.5, marginTop: 3 },
  slot: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.kmSky, boxShadow: 'none' },
  slotIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  slotLabel: { fontSize: 12.5, color: colors.kmSub, fontWeight: '600' },
  slotValue: { fontSize: 16, fontWeight: '800', marginTop: 2 },
  card: { marginTop: 12, ...cardShadow },
  timeline: { paddingVertical: 4 },
  step: { paddingLeft: 36, paddingBottom: 22, minHeight: 44 },
  stepLast: { paddingBottom: 0 },
  dot: { position: 'absolute', left: 0, top: 0, width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.kmLine, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: colors.green, borderColor: colors.green },
  line: { position: 'absolute', left: 10, top: 24, bottom: 2, width: 2, backgroundColor: colors.kmLine },
  lineOn: { backgroundColor: colors.green },
  stepTitle: { color: colors.kmGrey, fontWeight: '700', fontSize: 15 },
  stepTitleOn: { color: colors.kmNavy },
  partnerStatus: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.kmLine },
  partnerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.kmBlue },
  partnerLine: { fontSize: 15, fontWeight: '700', color: colors.kmNavy },
  partnerSub: { fontSize: 12.5, color: colors.kmSub, marginTop: 2 },
  stepSub: { color: colors.kmSub, fontSize: 13, marginTop: 3, lineHeight: 18 },
})
