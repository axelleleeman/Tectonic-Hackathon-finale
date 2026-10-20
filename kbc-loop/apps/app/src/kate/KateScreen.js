// Kate as a full-screen white page, as in KBC Mobile: slides up from the bottom (like an iOS modal)
// and covers everything, including the tab bar and the floating button.
// Open/closed lives in the shared state (state.kateOpen), so the web and presenter views stay in sync.
// Closing: ← and ×, swiping down on the header, Android back button (see LoopApp), Escape on the web,
// or navigating via a suggestion. The conversation only lives while the screen is open.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, Keyboard, KeyboardAvoidingView, PanResponder, Platform, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KateHeader } from './KateHeader.js'
import { KateIntro, KateMessage, Message } from './KateMessages.js'
import { KateChips } from './KateChips.js'
import { KateComposer } from './KateComposer.js'
import { greeting } from '@kbc-loop/shared/kate/conversation.js'
import { useKateChat } from './useKateChat.js'

const native = Platform.OS !== 'web'
const SWIPE_CLOSE = 100

function useKeyboardVisible() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const subs = [Keyboard.addListener(show, () => setVisible(true)), Keyboard.addListener(hide, () => setVisible(false))]
    return () => subs.forEach((s) => s.remove())
  }, [])
  return visible
}

function KateConversation({ customer, items, signals, actions, bottomInset }) {
  const chat = useKateChat({ items, signals, actions })
  const scroll = useRef(null)
  const keyboard = useKeyboardVisible()

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={native ? 'padding' : undefined}>
      <ScrollView ref={scroll} style={styles.flex} contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive"
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}>
        <KateIntro />
        <KateMessage>{greeting(customer)}</KateMessage>
        {chat.messages.map((m) => <Message key={m.id} from={m.from} text={m.text} />)}
        <KateChips chips={chat.chips} onChoose={chat.choose} busy={chat.busy} />
      </ScrollView>
      <View style={[styles.composer, { paddingBottom: (keyboard ? 0 : bottomInset) + 10 }]}>
        <KateComposer onSend={chat.ask} onVoice={chat.voice} disabled={chat.busy} />
      </View>
    </KeyboardAvoidingView>
  )
}

export function KateScreen({ open, customer, items, signals, actions }) {
  const insets = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const slide = useRef(new Animated.Value(0)).current
  const drag = useRef(new Animated.Value(0)).current
  // Closing via the buttons or a swipe slides away immediately, without waiting for the server.
  const [closing, setClosing] = useState(false)
  const visible = open && !closing
  const [mounted, setMounted] = useState(visible)

  useEffect(() => { if (open) setClosing(false) }, [open])

  useEffect(() => {
    if (visible) {
      setMounted(true)
      drag.setValue(0)
      Animated.timing(slide, { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: native }).start()
    } else {
      Keyboard.dismiss()
      Animated.timing(slide, { toValue: 0, duration: 240, easing: Easing.in(Easing.cubic), useNativeDriver: native })
        .start(({ finished }) => finished && setMounted(false))
    }
  }, [visible, slide, drag])

  const close = useMemo(() => () => { setClosing(true); actions.closeKate() }, [actions])

  // On the web the Escape key also closes Kate.
  useEffect(() => {
    if (native || !visible || typeof document === 'undefined') return undefined
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [visible, close])

  // Swiping down on the header closes Kate; a small movement springs back.
  const pan = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 8 && Math.abs(g.dy) > Math.abs(g.dx),
    onPanResponderMove: (_, g) => drag.setValue(Math.max(0, g.dy)),
    onPanResponderRelease: (_, g) => {
      if (g.dy > SWIPE_CLOSE || g.vy > 0.6) close()
      else Animated.spring(drag, { toValue: 0, useNativeDriver: native }).start()
    },
    onPanResponderTerminate: () => Animated.spring(drag, { toValue: 0, useNativeDriver: native }).start(),
  }), [drag, close])

  if (!mounted) return null

  const translateY = Animated.add(slide.interpolate({ inputRange: [0, 1], outputRange: [height, 0] }), drag)

  return (
    <Animated.View style={[styles.layer, { transform: [{ translateY }] }]} role="dialog" aria-label="Kate" aria-modal>
      <KateHeader top={insets.top} onClose={close} panHandlers={pan.panHandlers} />
      <KateConversation customer={customer} items={items} signals={signals} actions={actions} bottomInset={insets.bottom} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 50, elevation: 50 },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  composer: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: '#fff' },
})
