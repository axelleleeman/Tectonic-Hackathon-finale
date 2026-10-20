// "Verdien hier Kate Coins": kaarten met beeld en een beloning in KTC. De KBC Loop-kaarten
// (herstellen en inleveren) zijn klikbaar en leiden naar je geleende producten in Mijn KBC;
// de andere acties zijn fictief, zonder merklogo's, en gedempt.
import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COINS } from '@kbc-loop/shared/config/index.js'
import { Amount } from '../../ui/Amount.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { LineIcon } from '../mykbc/icons.js'
import { MUTED_OPACITY } from '../mykbc/shared.js'
import { TileRow } from './Tile.js'
import { cardShadow, colors } from '../../theme.js'

const OTHER_OFFERS = [
  { id: 'super', name: 'Supermarkt-actie', icon: 'gift', art: ['#f6c9a8', '#d98d5f'], reward: null },
  { id: 'schoenen', name: 'Schoenenwinkel', icon: 'heart', art: ['#d9c7a8', '#9c7f57'], reward: 20 },
  { id: 'testrit', name: 'Testrit elektrische wagen', icon: 'car', art: ['#a9c6d8', '#5d89a6'], reward: 15 },
]

function OfferCard({ name, icon, art, reward, onPress, a11y }) {
  const muted = !onPress
  const body = (
    <>
      <LinearGradient colors={art} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.art}>
        <View style={styles.logo}><LineIcon name={icon} size={24} color={colors.kmNavy} /></View>
      </LinearGradient>
      <View style={[styles.band, muted && styles.bandMuted]}>
        <T style={styles.name} numberOfLines={2}>{name}</T>
        {reward
          ? <View style={styles.reward}><T style={styles.rewardText}>+</T><Amount value={reward} unit="KTC" style={styles.rewardText} /></View>
          : <T style={styles.rewardText}>Ontdek beloning</T>}
      </View>
    </>
  )
  if (muted) return <View style={[styles.card, styles.muted]}>{body}</View>
  return <Press style={styles.card} onPress={onPress} label={a11y}>{body}</Press>
}

export function CoinOffersSection({ onMyLoop }) {
  return (
    <TileRow title="Verdien hier Kate Coins">
      <OfferCard name="KBC Loop: herstellen" icon="loop" art={['#2fd3b8', '#0b8fc4']} reward={COINS.repair}
        a11y={`KBC Loop: verdien ${COINS.repair} Kate Coins door te laten herstellen`} onPress={onMyLoop} />
      <OfferCard name="KBC Loop: inleveren" icon="loop" art={['#7bed9f', '#10ac84']} reward={COINS.return}
        a11y={`KBC Loop: verdien ${COINS.return} Kate Coins door in te leveren`} onPress={onMyLoop} />
      {OTHER_OFFERS.map((o) => <OfferCard key={o.id} {...o} />)}
    </TileRow>
  )
}

const styles = StyleSheet.create({
  muted: { opacity: MUTED_OPACITY },
  card: { width: 104, height: 162, borderRadius: 10, overflow: 'hidden', backgroundColor: '#fff', ...cardShadow },
  art: { height: 82, padding: 8 },
  logo: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  band: { flex: 1, backgroundColor: '#0b6f9c', paddingHorizontal: 8, paddingVertical: 7, justifyContent: 'space-between' },
  bandMuted: { backgroundColor: '#8f9aa6' },
  name: { color: '#fff', fontSize: 13, lineHeight: 16 },
  reward: { flexDirection: 'row', alignItems: 'baseline' },
  rewardText: { color: '#fff', fontSize: 14, fontWeight: '700' },
})
