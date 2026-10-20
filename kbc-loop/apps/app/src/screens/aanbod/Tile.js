// Tegels en tegelrijen van het tabblad Aanbod (KBC-Producten, Thema's, Mobiliteit …).
// Een tegel met onPress hoort bij KBC Loop en is klikbaar; zonder onPress is ze gedempt.
import { ScrollView, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { BadgeNew, HeadLink, SectionHead } from '../common.js'
import { LineIcon } from '../mykbc/icons.js'
import { MUTED_OPACITY, MutedHeadLink } from '../mykbc/shared.js'
import { cardShadow, colors } from '../../theme.js'

/** Kleurvlakken voor de thema-iconen (neutraal, geen merkbeelden). */
export const SWATCH = {
  loop: ['#2fd3b8', '#0b8fc4'],
  navy: ['#2c6db5', '#123f7a'],
  blue: ['#1aa8e6', '#0a74c4'],
  green: ['#45c46a', '#1f9a48'],
  yellow: ['#ffd23f', '#f2b705'],
}

/** Pictogram van een tegel: lijn-icoon in KBC-blauw, wit icoon op een kleurvlak, of een emoji op een kleurvlak. */
export function TileArt({ icon, emoji, swatch, size = 40 }) {
  if (swatch) {
    return (
      <LinearGradient colors={swatch} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={styles.swatch}>
        {emoji ? <T style={styles.emoji}>{emoji}</T> : <LineIcon name={icon} size={30} color="#fff" />}
      </LinearGradient>
    )
  }
  return <View style={styles.lineArt}><LineIcon name={icon} size={size} color={colors.kmBlue} strokeWidth={1.5} /></View>
}

export function Tile({ label, icon, emoji, swatch, isNew = false, onPress, a11y }) {
  const muted = !onPress
  const body = (
    <>
      {isNew ? <BadgeNew style={[styles.badge, muted && styles.muted]} /> : null}
      <View style={muted && styles.muted}><TileArt icon={icon} emoji={emoji} swatch={swatch} /></View>
      <T style={[styles.label, muted && styles.muted]} numberOfLines={2}>{label}</T>
    </>
  )
  if (muted) return <View style={styles.tile}>{body}</View>
  return <Press style={styles.tile} onPress={onPress} label={a11y ?? label}>{body}</Press>
}

/** Sectie met kop en horizontaal scrollende tegels. `onAll` maakt "Alles tonen" klikbaar (alleen KBC Loop). */
export function TileRow({ title, onAll, showAll = true, children }) {
  const right = !showAll ? null : onAll ? <HeadLink onPress={onAll}>Alles tonen</HeadLink> : <MutedHeadLink>Alles tonen</MutedHeadLink>
  return (
    <View>
      <SectionHead title={title} right={right} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.row}>
        {children}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  muted: { opacity: MUTED_OPACITY },
  bleed: { marginHorizontal: -16, flexGrow: 0 },
  row: { gap: 12, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 },
  tile: { width: 104, height: 116, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 6, ...cardShadow },
  badge: { position: 'absolute', top: -9, alignSelf: 'center', paddingVertical: 3, paddingHorizontal: 9 },
  swatch: { width: 50, height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 26, lineHeight: 32 },
  lineArt: { height: 50, justifyContent: 'center' },
  label: { fontSize: 13.5, lineHeight: 17, textAlign: 'center' },
})
