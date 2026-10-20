// Voorstel: product, "Waarom zie ik dit?", kostenvergelijking, CO₂ en de KBC-diensten achter de schermen.
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { productServices, servicesForSignal } from '@kbc-loop/shared/engine/integrations.js'
import { productById, partnerNames, categoryOf } from '@kbc-loop/shared/engine/catalog.js'
import { carKmEquivalent } from '@kbc-loop/shared/engine/impact.js'
import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { products, partners } from '@kbc-loop/shared/data/index.js'
import { partnerProfile } from '@kbc-loop/shared/data/partnerProfiles.js'
import { ProductImage } from '../ui/ProductImage.js'
import { Icon } from '../ui/Icon.js'
import { ServiceChips } from '../ui/ServiceChips.js'
import { LinkButton, PrimaryButton } from '../ui/Button.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { CostCompare } from './CostCompare.js'
import { ContractSummary } from './ContractSummary.js'
import { SIGN_DELAY_MS, contractTerms, rememberContract, secondLifeMonthly } from './borrowContract.js'
import { RepairPattern } from './RepairPattern.js'
import { boxes, cardShadow, colors, type } from '../theme.js'
import { PartnerLogo, ProductRail, RailTitle, productsOfPartner } from './partner/catalogueParts.js'

export function Product({ customer, productId, signal, actions }) {
  const [why, setWhy] = useState(false)
  const [step, setStep] = useState('offer') // 'offer' | 'contract' | 'signing'
  const [refurbished, setRefurbished] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const p = productById(productId)
  if (!p) return null
  const cat = categoryOf(p)
  const partner = partnerNames(p)
  const refurbMonthly = secondLifeMonthly(p)
  const terms = contractTerms(p, { refurbished })
  // Single-partner products link to their partner page; bundles span several partners.
  const owner = p.partnerId ? partners[p.partnerId] : null
  const profile = owner ? partnerProfile(owner.id) : null
  const moreFromPartner = owner ? productsOfPartner(owner.id, customer.type).filter((x) => x.id !== p.id) : []
  const similar = products.filter((x) => x.id !== p.id && x.partnerId !== p.partnerId && x.for.includes(customer.type)
    && partners[x.partnerId]?.category === cat.id).slice(0, 8)
  const openProduct = (id) => actions.navigate('product', { productId: id, signalId: null })
  const openPartner = () => actions.navigate('partner', { partnerId: owner.id })

  // Simulated KBC Sign confirmation (no real authentication), then BORROW of the normal product id.
  const confirm = () => {
    setStep('signing')
    rememberContract(terms)
    timer.current = setTimeout(() => actions.borrow(p.id), SIGN_DELAY_MS)
  }

  if (step !== 'offer') {
    const signing = step === 'signing'
    return (
      <>
        <T style={type.h2} role="heading">Your contract</T>
        <T style={styles.detail}>Check the terms and confirm with KBC.</T>
        <ContractSummary terms={terms} partnerName={partner} />
        <Press style={styles.agree} onPress={signing ? undefined : () => setAgreed(!agreed)} role="checkbox" aria-checked={agreed} label="I agree to the contract terms">
          <View style={[styles.box, agreed && styles.boxOn]}>{agreed ? <T style={styles.boxTick}>✓</T> : null}</View>
          <T style={styles.checkText}>I agree to the contract terms</T>
        </Press>
        {signing ? (
          <View style={styles.signing} role="status">
            <ActivityIndicator color={colors.navy} />
            <T style={styles.signingText}>Confirming with KBC Sign…</T>
          </View>
        ) : (
          <>
            <View style={!agreed && styles.dim}>
              <PrimaryButton onPress={agreed ? confirm : undefined}>Confirm with KBC</PrimaryButton>
            </View>
            <LinkButton onPress={() => setStep('offer')}>Back</LinkButton>
          </>
        )}
        <T style={type.fine}>Simulated signature for this prototype. No real authentication takes place.</T>
      </>
    )
  }

  return (
    <>
      <ProductImage product={p} size="hero" style={styles.hero} />
      <T style={styles.category}>{cat.name}</T>
      <T style={type.h2} role="heading">{p.name}</T>
      <T style={styles.detail}>{p.detail}</T>
      {owner ? (
        <Press style={styles.partnerRow} label={`Offered by ${owner.name}. Open the partner page`} onPress={openPartner}>
          <PartnerLogo partner={owner} size={38} />
          <View style={styles.flex}>
            <T style={styles.partnerBy}>Offered by</T>
            <T style={styles.partnerName}>{owner.name}</T>
          </View>
          <T style={styles.partnerLink}>View partner</T>
          <Icon name="chevron" size={14} color={colors.kmBlue} strokeWidth={2} />
        </Press>
      ) : (
        <View style={styles.pill}><T style={styles.pillText}>{partner}</T></View>
      )}
      <T style={styles.price}><T style={styles.priceBig}>{euro(p.monthly)}</T> / month · {p.termMonths / 12} years</T>
      <View style={styles.facts}>
        {[
          ['Term', `${p.termMonths} months`],
          ['Repairs', profile ? `Within ${profile.repairSlaHours} h` : 'Included'],
          ['CO₂ avoided', `± ${num(p.co2Kg)} kg`],
        ].map(([label, value]) => (
          <View key={label} style={styles.fact}><T style={styles.factLabel}>{label}</T><T style={styles.factValue}>{value}</T></View>
        ))}
      </View>
      {refurbMonthly ? (
        <View style={styles.variants} role="radiogroup">
          {[[false, 'New', p.monthly], [true, 'Refurbished', refurbMonthly]].map(([value, label, monthly]) => (
            <Press key={label} role="radio" aria-checked={refurbished === value} label={`${label}, ${euro(monthly, 2)} per month`}
              style={[styles.variant, refurbished === value && styles.variantOn]} onPress={() => setRefurbished(value)}>
              <T style={styles.variantTitle}>{label}</T>
              <T style={styles.variantPrice}>{euro(monthly, Number.isInteger(monthly) ? 0 : 2)} / month</T>
            </Press>
          ))}
        </View>
      ) : null}

      <T style={type.h4} role="heading">What's included</T>
      <View style={styles.checks}>
        {p.includes.map((i) => (
          <View key={i} style={styles.check}><T style={styles.checkMark}>✓</T><T style={styles.checkText}>{i}</T></View>
        ))}
      </View>

      {signal?.pattern ? <RepairPattern pattern={signal.pattern} /> : null}

      {signal ? (
        <>
          <Press style={styles.why} onPress={() => setWhy(!why)} aria-expanded={why}>
            <T style={styles.whyText}>ⓘ Why am I seeing this? {why ? '▴' : '▾'}</T>
          </Press>
          {why ? (
            <View style={styles.whybox}>
              {signal.reasons.map((r) => (
                <View key={r} style={styles.bullet}><T style={styles.whyItem}>•</T><T style={[styles.whyItem, styles.flex]}>{r}</T></View>
              ))}
              <T style={styles.basedOn}>Based on:</T>
              <ServiceChips services={servicesForSignal(signal)} />
              <T style={styles.whyNote}>We share no data with {partner} until you decide.</T>
            </View>
          ) : null}
        </>
      ) : null}

      <CostCompare product={p} />
      <View style={boxes.saving}>
        <T style={boxes.savingText}>♻ ± <T style={[boxes.savingText, type.bold]}>{num(p.co2Kg)} kg CO₂</T> avoided (≈ {num(carKmEquivalent(p.co2Kg))} km by car) because the product is repaired and reused.</T>
      </View>

      <View style={boxes.kbcBox}>
        <T style={boxes.kbcBoxTitle}>Arranged behind the scenes by KBC</T>
        <ServiceChips services={productServices(p, customer.type)} withRole />
      </View>

      <PrimaryButton onPress={() => setStep('contract')}>Borrow via KBC Loop</PrimaryButton>
      {signal ? (
        <LinkButton onPress={() => { actions.dismissSignal(signal.id); actions.navigate('home') }}>Not interested, don't show this again</LinkButton>
      ) : null}
      <T style={type.fine}>Indicative amounts. Cancellable after 12 months; you can also take over the product.</T>

      {moreFromPartner.length > 0 ? (
        <>
          <RailTitle>More from {owner.short ?? owner.name}</RailTitle>
          <ProductRail list={moreFromPartner} onOpen={openProduct} />
        </>
      ) : null}
      {similar.length > 0 ? (
        <>
          <RailTitle>Similar products</RailTitle>
          <ProductRail list={similar} onOpen={openProduct} />
        </>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  hero: { marginBottom: 12 },
  category: { fontSize: 12, fontWeight: '700', color: colors.kmBlue, textTransform: 'uppercase', letterSpacing: 0.6 },
  partnerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 14, ...cardShadow },
  partnerBy: { fontSize: 11.5, color: colors.kmSub },
  partnerName: { fontSize: 15, fontWeight: '700', color: colors.kmNavy },
  partnerLink: { fontSize: 13, fontWeight: '600', color: colors.kmBlue },
  facts: { flexDirection: 'row', gap: 8, marginTop: 12 },
  fact: { flex: 1, backgroundColor: colors.kmSky, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10 },
  factLabel: { fontSize: 11.5, color: colors.kmSub },
  factValue: { fontSize: 13.5, fontWeight: '700', color: colors.kmNavy, marginTop: 2 },
  pill: { alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.boxLine, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 99 },
  pillText: { fontSize: 11, fontWeight: '700', color: colors.navy },
  detail: { color: colors.muted, fontSize: 14, lineHeight: 20, marginBottom: 12 },
  price: { color: colors.muted },
  priceBig: { fontSize: 24, fontWeight: '700', color: colors.navy },
  checks: { marginBottom: 12 },
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
  variants: { flexDirection: 'row', gap: 8, marginTop: 12 },
  variant: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#fff' },
  variantOn: { borderColor: colors.navy, borderWidth: 2, paddingVertical: 9, paddingHorizontal: 11 },
  variantTitle: { fontSize: 14, fontWeight: '700', color: colors.navy },
  variantPrice: { fontSize: 13, color: colors.muted, marginTop: 2 },
  agree: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  boxOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  boxTick: { color: '#fff', fontSize: 13, fontWeight: '800' },
  dim: { opacity: 0.45 },
  signing: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  signingText: { color: colors.navy, fontWeight: '600', fontSize: 15 },
  whyNote: { color: colors.muted, fontSize: 13, marginTop: 10 },
})
