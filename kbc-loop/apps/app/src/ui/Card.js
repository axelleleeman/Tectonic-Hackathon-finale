// White card with the KBC Mobile shadow: the base surface of every KBC Loop block.
import { StyleSheet, View } from 'react-native'
import { cardShadow } from '../theme.js'
import { radius, space } from './tokens.js'

export function Card({ style, padded = true, children, ...rest }) {
  return <View style={[styles.card, padded && styles.padded, style]} {...rest}>{children}</View>
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: radius.lg, ...cardShadow },
  padded: { padding: space.lg },
})
