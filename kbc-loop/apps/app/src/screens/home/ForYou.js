// "For you": Kate tips from KBC Loop (signals, with their actions) and the MyLoop discovery card, all vivid.
// The generic KBC Mobile cards are exported separately (GenericTips) so Home can dim them with the next sections.
import { StyleSheet, View } from 'react-native'
import { PREVENTIVE_ISSUE } from '@kbc-loop/shared/data/index.js'
import { T } from '../../ui/T.js'
import { Glyph } from './icons.js'
import { CloseX, KateMark, Section, TextLink, shared } from './parts.js'
import { colors } from '../../theme.js'

// Generic KBC Mobile cards (shown dimmed, not interactive).
const GENERIC = [
  { id: 'tips', icon: 'mobile', text: 'Handy tips and tricks for your banking in KBC Mobile? Read them here.' },
  { id: 'coins', kate: true, text: 'With Kate Coins every purchase is a win: find out how it works.' },
]
function TipIcon({ name, kate }) {
  if (kate) return <View style={styles.kateIcon}><Glyph name="kate" size={20} color={colors.kmBlue} strokeWidth={2.2} /></View>
  return <Glyph name={name} size={30} color={colors.kmNavy} strokeWidth={1.3} />
}

function Tip({ icon, kate, title, text, link, onLink, onClose, closeLabel, isNew, device, stacked }) {
  return (
    <View style={styles.tipWrap}>
      {stacked ? <View style={styles.stack} /> : null}
      <View style={[shared.card, styles.tip, device && styles.device]}>
        <View style={styles.icon}><TipIcon name={icon} kate={kate} /></View>
        <View style={styles.body}>
          {title ? <View style={styles.titleRow}><KateMark size={15} /><T style={styles.title}>{title}</T></View> : null}
          <T style={styles.text}>{text}</T>
          {link ? <TextLink label={link} onPress={onLink} style={styles.link} /> : null}
        </View>
        {onClose ? <CloseX style={styles.x} onPress={onClose} label={closeLabel} /> : null}
      </View>
      {isNew ? <View style={styles.newDot} /> : null}
    </View>
  )
}

export function ForYou({ signals, consent, actions }) {
  const openSignal = (s) => (s.itemKey
    ? actions.reportDefect(s.itemKey, PREVENTIVE_ISSUE, true)
    : actions.navigate('product', { productId: s.productId, signalId: s.id, categoryId: null }))

  return (
    <Section compact title="For you" link="All communication">
      {signals.map((s) => {
        const device = s.source === 'toestel'
        return (
          <Tip key={s.id} isNew device={device} icon={device ? 'sensor' : 'loop'}
            title={device ? 'Your lamp is letting you know' : 'Kate tip'} text={s.headline}
            link={s.itemKey ? 'Schedule a free replacement' : 'View proposal'} onLink={() => openSignal(s)}
            onClose={device ? null : () => actions.dismissSignal(s.id)} closeLabel="Not interested" />
        )
      })}
      <Tip stacked icon="doc" title="Kate lets you know"
        text={consent
          ? 'New in KBC Mobile: MyLoop. Borrow instead of buying, repairs included.'
          : 'Personal tips are off. Kate does not use your transactions for proposals. You can still discover MyLoop.'}
        link="Discover MyLoop" onLink={() => actions.navigate('shop')} />
    </Section>
  )
}

/** The generic KBC Mobile cards that follow the KBC Loop tips (static; Home wraps them in <Dimmed>). */
export function GenericTips() {
  return (
    <View style={styles.generic}>
      {GENERIC.map((g) => <Tip key={g.id} icon={g.icon} kate={g.kate} text={g.text} />)}
    </View>
  )
}

const styles = StyleSheet.create({
  generic: { marginTop: 10 },
  tipWrap: { marginBottom: 14 },
  tip: { flexDirection: 'row', gap: 14, paddingVertical: 14, paddingLeft: 14, paddingRight: 16, borderRadius: 8 },
  device: { borderWidth: 1.5, borderColor: '#ffcf4d' },
  stack: { position: 'absolute', left: 6, right: 6, bottom: -7, height: 20, borderRadius: 8, backgroundColor: '#fff', boxShadow: '0px 2px 6px rgba(18, 40, 76, 0.10)' },
  icon: { width: 40, alignItems: 'center', paddingTop: 2 },
  kateIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#cde8f6', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 0px 6px rgba(0, 153, 216, 0.25)' },
  body: { flex: 1, paddingRight: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  title: { fontSize: 14, fontWeight: '700' },
  text: { fontSize: 16, lineHeight: 24, color: colors.kmNavy },
  link: { marginTop: 8, fontSize: 14 },
  x: { position: 'absolute', top: 12, right: 12 },
  newDot: { position: 'absolute', top: -3, left: -3, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.kmRed },
})
