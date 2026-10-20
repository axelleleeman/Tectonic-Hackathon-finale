// "Tips from Kate" on Loop > Home: every current Kate signal as a calm card with a title, one line,
// the main action, "Dismiss" and a "Why?" toggle that lists the reasons behind the tip.
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { PREVENTIVE_ISSUE } from '@kbc-loop/shared/data/index.js'
import { Card } from '../../ui/Card.js'
import { KateAvatar } from '../../ui/KateAvatar.js'
import { Press } from '../../ui/Press.js'
import { SectionHeader } from '../../ui/SectionHeader.js'
import { T } from '../../ui/T.js'
import { TAP, font, radius, space } from '../../ui/tokens.js'
import { colors } from '../../theme.js'

function titleOf(signal) {
  if (signal.notification?.title) return signal.notification.title
  return signal.source === 'toestel' ? 'Your light needs attention' : 'A tip for you'
}

function Tip({ signal, actions }) {
  const [why, setWhy] = useState(false)
  const device = Boolean(signal.itemKey)
  const open = () => (device
    ? actions.reportDefect(signal.itemKey, PREVENTIVE_ISSUE, true)
    : actions.navigate('product', { productId: signal.productId, signalId: signal.id, categoryId: null }))
  const cta = device ? 'Schedule replacement' : 'View proposal'
  const reasons = signal.reasons ?? []

  return (
    <Card style={styles.card}>
      <T style={styles.title} numberOfLines={2}>{titleOf(signal)}</T>
      <T style={styles.text} numberOfLines={why ? undefined : 2}>{signal.headline}</T>
      {why && reasons.length ? (
        <View style={styles.reasons} role="list">
          {reasons.map((r) => (
            <View key={r} style={styles.reason} role="listitem">
              <View style={styles.bullet} aria-hidden />
              <T style={styles.reasonText}>{r}</T>
            </View>
          ))}
        </View>
      ) : null}
      <View style={styles.actions}>
        <Press onPress={open} style={styles.cta} label={`${cta}: ${titleOf(signal)}`}>
          <T style={styles.ctaText}>{cta}</T>
        </Press>
        {reasons.length ? (
          <Press onPress={() => setWhy((v) => !v)} style={styles.link} label={why ? 'Hide why Kate suggests this' : 'Why does Kate suggest this?'}
            aria-expanded={why}>
            <T style={styles.linkText}>{why ? 'Hide' : 'Why?'}</T>
          </Press>
        ) : null}
        <Press onPress={() => actions.dismissSignal(signal.id)} style={styles.link} label={`Dismiss tip: ${titleOf(signal)}`}>
          <T style={styles.linkText}>Dismiss</T>
        </Press>
      </View>
    </Card>
  )
}

export function KateTips({ signals, actions }) {
  const list = signals ?? []
  return (
    <View style={styles.section}>
      <SectionHeader title="Tips from Kate" leading={<KateAvatar size={26} />} />
      {list.length === 0
        ? <T style={styles.empty}>No new tips. Kate lets you know when something can save you money.</T>
        : list.map((s) => <Tip key={s.id} signal={s} actions={actions} />)}
    </View>
  )
}

const styles = StyleSheet.create({
  section: { marginTop: space.xl },
  card: { marginBottom: space.md },
  title: { ...font.label, color: colors.kmNavy },
  text: { ...font.caption, color: colors.kmSub, lineHeight: 19, marginTop: space.xs },
  reasons: { marginTop: space.md, gap: space.sm },
  reason: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  bullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.kmBlue, marginTop: 7 },
  reasonText: { ...font.caption, flex: 1, color: colors.kmNavy, lineHeight: 19 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: space.xs, marginTop: space.md },
  cta: { minHeight: TAP - 8, justifyContent: 'center', paddingHorizontal: space.lg, borderRadius: radius.pill, backgroundColor: colors.button },
  ctaText: { ...font.caption, fontWeight: '700', color: '#fff' },
  link: { minHeight: TAP, minWidth: TAP, justifyContent: 'center', alignItems: 'center', paddingHorizontal: space.sm },
  linkText: { ...font.caption, fontWeight: '600', color: colors.kmBlue },
  empty: { ...font.caption, color: colors.kmSub },
})
