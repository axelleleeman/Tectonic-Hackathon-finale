// Voorstel: product, "Waarom zie ik dit?", kostenvergelijking, CO₂ en de KBC-diensten achter de schermen.
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { productServices, servicesForSignal } from '@kbc-loop/shared/engine/integrations.js'
import { productById, partnerNames, categoryOf } from '@kbc-loop/shared/engine/catalog.js'
import { carKmEquivalent } from '@kbc-loop/shared/engine/impact.js'
import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { Photo } from '../ui/Photo.js'
import { ServiceChips } from '../ui/ServiceChips.js'
import { LinkButton, PrimaryButton } from '../ui/Button.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { CostCompare } from './CostCompare.js'
import { RepairPattern } from './RepairPattern.js'
import { boxes, colors, type } from '../theme.js'

export function Product({ customer, productId, signal, actions }) {
  const [why, setWhy] = useState(false)
  const p = productById(productId)
  if (!p) return null
  const cat = categoryOf(p)
  const partner = partnerNames(p)

  return (
    <>
      <Photo photoKey={cat.id} tint={cat.tint} icon={p.icon} style={styles.hero} />
      <View style={styles.pill}><T style={styles.pillText}>{partner}</T></View>
      <T style={type.h2} role="heading">{p.icon} {p.name}</T>
      <T style={styles.detail}>{p.detail}</T>
      <T style={styles.price}><T style={styles.priceBig}>{euro(p.monthly)}</T> / maand · {p.termMonths / 12} jaar</T>

      <View style={styles.checks}>
        {p.includes.map((i) => (
          <View key={i} style={styles.check}><T style={styles.checkMark}>✓</T><T style={styles.checkText}>{i}</T></View>
        ))}
      </View>

      {signal?.pattern ? <RepairPattern pattern={signal.pattern} /> : null}

      {signal ? (
        <>
          <Press style={styles.why} onPress={() => setWhy(!why)} aria-expanded={why}>
            <T style={styles.whyText}>ⓘ Waarom zie ik dit? {why ? '▴' : '▾'}</T>
          </Press>
          {why ? (
            <View style={styles.whybox}>
              {signal.reasons.map((r) => (
                <View key={r} style={styles.bullet}><T style={styles.whyItem}>•</T><T style={[styles.whyItem, styles.flex]}>{r}</T></View>
              ))}
              <T style={styles.basedOn}>Gebaseerd op:</T>
              <ServiceChips services={servicesForSignal(signal)} />
              <T style={styles.whyNote}>We delen geen gegevens met {partner} tot jij beslist.</T>
            </View>
          ) : null}
        </>
      ) : null}

      <CostCompare product={p} />
      <View style={boxes.saving}>
        <T style={boxes.savingText}>♻ ± <T style={[boxes.savingText, type.bold]}>{num(p.co2Kg)} kg CO₂</T> vermeden (≈ {num(carKmEquivalent(p.co2Kg))} km met de auto) doordat het product hersteld en hergebruikt wordt.</T>
      </View>

      <View style={boxes.kbcBox}>
        <T style={boxes.kbcBoxTitle}>Achter de schermen geregeld door KBC</T>
        <ServiceChips services={productServices(p, customer.type)} withRole />
      </View>

      <PrimaryButton onPress={() => actions.borrow(p.id)}>Leen via KBC Loop</PrimaryButton>
      {signal ? (
        <LinkButton onPress={() => { actions.dismissSignal(signal.id); actions.navigate('home') }}>Niet geïnteresseerd, toon dit niet meer</LinkButton>
      ) : null}
      <T style={type.fine}>Indicatieve bedragen. Opzegbaar na 12 maanden; je kan het product ook overnemen.</T>
    </>
  )
}

const styles = StyleSheet.create({
  hero: { height: 120, borderRadius: 16, marginBottom: 12 },
  pill: { alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.boxLine, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 99 },
  pillText: { fontSize: 11, fontWeight: '700', color: colors.navy },
  detail: { color: colors.muted, fontSize: 14, lineHeight: 20, marginBottom: 12 },
  price: { color: colors.muted },
  priceBig: { fontSize: 24, fontWeight: '700', color: colors.navy },
  checks: { marginVertical: 12 },
  check: { flexDirection: 'row', paddingVertical: 5 },
  checkMark: { width: 26, paddingLeft: 4, color: colors.green, fontWeight: '800', fontSize: 14 },
  checkText: { flex: 1, fontSize: 14, color: colors.ink },
  why: { paddingVertical: 6, alignSelf: 'flex-start' },
  whyText: { color: colors.navy, fontWeight: '600', fontSize: 14 },
  whybox: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 8 },
  bullet: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  whyItem: { fontSize: 13, color: colors.ink, lineHeight: 18 },
  flex: { flex: 1 },
  basedOn: { marginTop: 8, marginBottom: 6, color: colors.navy, fontWeight: '600', fontSize: 13 },
  whyNote: { color: colors.muted, fontSize: 13, marginTop: 10 },
})
