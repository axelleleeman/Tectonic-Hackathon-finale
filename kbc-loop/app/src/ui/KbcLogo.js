// KBC-logo (assets/kbc-logo.png, 477 × 372).
import { Image } from 'react-native'

const logo = require('../../assets/kbc-logo.png')
const RATIO = 477 / 372

export function KbcLogo({ height = 24, style }) {
  return <Image source={logo} style={[{ height, width: height * RATIO }, style]} resizeMode="contain" accessibilityLabel="KBC" />
}
