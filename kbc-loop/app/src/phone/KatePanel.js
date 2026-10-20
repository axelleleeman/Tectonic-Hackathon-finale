// Kate in de kopbalk, zoals in KBC Mobile: de zoekbalk bovenaan wordt een invoerveld en
// daaronder klapt een paneel open met Kate's begroeting, antwoord en suggesties.
// Sluiten kan met ×, door buiten het paneel te tikken, door het paneel omhoog te vegen,
// met de Android-terugknop (zie LoopApp), met Escape op het web en door via een suggestie te navigeren.
// Open/dicht staat in de gedeelde state (state.kateOpen), zodat web en presentatiemodus mee volgen.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, PanResponder, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { matchIntent } from '@kbc-loop/shared/engine/kateIntents.js'
import { KateAvatar } from '../ui/KateAvatar.js'
import { Icon } from '../ui/Icon.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { colors } from '../theme.js'

const native = Platform.OS !== 'web'
const fill = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }
const SWIPE_CLOSE = -50

function KateMsg({ children }) {
  return (
    <View style={styles.msg}>
      <KateAvatar />
      <View style={styles.bubble}><T style={styles.bubbleText}>{children}</T></View>
    </View>
  )
}

export function KatePanel({ customer, items, signals, actions, placeholder = 'Hoe kan ik je helpen?' }) {
  const insets = useSafeAreaInsets()
  const [text, setText] = useState('')
  const [reply, setReply] = useState(null)
  const appear = useRef(new Animated.Value(0)).current
  const drag = useRef(new Animated.Value(0)).current
  const fixable = items.find((i) => !i.returned && !i.repair)
  const tip = signals.find((s) => s.productId)

  useEffect(() => {
    Animated.timing(appear, { toValue: 1, duration: 220, useNativeDriver: native }).start()
  }, [appear])

  // Op het web sluit ook de Escape-toets Kate.
  useEffect(() => {
    if (native || typeof document === 'undefined') return undefined
    const onKey = (e) => e.key === 'Escape' && actions.closeKate()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [actions])

  // Omhoog vegen sluit Kate; een kleine beweging veert terug.
  const pan = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy < -8 && Math.abs(g.dy) > Math.abs(g.dx),
    onPanResponderMove: (_, g) => drag.setValue(Math.min(0, g.dy)),
    onPanResponderRelease: (_, g) => {
      if (g.dy < SWIPE_CLOSE || g.vy < -0.5) {
        Animated.timing(drag, { toValue: -400, duration: 160, useNativeDriver: native }).start(() => actions.closeKate())
      } else {
        Animated.spring(drag, { toValue: 0, useNativeDriver: native }).start()
      }
    },
    onPanResponderTerminate: () => Animated.spring(drag, { toValue: 0, useNativeDriver: native }).start(),
  }), [drag, actions])

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
    if (!text.trim()) return
    const intent = matchIntent(text)
    if (intent) handlers[intent]()
    else setReply('Dat begrijp ik nog niet. Probeer bv. “mijn lamp flikkert”.')
  }

  const slide = {
    opacity: appear,
    transform: [{ translateY: Animated.add(appear.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }), drag) }],
  }

  return (
    <View style={styles.layer}>
      <Animated.View style={[styles.backdrop, { opacity: appear }]}>
        <Pressable style={fill} onPress={actions.closeKate} aria-label="Sluit Kate" />
      </Animated.View>
      <Animated.View style={[styles.panel, { paddingTop: insets.top + 6 }, slide]} role="dialog" aria-label="Kate" {...pan.panHandlers}>
        <View style={styles.bar}>
          <View style={styles.field}>
            <Icon name="search" size={18} color={colors.kmGrey} />
            <TextInput value={text} onChangeText={setText} placeholder={placeholder} placeholderTextColor={colors.kmGrey}
              aria-label="Vraag aan Kate" style={styles.input} onSubmitEditing={submit} returnKeyType="send" autoFocus />
            <Press style={styles.send} onPress={submit} label="Verstuur"><Icon name="send" size={16} color="#fff" /></Press>
          </View>
          <Press style={styles.close} onPress={actions.closeKate} label="Sluiten"><Icon name="close" size={18} /></Press>
        </View>

        <View style={styles.body}>
          <KateMsg>Dag {customer.name}, ik ben Kate. Waarmee kan ik je helpen?</KateMsg>
          {reply ? <KateMsg>{reply}</KateMsg> : null}
          <View style={styles.chips}>
            {chips.map(([label, intent]) => (
              <Press key={label} style={styles.chip} onPress={handlers[intent]}><T style={styles.chipText}>{label}</T></Press>
            ))}
          </View>
        </View>
        <Press style={styles.grip} onPress={actions.closeKate} label="Sluiten"><View style={styles.gripBar} /></Press>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  layer: { ...fill, zIndex: 20, elevation: 20 },
  backdrop: { ...fill, backgroundColor: 'rgba(0, 20, 40, 0.35)' },
  panel: {
    position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff', paddingHorizontal: 16,
    borderBottomLeftRadius: 22, borderBottomRightRadius: 22, boxShadow: '0px 10px 24px rgba(18, 40, 76, 0.2)',
  },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  field: {
    flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingLeft: 12, paddingRight: 5,
    borderWidth: 1.5, borderColor: colors.kmBlue, borderRadius: 99, backgroundColor: '#fff',
  },
  input: { flex: 1, minWidth: 0, fontSize: 15, color: colors.ink, paddingVertical: 6, outlineStyle: 'none' },
  send: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  close: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 2px 10px rgba(18, 40, 76, 0.12)' },
  body: { paddingTop: 16 },
  msg: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 8 },
  bubble: { flexShrink: 1, backgroundColor: '#eef4f9', paddingVertical: 10, paddingHorizontal: 12, borderTopLeftRadius: 4, borderTopRightRadius: 14, borderBottomRightRadius: 14, borderBottomLeftRadius: 14 },
  bubbleText: { fontSize: 14, color: colors.ink, lineHeight: 20 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  chip: { borderWidth: 1.5, borderColor: colors.navy, borderRadius: 99, paddingVertical: 7, paddingHorizontal: 12 },
  chipText: { color: colors.navy, fontSize: 13, fontWeight: '600' },
  grip: { alignSelf: 'center', paddingTop: 14, paddingBottom: 10, paddingHorizontal: 30 },
  gripBar: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.line },
})
