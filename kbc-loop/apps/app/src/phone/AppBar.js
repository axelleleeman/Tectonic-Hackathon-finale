// Kopbalk zoals in KBC Mobile, in drie varianten:
//  search: tandwiel + Kate-zoekbalk ("Hoe kan ik je helpen?" met vergrootglas en Kate-label) + belletje (Start)
//  title:  tandwiel + grote titel + belletje + Kate-knop (Mijn KBC, Aanbod)
//  back:   terug + titel + Kate-knop (detailschermen)
// Tikken op de zoekbalk of de Kate-knop opent het Kate-scherm (zie kate/KateScreen).
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '../ui/Icon.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { colors } from '../theme.js'

export const ROUND_SIZE = 44

function RoundButton({ icon, label, onPress, dot, kate }) {
  return (
    <Press label={label} onPress={onPress} style={[styles.round, kate && styles.roundKate]} focusable={Boolean(onPress)}>
      <Icon name={icon} size={kate ? 22 : 20} color={kate ? colors.kmBlue : colors.kmNavy} />
      {dot ? <View style={styles.dot} /> : null}
    </Press>
  )
}

/** Het Kate-merkje: blauwe lijntjes in een lichtblauw rondje. */
export function KateMark({ size = 11 }) {
  const d = Math.round(size * 1.6)
  return (
    <View style={[styles.kateMark, { width: d, height: d, borderRadius: d / 2 }]}>
      <Icon name="kate" size={size} color={colors.kmBlue} />
    </View>
  )
}

/** "Kate" met merkje, zoals rechts in de zoekbalk. */
export function KateLabel() {
  return <View style={styles.kateWord}><KateMark /><T style={styles.kateText}>Kate</T></View>
}

export function AppBar({ variant, title, placeholder, onBack, onKate }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.appbar, { paddingTop: insets.top + 6 }]} role="banner">
      {variant === 'search' ? (
        <>
          <RoundButton icon="gear" label="Instellingen" />
          <Press style={styles.search} onPress={onKate} label={`Kate: ${placeholder}`}>
            <Icon name="search" size={18} color={colors.kmGrey} />
            <T style={styles.placeholder} numberOfLines={1}>{placeholder}</T>
            <KateLabel />
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
  appbar: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', paddingHorizontal: 16, paddingBottom: 12, zIndex: 2 },
  round: {
    width: ROUND_SIZE, height: ROUND_SIZE, borderRadius: ROUND_SIZE / 2, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0px 4px 16px rgba(18, 40, 76, 0.12)',
  },
  roundKate: { boxShadow: '0px 0px 0px 1.5px #cfe6f7, 0px 4px 16px rgba(18, 40, 76, 0.12)' },
  dot: { position: 'absolute', top: 7, right: 7, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.kmRed },
  search: {
    flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 6, height: 44, paddingHorizontal: 12,
    borderWidth: 1.5, borderColor: '#c9def0', borderRadius: 99, backgroundColor: '#fff',
  },
  placeholder: { flex: 1, color: colors.kmGrey, fontSize: 15 },
  kateWord: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  kateText: { fontSize: 17, fontWeight: '800', color: colors.kmNavy },
  kateMark: { backgroundColor: '#e3f3fb', alignItems: 'center', justifyContent: 'center' },
  titleBig: { flex: 1, fontSize: 28, fontWeight: '800', color: colors.kmNavy },
  titleBack: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: colors.kmNavy },
})
