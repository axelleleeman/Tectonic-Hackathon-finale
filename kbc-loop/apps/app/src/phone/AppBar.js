// Header as in KBC Mobile, in three variants:
//  search: gear + Kate search bar (placeholder with magnifier and Kate label) + bell (Home)
//  title:  gear + large title + bell + Kate button (My KBC, Loop)
//  back:   back + title + Kate button (detail screens)
// Kate stays vivid (she helps with KBC Loop) and opens the Kate screen (see kate/KateScreen).
// The gear and the bell are not part of KBC Loop: they are dimmed and non-interactive.
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '../ui/Icon.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { Dimmed } from '../ui/Dimmed.js'
import { colors } from '../theme.js'

export const ROUND_SIZE = 44

function RoundButton({ icon, label, onPress, kate }) {
  return (
    <Press label={label} onPress={onPress} style={[styles.round, kate && styles.roundKate]}>
      <Icon name={icon} size={kate ? 22 : 20} color={kate ? colors.kmBlue : colors.kmNavy} />
    </Press>
  )
}

/** A KBC Mobile header button that is not part of the demo: dimmed and non-interactive. */
function DimmedRound({ icon, dot }) {
  return (
    <Dimmed radius={ROUND_SIZE / 2}>
      <View style={styles.round}>
        <Icon name={icon} size={20} color={colors.kmNavy} />
        {dot ? <View style={styles.dot} /> : null}
      </View>
    </Dimmed>
  )
}

/** The Kate mark: blue lines in a light-blue circle. */
export function KateMark({ size = 11 }) {
  const d = Math.round(size * 1.6)
  return (
    <View style={[styles.kateMark, { width: d, height: d, borderRadius: d / 2 }]}>
      <Icon name="kate" size={size} color={colors.kmBlue} />
    </View>
  )
}

/** "Kate" with its mark, as on the right of the search bar. */
export function KateLabel() {
  return <View style={styles.kateWord}><KateMark /><T style={styles.kateText}>Kate</T></View>
}

export function AppBar({ variant, title, placeholder, onBack, onKate }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.appbar, { paddingTop: insets.top + 6 }]} role="banner">
      {variant === 'search' ? (
        <>
          <DimmedRound icon="gear" />
          <Press style={styles.search} onPress={onKate} label={`Ask Kate: ${placeholder}`}>
            <Icon name="search" size={18} color={colors.kmGrey} />
            <T style={styles.placeholder} numberOfLines={1}>{placeholder}</T>
            <KateLabel />
          </Press>
          <DimmedRound icon="bell" dot />
        </>
      ) : (
        <>
          {variant === 'back'
            ? <RoundButton icon="back" label="Back" onPress={onBack} />
            : <DimmedRound icon="gear" />}
          <T style={variant === 'title' ? styles.titleBig : styles.titleBack} role="heading" numberOfLines={1}>{title}</T>
          {variant === 'title' ? <DimmedRound icon="bell" dot /> : null}
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
