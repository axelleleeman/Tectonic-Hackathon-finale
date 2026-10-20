// Consent screen: choose what happens with your data. Nothing optional is shared unless switched on;
// "Not now" and "Save choices" have equal weight on purpose.
// ConsentCard is the calm prompt at the top of Loop > Home until the choices are saved.
import { useState } from 'react'
import { StyleSheet, Switch, View } from 'react-native'
import { CHOICES, NEVER } from '@kbc-loop/shared/data/dataChoices.js'
import { Icon } from '../../ui/Icon.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { cardShadow, colors } from '../../theme.js'

function Button({ label, onPress, primary, disabled }) {
  return (
    <Press onPress={disabled ? undefined : onPress} label={label} style={[styles.btn, primary && styles.btnPrimary]}>
      <T style={[styles.btnText, primary && styles.btnTextPrimary]}>{label}</T>
    </Press>
  )
}

export function ConsentCard({ preferences, onReview }) {
  if (!preferences || preferences.completedOn) return null
  return (
    <View style={[styles.card, styles.banner]}>
      <View style={styles.badge}><Icon name="list" size={18} color={colors.kmBlue} /></View>
      <View style={styles.text}>
        <T style={styles.title} role="heading">Complete your profile</T>
        <T style={styles.sub}>Choose what happens with your data.</T>
      </View>
      <Button label="Review" onPress={onReview} />
    </View>
  )
}

export function ConsentScreen({ preferences = {}, actions }) {
  const [prefs, setPrefs] = useState(() => Object.fromEntries(CHOICES.map((c) => [c.key, preferences[c.key] === true])))
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const back = () => actions.navigate('shop')

  const save = async () => {
    setBusy(true)
    await actions.setDataPreferences(prefs)
    setBusy(false)
    setSaved(true)
  }

  return (
    <View style={styles.wrap}>
      <T style={styles.h1} role="heading">Choose what happens with your data</T>
      <T style={styles.lead}>KBC Loop works with the products you borrow. You decide what we may use and who sees it. Nothing beyond what the service needs is shared unless you switch it on.</T>

      {saved ? (
        <View style={[styles.card, styles.done]} accessibilityLiveRegion="polite">
          <T style={styles.title}>Your choices are saved</T>
          <T style={styles.sub}>You can change them here at any time.</T>
          <View style={styles.actions}><Button label="Back to Loop" primary onPress={back} /></View>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            {CHOICES.map((c, n) => (
              <View key={c.key} style={[styles.row, n > 0 && styles.rowLine]}>
                <View style={styles.text}>
                  <T style={styles.title}>{c.title}</T>
                  <T style={styles.sub}>{c.what} {c.who}</T>
                </View>
                <Switch value={prefs[c.key]} onValueChange={(v) => setPrefs((p) => ({ ...p, [c.key]: v }))}
                  accessibilityLabel={c.title} accessibilityHint={c.what} trackColor={{ true: colors.kmBlue, false: colors.kmLine }} thumbColor="#ffffff" activeThumbColor="#ffffff" />
              </View>
            ))}
          </View>
          <View style={styles.actions}>
            <Button label="Not now" onPress={back} />
            <Button label="Save choices" disabled={busy} onPress={save} />
          </View>
        </>
      )}

      <T style={styles.h2} role="heading">What we never do</T>
      {NEVER.map((n) => (
        <View key={n} style={styles.never}>
          <Icon name="heart" size={14} color={colors.kmGreen} />
          <T style={styles.neverText}>{n}</T>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: 12, paddingTop: 8 },
  h1: { fontSize: 22, fontWeight: '700' },
  lead: { color: colors.kmSub, lineHeight: 21 },
  h2: { fontSize: 16, fontWeight: '700', marginTop: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, ...cardShadow },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginTop: 16 },
  badge: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.kmSky, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 14 },
  rowLine: { borderTopWidth: 1, borderTopColor: colors.kmLine },
  text: { flex: 1, minWidth: 0 },
  title: { fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 13, color: colors.kmSub, marginTop: 2, lineHeight: 18 },
  done: { padding: 16 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
  btn: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 18, borderRadius: 99, borderWidth: 1.5, borderColor: colors.button },
  btnPrimary: { backgroundColor: colors.button },
  btnText: { fontSize: 14, fontWeight: '600', color: colors.button },
  btnTextPrimary: { color: '#fff' },
  never: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  neverText: { flex: 1, color: colors.kmSub, fontSize: 14 },
})
