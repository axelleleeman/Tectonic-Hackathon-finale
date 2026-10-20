// "Je favorieten" en "Je tickets" bovenaan Aanbod: zoals in KBC Mobile, maar niet klikbaar.
// Generieke iconen i.p.v. logo's van vervoersmaatschappijen.
import { StyleSheet, View } from 'react-native'
import { Icon } from '../../ui/Icon.js'
import { T } from '../../ui/T.js'
import { SectionHead } from '../common.js'
import { LineIcon } from '../mykbc/icons.js'
import { MUTED_OPACITY, MutedHeadLink } from '../mykbc/shared.js'
import { cardShadow, colors } from '../../theme.js'

const FAVOURITES = [
  { id: 'trein', icon: 'train', label: 'Treinticket' },
  { id: 'bus', icon: 'ticket2', label: 'Bus- en tramticket' },
]

export function FavouritesSection() {
  return (
    <View>
      <SectionHead title="Je favorieten" right={<View style={styles.muted}><Icon name="more" size={28} /></View>} />
      <View style={styles.favRow}>
        {FAVOURITES.map((f) => (
          <View key={f.id} style={styles.fav} aria-label={f.label}>
            <View style={styles.muted}><LineIcon name={f.icon} size={34} color={colors.kmNavy} /></View>
          </View>
        ))}
        <View style={[styles.addFav, styles.muted]}><Icon name="plus" size={16} color="#fff" /></View>
      </View>
    </View>
  )
}

export function TicketsSection() {
  return (
    <View>
      <SectionHead title="Je tickets" right={<MutedHeadLink>Naar Kate Wallet</MutedHeadLink>} />
      <View style={styles.ticket}>
        <View style={[styles.ticketIcon, styles.muted]}><LineIcon name="ticket2" size={22} color={colors.kmBlue} /></View>
        <T style={[styles.ticketText, styles.muted]}>Geen actieve tickets</T>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  muted: { opacity: MUTED_OPACITY },
  favRow: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  fav: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...cardShadow },
  addFav: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.kmGreen, alignItems: 'center', justifyContent: 'center', marginLeft: 22 },
  ticket: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 12, minWidth: 170, ...cardShadow },
  ticketIcon: { width: 32, height: 32, borderRadius: 6, backgroundColor: colors.kmSky, alignItems: 'center', justifyContent: 'center' },
  ticketText: { fontSize: 14, color: colors.kmSub },
})
