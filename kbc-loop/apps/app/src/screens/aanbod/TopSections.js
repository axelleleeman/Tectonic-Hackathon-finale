// "Your favourites" and "Your tickets" on the Loop tab: as in KBC Mobile, static (the Loop tab dims them).
// Generic icons instead of transport company logos.
import { StyleSheet, View } from 'react-native'
import { Icon } from '../../ui/Icon.js'
import { T } from '../../ui/T.js'
import { SectionHead } from '../common.js'
import { LineIcon } from '../mykbc/icons.js'
import { StaticHeadLink } from '../mykbc/shared.js'
import { cardShadow, colors } from '../../theme.js'

const FAVOURITES = [
  { id: 'train', icon: 'train', label: 'Train ticket' },
  { id: 'bus', icon: 'ticket2', label: 'Bus and tram ticket' },
]

export function FavouritesSection() {
  return (
    <View>
      <SectionHead title="Your favourites" right={<Icon name="more" size={28} />} />
      <View style={styles.favRow}>
        {FAVOURITES.map((f) => (
          <View key={f.id} style={styles.fav}>
            <LineIcon name={f.icon} size={34} color={colors.kmNavy} />
          </View>
        ))}
        <View style={styles.addFav}><Icon name="plus" size={16} color="#fff" /></View>
      </View>
    </View>
  )
}

export function TicketsSection() {
  return (
    <View>
      <SectionHead title="Your tickets" right={<StaticHeadLink>To Kate Wallet</StaticHeadLink>} />
      <View style={styles.ticket}>
        <View style={styles.ticketIcon}><LineIcon name="ticket2" size={22} color={colors.kmBlue} /></View>
        <T style={styles.ticketText}>No active tickets</T>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  favRow: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  fav: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...cardShadow },
  addFav: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.kmGreen, alignItems: 'center', justifyContent: 'center', marginLeft: 22 },
  ticket: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 12, minWidth: 170, ...cardShadow },
  ticketIcon: { width: 32, height: 32, borderRadius: 6, backgroundColor: colors.kmSky, alignItems: 'center', justifyContent: 'center' },
  ticketText: { fontSize: 14, color: colors.kmSub },
})
