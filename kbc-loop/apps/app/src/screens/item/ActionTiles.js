// The four large action tiles on the product detail (2×2): report a problem, upgrade, return, costs & contract.
// Tiles that do not apply (returned item, repair in progress, no upgrade available) are shown disabled
// with the reason as subtitle.
import { StyleSheet, View } from 'react-native'
import { COINS } from '@kbc-loop/shared/config/index.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { Glyph } from './Glyph.js'
import { cardShadow, colors } from '../../theme.js'


/** Which tiles are available for this item, and what they say. */
export function tilesFor(item, upgradeCount) {
  const repairing = Boolean(item.repair) && item.repair.step < 3
  const repairDone = Boolean(item.repair) && item.repair.step >= 3
  if (item.returned) {
    const off = 'Not available after return'
    return [
      { id: 'report', glyph: 'wrench', title: 'Report problem', sub: off, disabled: true },
      { id: 'upgrade', glyph: 'upgrade', title: 'Upgrade', sub: off, disabled: true },
      { id: 'return', glyph: 'returnBox', title: 'Returned', sub: 'Materials get a second life', disabled: true },
      { id: 'costs', glyph: 'receipt', title: 'Costs', sub: 'What you paid in total' },
    ]
  }
  return [
    repairing
      ? { id: 'report', glyph: 'wrench', title: 'Track repair', sub: `Step ${item.repair.step} of 3 · live status` }
      : repairDone
        ? { id: 'report', glyph: 'wrench', title: 'Repair done', sub: `Collect your +${COINS.repair} Kate Coins` }
        : { id: 'report', glyph: 'wrench', title: 'Report problem', sub: 'Free repair at your door' },
    repairing
      ? { id: 'upgrade', glyph: 'upgrade', title: 'Upgrade', sub: 'Available after the repair', disabled: true }
      : upgradeCount > 0
        ? { id: 'upgrade', glyph: 'upgrade', title: 'Upgrade', sub: `${upgradeCount} newer model${upgradeCount === 1 ? '' : 's'} available` }
        : { id: 'upgrade', glyph: 'upgrade', title: 'Upgrade', sub: 'You already have the top model', disabled: true },
    repairing
      ? { id: 'return', glyph: 'returnBox', title: 'Return', sub: 'Available after the repair', disabled: true }
      : { id: 'return', glyph: 'returnBox', title: 'Return', sub: `Free pickup · +${COINS.return} Kate Coins` },
    { id: 'costs', glyph: 'receipt', title: 'Costs', sub: 'Fee split, end date, savings' },
  ]
}

function Tile({ tile, onPress }) {
  return (
    <Press onPress={tile.disabled ? undefined : onPress} disabled={tile.disabled}
      label={`${tile.title}. ${tile.sub}${tile.disabled ? '. Not available' : ''}`}
      style={[styles.tile, tile.disabled && styles.tileOff]}>
      <View style={[styles.iconWrap, tile.disabled && styles.iconOff]}>
        <Glyph name={tile.glyph} size={26} color={tile.disabled ? colors.kmGrey : colors.kmBlue} strokeWidth={1.8} />
      </View>
      <T style={[styles.title, tile.disabled && styles.textOff]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>{tile.title}</T>
    </Press>
  )
}

export function ActionTiles({ tiles, onOpen }) {
  return (
    <View style={styles.grid}>
      {tiles.map((t) => <Tile key={t.id} tile={t} onPress={() => onOpen(t.id)} />)}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 24 },
  tile: { width: '47.5%', flexGrow: 1, height: 128, backgroundColor: '#fff', borderRadius: 18, padding: 16, alignItems: 'center', justifyContent: 'center', ...cardShadow },
  tileOff: { backgroundColor: '#f7f9fb', boxShadow: 'none', borderWidth: 1, borderColor: colors.kmLine },
  iconWrap: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.kmSky },
  iconOff: { backgroundColor: '#eef1f4' },
  title: { marginTop: 12, fontSize: 15, fontWeight: '700', color: colors.kmNavy },
  textOff: { color: colors.kmGrey },
})
