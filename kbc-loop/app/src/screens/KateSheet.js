// Kate als onderblad: snelle keuzes (chips) en een tekstveld dat via matchIntent herkend wordt.
import { useEffect, useRef, useState } from 'react'
import { Animated, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { matchIntent } from '@kbc-loop/shared/engine/kateIntents.js'
import { KateAvatar } from '../ui/KateAvatar.js'
import { Icon } from '../ui/Icon.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { colors } from '../theme.js'

const native = Platform.OS !== 'web'
const fill = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }

function KateMsg({ children }) {
  return (
    <View style={styles.msg}>
      <KateAvatar />
      <View style={styles.bubble}><T style={styles.bubbleText}>{children}</T></View>
    </View>
  )
}

export function KateSheet({ customer, items, signals, actions }) {
  const insets = useSafeAreaInsets()
  const [text, setText] = useState('')
  const [reply, setReply] = useState(null)
  const anim = useRef(new Animated.Value(0)).current
  const fixable = items.find((i) => !i.returned && !i.repair)
  const tip = signals.find((s) => s.productId)

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: native }).start()
  }, [anim])

  const handlers = {
    defect: () => (fixable ? actions.navigate('repair', { itemKey: fixable.key }) : setReply('Je leent nog niets dat ik kan laten herstellen.')),
    overview: () => actions.navigate('mykbc'),
    tip: () => (tip ? actions.navigate('product', { productId: tip.productId, signalId: tip.id }) : setReply('Ik heb op dit moment geen nieuwe tip voor je.')),
  }

  const chips = [
    fixable && ['Er is iets kapot', 'defect'],
    tip && ['Heb je een tip voor mij?', 'tip'],
    ['Wat leen ik via KBC Loop?', 'overview'],
  ].filter(Boolean)

  const submit = () => {
    const intent = matchIntent(text)
    if (intent) handlers[intent]()
    else setReply('Dat begrijp ik nog niet. Probeer bv. “mijn lamp flikkert”.')
  }

  const slide = { transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }], opacity: anim }

  return (
    <KeyboardAvoidingView style={styles.layer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Animated.View style={[styles.backdrop, { opacity: anim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={actions.closeKate} aria-label="Sluit Kate" />
      </Animated.View>
      <Animated.View style={[styles.sheet, { paddingBottom: 24 + insets.bottom }, slide]} role="dialog" aria-label="Kate">
        <View style={styles.grip} />
        <KateMsg>Dag {customer.name}, ik ben Kate. Waarmee kan ik je helpen?</KateMsg>
        {reply ? <KateMsg>{reply}</KateMsg> : null}
        <View style={styles.chips}>
          {chips.map(([label, intent]) => (
            <Press key={label} style={styles.chip} onPress={handlers[intent]}><T style={styles.chipText}>{label}</T></Press>
          ))}
        </View>
        <View style={styles.input}>
          <TextInput value={text} onChangeText={setText} placeholder="Typ je vraag aan Kate…" placeholderTextColor={colors.muted}
            aria-label="Vraag aan Kate" style={styles.field} onSubmitEditing={submit} returnKeyType="send" />
          <Press style={styles.send} onPress={submit} label="Verstuur"><Icon name="send" size={18} color="#fff" /></Press>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  layer: { ...fill, zIndex: 20, elevation: 20 },
  backdrop: { ...fill, backgroundColor: 'rgba(0, 20, 40, 0.35)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingTop: 10, paddingHorizontal: 16 },
  grip: { width: 40, height: 4, backgroundColor: colors.line, borderRadius: 2, alignSelf: 'center', marginBottom: 14 },
  msg: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 8 },
  bubble: { flexShrink: 1, backgroundColor: '#eef4f9', paddingVertical: 10, paddingHorizontal: 12, borderTopLeftRadius: 4, borderTopRightRadius: 14, borderBottomRightRadius: 14, borderBottomLeftRadius: 14 },
  bubbleText: { fontSize: 14, color: colors.ink, lineHeight: 20 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12 },
  chip: { borderWidth: 1.5, borderColor: colors.navy, borderRadius: 99, paddingVertical: 7, paddingHorizontal: 12 },
  chipText: { color: colors.navy, fontSize: 13, fontWeight: '600' },
  input: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 99, paddingVertical: 4, paddingRight: 4, paddingLeft: 14 },
  field: { flex: 1, fontSize: 14, color: colors.ink, paddingVertical: 6, outlineStyle: 'none' },
  send: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
})
