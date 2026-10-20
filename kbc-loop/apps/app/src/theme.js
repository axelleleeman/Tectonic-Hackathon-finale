// Kleuren en gedeelde stijlen (overgenomen uit de tokens van de web-versie).
import { StyleSheet } from 'react-native'

export const colors = {
  navy: '#003665',
  blue: '#00aeef',
  green: '#1aa36f',
  red: '#e4003a',
  ink: '#141e2b',
  muted: '#6b7684',
  line: '#e3e9f0',
  bg: '#eef3f8',
  bgApp: '#f3f5f7',
  card: '#ffffff',
  off: '#b8c0c9', // niet-klikbare delen van KBC Mobile
  offIcon: '#c5ccd4',
  offIconBg: '#f0f2f5',
  softBlue: '#eef4f9',
  savingBg: '#e8f7f0',
  savingInk: '#0f6e4a',
  noteBg: '#fff7e6',
  noteLine: '#f5dfae',
  boxLine: '#cfe0ee',
  yellow: '#ffd76a',
  // KBC Mobile-stijl (kbcmobile.css)
  kmNavy: '#12284c',
  kmBlue: '#0099d8',
  kmSky: '#e9f4fb',
  kmLine: '#e6edf3',
  kmGreen: '#6cc24a',
  kmRed: '#e8453c',
  kmSub: '#5d6d82',
  kmGrey: '#8a99ab',
  newGreen: '#13865b',
  button: '#1a9ad6',
}

// Zachte kaartschaduw (boxShadow werkt op iOS, Android en web met de nieuwe architectuur).
export const shadow = { boxShadow: '0px 1px 3px rgba(0, 54, 101, 0.08)' }
// Kaartschaduw van KBC Mobile.
export const cardShadow = { boxShadow: '0px 3px 12px rgba(18, 40, 76, 0.08)' }

export const type = StyleSheet.create({
  h2: { marginTop: 10, marginBottom: 6, fontSize: 21, fontWeight: '700', color: colors.kmNavy },
  h4: { marginTop: 18, marginBottom: 10, fontSize: 16, fontWeight: '700', color: colors.navy },
  fine: { fontSize: 12, color: colors.muted, marginVertical: 12, lineHeight: 17 },
  center: { textAlign: 'center' },
  bold: { fontWeight: '700' },
  small: { fontSize: 12, color: colors.muted, marginTop: 2 },
})

export const boxes = StyleSheet.create({
  saving: { backgroundColor: colors.savingBg, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, marginVertical: 8 },
  savingText: { color: colors.savingInk, fontSize: 14, lineHeight: 20 },
  note: { backgroundColor: colors.noteBg, borderWidth: 1, borderColor: colors.noteLine, padding: 12, borderRadius: 12, marginVertical: 8 },
  noteText: { fontSize: 14, lineHeight: 20, color: colors.ink },
  kbcBox: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.boxLine, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, marginVertical: 12 },
  kbcBoxTitle: { color: colors.navy, fontSize: 14, fontWeight: '700', marginBottom: 8 },
  listCard: { backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', ...cardShadow },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 8 },
  rowLast: { borderBottomWidth: 0 },
})
