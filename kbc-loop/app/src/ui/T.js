// Tekst met de standaardkleur en -grootte van de app.
import { StyleSheet, Text } from 'react-native'
import { colors } from '../theme.js'

export function T({ style, ...props }) {
  return <Text style={[styles.base, style]} {...props} />
}

const styles = StyleSheet.create({
  base: { color: colors.kmNavy, fontSize: 15 },
})
