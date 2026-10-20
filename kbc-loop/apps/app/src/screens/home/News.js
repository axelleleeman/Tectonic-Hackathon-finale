// "Financial news": two fictional headlines with generic icons (no publisher logos). Shown dimmed on Home.
import { StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { Glyph } from './icons.js'
import { Dots, Section, shared } from './parts.js'
import { colors } from '../../theme.js'

const ARTICLES = [
  { id: 'a1', icon: 'news', round: false, title: 'Central bank keeps interest rates stable: what does it mean for your savings?' },
  { id: 'a2', icon: 'chart', round: true, title: 'Markets: European shares close higher after strong quarterly results' },
]

export function News() {
  return (
    <Section title="Financial news">
      <View style={[shared.card, styles.card]}>
        <Dots style={styles.dots} />
        {ARTICLES.map((a) => (
          <View key={a.id} style={styles.row}>
            <View style={[styles.logo, a.round && styles.round]}><Glyph name={a.icon} size={22} color="#fff" strokeWidth={1.6} /></View>
            <T style={styles.title} numberOfLines={2}>{a.title}</T>
          </View>
        ))}
        <T style={styles.more}>{ARTICLES.length} new articles</T>
      </View>
    </Section>
  )
}

const styles = StyleSheet.create({
  card: { paddingTop: 30, paddingHorizontal: 18, paddingBottom: 14 },
  dots: { position: 'absolute', top: 10, right: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 16 },
  logo: { width: 34, height: 34, borderRadius: 3, backgroundColor: '#24406b', alignItems: 'center', justifyContent: 'center' },
  round: { borderRadius: 17, backgroundColor: '#3ab0c9' },
  title: { flex: 1, fontSize: 15.5, lineHeight: 19 },
  more: { textAlign: 'center', color: colors.kmSub, fontSize: 13 },
})
