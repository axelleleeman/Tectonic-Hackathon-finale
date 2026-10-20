// Kopbalk zoals in KBC Mobile, in drie varianten:
//  search: tandwiel + Kate-zoekbalk + belletje (Start)
//  title:  tandwiel + grote titel + belletje + Kate (Mijn KBC, Aanbod)
//  back:   terug + titel + Kate (detailschermen)
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '../ui/Icon.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { colors } from '../theme.js'

function RoundButton({ icon, label, onPress, dot, kate }) {
  return (
    <Press label={label} onPress={onPress} style={[styles.round, kate && styles.roundKate]} focusable={Boolean(onPress)}>
      <Icon name={icon} size={20} color={kate ? colors.kmBlue : colors.kmNavy} />
      {dot ? <View style={styles.dot} /> : null}
    </Press>
  )
}

export function KateMark({ size = 11 }) {
  return <View style={styles.kateMark}><Icon name="kate" size={size} color={colors.kmBlue} /></View>
}

export function AppBar({ variant, title, placeholder, onBack, onKate }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.appbar, { paddingTop: insets.top + 6 }]} role="banner">
      {variant === 'search' ? (
        <>
          <RoundButton icon="gear" label="Instellingen" />
          <Press style={styles.search} onPress={onKate} label={placeholder}>
            <Icon name="search" size={18} color={colors.kmGrey} />
            <T style={styles.placeholder} numberOfLines={1}>{placeholder}</T>
            <View style={styles.kateWord}><KateMark /><T style={styles.kateText}>Kate</T></View>
          </Press>
          <RoundButton icon="bell" label="Berichten" dot />
        </>
      ) : (
        <>
          {variant === 'back'
            ? <RoundButton icon="back" label="Terug" onPress={onBack} />
            : <RoundButton icon="gear" label="Instellingen" />}
          <T style={variant === 'title' ? styles.titleBig : styles.titleBack} role="heading" numberOfLines={1}>{title}</T>
          {variant === 'title' ? <RoundButton icon="bell" label="Berichten" dot /> : null}
          <RoundButton icon="kate" label="Open Kate" onPress={onKate} kate />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  appbar: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff',
    paddingHorizontal: 14, paddingBottom: 12, zIndex: 2,
    boxShadow: '0px 6px 14px -10px rgba(18, 40, 76, 0.25)',
  },
  round: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0px 2px 10px rgba(18, 40, 76, 0.12)',
  },
  roundKate: { boxShadow: '0px 0px 0px 1.5px #cfe6f7, 0px 2px 10px rgba(18, 40, 76, 0.12)' },
  dot: { position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.kmRed },
  search: {
    flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 6, height: 42, paddingHorizontal: 12,
    borderWidth: 1.5, borderColor: '#cfe2f3', borderRadius: 99, backgroundColor: '#fff',
  },
  placeholder: { flex: 1, color: colors.kmGrey, fontSize: 14 },
  kateWord: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  kateText: { fontSize: 16, fontWeight: '800', color: colors.kmNavy },
  kateMark: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#e3f3fb', alignItems: 'center', justifyContent: 'center' },
  titleBig: { flex: 1, fontSize: 26, fontWeight: '800', color: colors.kmNavy },
  titleBack: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: colors.kmNavy },
})
