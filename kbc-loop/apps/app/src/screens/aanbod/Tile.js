// Tiles and tile rows of the Loop tab (KBC products, Themes, Mobility …).
// A tile with onPress belongs to KBC Loop and is tappable; without onPress it is wrapped in <Dimmed>.
import { ScrollView, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { BadgeNew, HeadLink, SectionHead } from '../common.js'
import { LineIcon } from '../mykbc/icons.js'
import { StaticHeadLink } from '../mykbc/shared.js'
import { Dimmed } from '../../ui/Dimmed.js'
import { cardShadow, colors } from '../../theme.js'

/** Colour swatches for the theme icons (neutral, no brand imagery). */
export const SWATCH = {
  loop: ['#2fd3b8', '#0b8fc4'],
  navy: ['#2c6db5', '#123f7a'],
  blue: ['#1aa8e6', '#0a74c4'],
  green: ['#45c46a', '#1f9a48'],
  yellow: ['#ffd23f', '#f2b705'],
}

/** Tile artwork: a line icon in KBC blue, a white icon on a swatch, or an emoji on a swatch. */
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
  const body = (
    <>
      {isNew ? <BadgeNew style={styles.badge} /> : null}
      <TileArt icon={icon} emoji={emoji} swatch={swatch} />
      <T style={styles.label} numberOfLines={2}>{label}</T>
    </>
  )
  if (!onPress) return <Dimmed radius={10}><View style={styles.tile}>{body}</View></Dimmed>
  return <Press style={[styles.tile, styles.loopTile]} onPress={onPress} label={a11y ?? label}>{body}</Press>
}

/** Section with a heading and horizontally scrolling tiles. `onAll` makes "Show all" tappable (KBC Loop only). */
export function TileRow({ title, onAll, showAll = true, children }) {
  const right = !showAll ? null
    : onAll ? <HeadLink onPress={onAll} label={`${title}: show all KBC Loop products`}>Show all</HeadLink>
      : <Dimmed><StaticHeadLink>Show all</StaticHeadLink></Dimmed>
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
  bleed: { marginHorizontal: -16, flexGrow: 0 },
  row: { gap: 12, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 },
  tile: { width: 104, height: 116, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 6, ...cardShadow },
  loopTile: { borderWidth: 1.5, borderColor: '#9fdcf3' },
  badge: { position: 'absolute', top: -9, alignSelf: 'center', paddingVertical: 3, paddingHorizontal: 9 },
  swatch: { width: 50, height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 26, lineHeight: 32 },
  lineArt: { height: 50, justifyContent: 'center' },
  label: { fontSize: 13.5, lineHeight: 17, textAlign: 'center' },
})
