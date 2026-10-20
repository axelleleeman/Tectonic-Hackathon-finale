// Lijn-iconen met dezelfde SVG-paden als de web-versie.
import Svg, { Path } from 'react-native-svg'
import { icons } from './icons.js'
import { colors } from '../theme.js'

export function Icon({ name, size = 22, color = colors.kmNavy, fill = 'none', strokeWidth = 1.8, style }) {
  const paths = icons[name]
  if (!paths) return null // onbekend icoon: niets tonen i.p.v. de app te laten crashen
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden>
      {paths.map((d) => <Path key={d} d={d} />)}
    </Svg>
  )
}
