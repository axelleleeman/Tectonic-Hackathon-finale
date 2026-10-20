// Herstelling: probleem kiezen → tijdlijn in 3 stappen → Kate Coins.
import { StyleSheet, View } from 'react-native'
import { productById, partnerOf } from '@kbc-loop/shared/engine/catalog.js'
import { issuesFor } from '@kbc-loop/shared/data/index.js'
import { COINS, TECHNICIAN_SLOT } from '@kbc-loop/shared/config/index.js'
import { PrimaryButton } from '../ui/Button.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { boxes, cardShadow, colors, type } from '../theme.js'

export function Repair({ item, actions }) {
  const p = productById(item.productId)
  const partner = partnerOf(p)
  const r = item.repair

  if (!r) {
    return (
      <>
        <T style={type.h2} role="heading">Wat is er mis met je {p.name.toLowerCase()}?</T>
        <T style={styles.intro}>{partner.name} krijgt je melding meteen. Herstel is inbegrepen in je abonnement.</T>
        {issuesFor(p.id).map((issue) => (
          <Press key={issue} style={styles.option} onPress={() => actions.reportDefect(item.key, issue)}>
            <T style={styles.optionText}>{issue}</T><T style={styles.optionText}>›</T>
          </Press>
        ))}
      </>
    )
  }

  const steps = [
    r.preventive ? 'Slijtage gemeld door het toestel zelf' : 'Defect gemeld',
    `${partner.name} plant een technieker in · ${TECHNICIAN_SLOT}`,
    'Hersteld & getest',
  ]
  const done = r.step === 3

  return (
    <>
      <T style={type.h2} role="heading">{done ? 'Hersteld!' : 'Herstelling loopt'}</T>
      <T style={styles.intro}>{p.icon} {p.name} · “{r.issue}”</T>
      <T style={[type.fine, styles.live]}>Live status van {partner.short}, rechtstreeks in KBC Mobile.</T>
      <View style={styles.timeline}>
        {steps.map((s, n) => {
          const on = n < r.step
          const last = n === steps.length - 1
          return (
            <View key={s} style={[styles.step, last && styles.stepLast]}>
              <View style={[styles.dot, on && styles.dotOn]} />
              {!last ? <View style={styles.line} /> : null}
              <T style={[styles.stepText, on && styles.stepTextOn]}>{s}</T>
            </View>
          )
        })}
      </View>
      {!done ? (
        <PrimaryButton onPress={() => actions.advanceRepair(item.key)}>
          {r.step === 1 ? 'Volgende: technieker ingepland' : 'Volgende: technieker herstelt'}
        </PrimaryButton>
      ) : (
        <>
          <View style={boxes.saving}>
            <T style={boxes.savingText}>♻ Hersteld in plaats van vervangen. Kost voor jou: <T style={[boxes.savingText, type.bold]}>€ 0</T>. +{COINS.repair} Kate Coins omdat je liet herstellen.</T>
          </View>
          <PrimaryButton onPress={() => actions.closeRepair(item.key)}>Terug naar Mijn KBC</PrimaryButton>
        </>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  intro: { color: colors.muted, fontSize: 14, lineHeight: 20, marginBottom: 12 },
  live: { marginTop: 0 },
  option: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 8, ...cardShadow },
  optionText: { fontWeight: '600', color: colors.ink },
  timeline: { marginVertical: 16 },
  step: { paddingLeft: 30, paddingBottom: 22, minHeight: 40 },
  stepLast: { paddingBottom: 0 },
  dot: { position: 'absolute', left: 0, top: 2, width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.line, backgroundColor: '#fff' },
  dotOn: { backgroundColor: colors.green, borderColor: colors.green },
  line: { position: 'absolute', left: 7, top: 22, bottom: 2, width: 2, backgroundColor: colors.line },
  stepText: { color: colors.muted },
  stepTextOn: { color: colors.ink, fontWeight: '600' },
})
