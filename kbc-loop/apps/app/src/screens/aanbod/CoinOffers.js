// "Earn Kate Coins here": cards with an image and a reward in KTC. The KBC Loop cards (repair and return)
// are tappable and lead to your borrowed products in My KBC; the other offers are fictional, without
// brand logos, and dimmed.
import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COINS } from '@kbc-loop/shared/config/index.js'
import { Amount } from '../../ui/Amount.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { LineIcon } from '../mykbc/icons.js'
import { Dimmed } from '../../ui/Dimmed.js'
import { TileRow } from './Tile.js'
import { cardShadow, colors } from '../../theme.js'

const OTHER_OFFERS = [
  { id: 'grocery', name: 'Grocery campaign', icon: 'gift', art: ['#f6c9a8', '#d98d5f'], reward: null },
  { id: 'shoes', name: 'Shoe shop', icon: 'heart', art: ['#d9c7a8', '#9c7f57'], reward: 20 },
  { id: 'testdrive', name: 'Electric car test drive', icon: 'car', art: ['#a9c6d8', '#5d89a6'], reward: 15 },
]

function OfferCard({ name, icon, art, reward, onPress, a11y }) {
  const body = (
    <>
      <LinearGradient colors={art} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.art}>
        <View style={styles.logo}><LineIcon name={icon} size={24} color={colors.kmNavy} /></View>
      </LinearGradient>
      <View style={styles.band}>
        <T style={styles.name} numberOfLines={2}>{name}</T>
        {reward
          ? <View style={styles.reward}><T style={styles.rewardText}>+</T><Amount value={reward} unit="KTC" style={styles.rewardText} /></View>
          : <T style={styles.rewardText}>See reward</T>}
      </View>
    </>
  )
  if (!onPress) return <Dimmed radius={10}><View style={styles.card}>{body}</View></Dimmed>
  return <Press style={styles.card} onPress={onPress} label={a11y}>{body}</Press>
}

export function CoinOffersSection({ onMyLoop }) {
  return (
    <TileRow title="Earn Kate Coins here">
      <OfferCard name="KBC Loop: repair" icon="loop" art={['#2fd3b8', '#0b8fc4']} reward={COINS.repair}
        a11y={`KBC Loop: earn ${COINS.repair} Kate Coins by having a product repaired. Open your borrowed products in My KBC`} onPress={onMyLoop} />
      <OfferCard name="KBC Loop: return" icon="loop" art={['#7bed9f', '#10ac84']} reward={COINS.return}
        a11y={`KBC Loop: earn ${COINS.return} Kate Coins by returning a product. Open your borrowed products in My KBC`} onPress={onMyLoop} />
      {OTHER_OFFERS.map((o) => <OfferCard key={o.id} {...o} />)}
    </TileRow>
  )
}

const styles = StyleSheet.create({
  card: { width: 104, height: 162, borderRadius: 10, overflow: 'hidden', backgroundColor: '#fff', ...cardShadow },
  art: { height: 82, padding: 8 },
  logo: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  band: { flex: 1, backgroundColor: '#0b6f9c', paddingHorizontal: 8, paddingVertical: 7, justifyContent: 'space-between' },
  name: { color: '#fff', fontSize: 13, lineHeight: 16 },
  reward: { flexDirection: 'row', alignItems: 'baseline' },
  rewardText: { color: '#fff', fontSize: 14, fontWeight: '700' },
})
