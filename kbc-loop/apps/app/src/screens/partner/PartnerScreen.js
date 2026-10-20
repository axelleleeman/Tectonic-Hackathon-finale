// Partner page: who the partner is, key facts, certifications, services and every product it offers.
// Profile figures are illustrative demo values (shared/data/partnerProfiles.js).
import { StyleSheet, View } from 'react-native'
import { partners } from '@kbc-loop/shared/data/index.js'
import { partnerProfile } from '@kbc-loop/shared/data/partnerProfiles.js'
import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { ProductImage } from '../../ui/ProductImage.js'
import { Icon } from '../../ui/Icon.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { cardShadow, colors, type } from '../../theme.js'
import { secondLifeMonthly } from '../borrowContract.js'
import { PartnerLogo, categoryName, productsOfPartner } from './catalogueParts.js'

const orDash = (v, fmt = (x) => x) => (v ? fmt(v) : '—')

export function PartnerScreen({ customer, partnerId, items, actions }) {
  const partner = partners[partnerId]
  if (!partner) return <T style={styles.sub}>This partner is not available.</T>
  const profile = partnerProfile(partner.id)
  const list = productsOfPartner(partner.id, customer.type)
  const inUse = (id) => items.some((i) => i.productId === id && !i.returned)

  const facts = [
    ['Founded', orDash(profile.founded, String)],
    ['Headquarters', orDash(profile.headquarters)],
    ['Service area', orDash(profile.serviceArea)],
    ['Repair time', orDash(profile.repairSlaHours, (h) => `Within ${h} hours`)],
    ['Technicians', orDash(profile.technicians, num)],
    ['Refurbished', orDash(profile.refurbishRate, (r) => `${r}% of returns`)],
  ]

  return (
    <>
      <View style={styles.header}>
        <PartnerLogo partner={partner} size={64} />
        <View style={styles.flex}>
          <T style={styles.name} role="heading">{partner.name}</T>
          <T style={styles.sub}>{categoryName(partner)} · {list.length} product{list.length === 1 ? '' : 's'}</T>
        </View>
      </View>
      <T style={styles.tagline}>{partner.tagline}</T>

      {profile.highlight ? (
        <View style={styles.highlight}><T style={styles.highlightText}>♻ {profile.highlight}</T></View>
      ) : null}

      <T style={type.h4} role="heading">About</T>
      <T style={styles.body}>{profile.about}</T>

      <T style={type.h4} role="heading">Key facts</T>
      <View style={styles.grid}>
        {facts.map(([label, value]) => (
          <View key={label} style={styles.fact}>
            <T style={styles.factLabel}>{label}</T>
            <T style={styles.factValue} numberOfLines={2}>{value}</T>
          </View>
        ))}
      </View>
      {profile.co2PerUnitKg ? (
        <T style={styles.co2}>± {num(profile.co2PerUnitKg)} kg CO₂ avoided per product over its term.</T>
      ) : null}

      {profile.certifications?.length ? (
        <>
          <T style={type.h4} role="heading">Certifications</T>
          <View style={styles.chips}>
            {profile.certifications.map((c) => <T key={c} style={styles.chip}>{c}</T>)}
          </View>
        </>
      ) : null}

      <T style={type.h4} role="heading">Services</T>
      <View style={styles.card}>
        {profile.services.map((s) => (
          <View key={s} style={styles.check}><T style={styles.checkMark}>✓</T><T style={styles.checkText}>{s}</T></View>
        ))}
      </View>

      <T style={type.h4} role="heading">All products</T>
      <View style={styles.list}>
        {list.map((p, i) => (
          <Press key={p.id} style={[styles.row, i > 0 && styles.divider]} label={`${p.name}, ${euro(p.monthly)} per month${inUse(p.id) ? ', in use' : ''}. View product`}
            onPress={() => actions.navigate('product', { productId: p.id, signalId: null, partnerId: partner.id })}>
            <ProductImage product={p} style={styles.thumb} />
            <View style={styles.flex}>
              <T style={styles.prodName} numberOfLines={2}>{p.name}</T>
              <T style={styles.prodDetail} numberOfLines={1}>{p.detail}</T>
              {secondLifeMonthly(p) ? <T style={styles.refurb}>Refurbished · {euro(secondLifeMonthly(p), 2)}/month</T> : null}
            </View>
            <View style={styles.priceCol}>
              <T style={inUse(p.id) ? styles.inUse : styles.price}>{inUse(p.id) ? 'In use' : `${euro(p.monthly)}/month`}</T>
              <Icon name="chevron" size={14} color={colors.kmGrey} strokeWidth={2} />
            </View>
          </Press>
        ))}
      </View>
      <T style={type.fine}>Profile figures and certifications are illustrative demo values.</T>
    </>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 6 },
  name: { fontSize: 21, fontWeight: '700', color: colors.kmNavy },
  sub: { color: colors.kmSub, fontSize: 13, marginTop: 2 },
  tagline: { color: colors.ink, fontSize: 14.5, lineHeight: 20, marginTop: 12 },
  highlight: { backgroundColor: colors.savingBg, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, marginTop: 12 },
  highlightText: { color: colors.savingInk, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  body: { color: colors.ink, fontSize: 14, lineHeight: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fact: { width: '48.5%', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, ...cardShadow },
  factLabel: { fontSize: 12, color: colors.kmSub },
  factValue: { fontSize: 14.5, fontWeight: '700', color: colors.kmNavy, marginTop: 2 },
  co2: { color: colors.savingInk, fontSize: 13, marginTop: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 99, borderWidth: 1, borderColor: colors.boxLine, backgroundColor: '#fff', color: colors.navy, fontSize: 12.5, fontWeight: '600', overflow: 'hidden' },
  card: { backgroundColor: '#fff', borderRadius: 14, paddingVertical: 6, paddingHorizontal: 12, ...cardShadow },
  check: { flexDirection: 'row', paddingVertical: 5 },
  checkMark: { width: 24, color: colors.green, fontWeight: '800', fontSize: 14 },
  checkText: { flex: 1, fontSize: 14, color: colors.ink },
  list: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', ...cardShadow },
  divider: { borderTopWidth: 1, borderTopColor: colors.kmLine },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12 },
  thumb: { width: 64, height: 48, borderRadius: 8 },
  prodName: { fontSize: 14.5, fontWeight: '600', color: colors.ink },
  prodDetail: { fontSize: 12.5, color: colors.kmSub, marginTop: 2 },
  refurb: { alignSelf: 'flex-start', marginTop: 4, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 99, backgroundColor: colors.savingBg, color: colors.savingInk, fontSize: 11.5, fontWeight: '700', overflow: 'hidden' },
  priceCol: { alignItems: 'flex-end', gap: 4 },
  price: { fontSize: 14, fontWeight: '600', color: colors.kmNavy },
  inUse: { fontSize: 13, fontWeight: '700', color: colors.newGreen },
})
