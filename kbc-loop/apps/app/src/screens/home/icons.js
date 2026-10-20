// Extra lijn-iconen voor de startpagina (generiek, geen merkbeelden).
import Svg, { Path } from 'react-native-svg'
import { icons as baseIcons } from '../../ui/icons.js'
import { colors } from '../../theme.js'

const homeIcons = {
  purse: ['M4 7.5A2.5 2.5 0 0 1 6.5 5H17v3', 'M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 7.5z', 'M16.5 13.5h.01'],
  pencil: ['M4 20l1-4L16 5l3 3L8 19z', 'M14 7l3 3'],
  mobile: ['M8 3h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 3z', 'M11 18h2'],
  coins: ['M6 7a5 2 0 1 0 10 0a5 2 0 1 0-10 0', 'M6 7v4c0 1.1 2.2 2 5 2s5-.9 5-2V7', 'M6 11v4c0 1.1 2.2 2 5 2', 'M8 15v4c0 1.1 2.2 2 5 2s5-.9 5-2v-4c0-1.1-2.2-2-5-2'],
  plusSmall: ['M19 3v4', 'M17 5h4'],
  minusSmall: ['M17 5h4'],
  bulb: ['M9 18h6', 'M10 21h4', 'M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z'],
  leaf: ['M5 19c0-8 5-14 15-14 0 10-6 15-14 15', 'M5 19l7-7'],
  tree: ['M12 3l-5 7h3l-4 6h12l-4-6h3z', 'M12 16v5'],
  recycle: ['M7 19H4l3-5', 'M9 6l2-3 3 5', 'M20 15l-2 4h-6', 'M7 14l-2-3', 'M14 8l3 0', 'M12 19l2-2', 'M12 19l2 2'],
  homeEdit: ['M4 11l8-6 8 6', 'M6 10v9h6', 'M18 13l3 3-4 4h-3v-3z'],
  heartHand: ['M4 13l4-4 3 2 2-2 2 2', 'M9 20l-4-4', 'M12 9c-1.5-2-5-1.5-5 1', 'M15 17a3 3 0 0 0 5-2c0-2.5-3-4-3-4s-3 1.5-3 4'],
  lock: ['M6 11h12v9H6z', 'M9 11V8a3 3 0 0 1 6 0v3', 'M12 15v2'],
  people: ['M9 11a3 3 0 1 0 0-6a3 3 0 1 0 0 6z', 'M3 20a6 6 0 0 1 12 0', 'M16 5a3 3 0 0 1 0 6', 'M18 14a5 5 0 0 1 3 6'],
  star: ['M12 4l2.4 5 5.6.6-4.2 3.8 1.2 5.6L12 16l-5 3 1.2-5.6L4 9.6 9.6 9z'],
  store: ['M4 9l1.5-5h13L20 9', 'M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9', 'M5 11v9h14v-9', 'M10 20v-5h4v5'],
  basket: ['M4 10h16l-2 10H6z', 'M8 10l4-6 4 6', 'M10 14v3', 'M14 14v3'],
  bus: ['M6 4h12a2 2 0 0 1 2 2v10H4V6a2 2 0 0 1 2-2z', 'M4 11h16', 'M7 19v-3', 'M17 19v-3', 'M7.5 14h.01', 'M16.5 14h.01'],
  shield: ['M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z', 'M9 12l2 2 4-4'],
  briefcaseSmall: ['M4 8h16v11H4z', 'M9 8V5h6v3'],
  docs: ['M7 3h7l4 4v14H7z', 'M14 3v4h4', 'M10 12h5', 'M10 15h5'],
  split: ['M5 5h14v14H5z', 'M5 12h14', 'M12 5v14'],
  plant: ['M12 21v-8', 'M12 13c0-4-3-6-7-6 0 4 3 6 7 6z', 'M12 11c0-4 3-6 7-6 0 4-3 6-7 6z'],
}

const allIcons = { ...baseIcons, ...homeIcons }

/** Lijn-icoon uit de gedeelde set of de extra startpagina-set. */
export function Glyph({ name, size = 22, color = colors.kmNavy, strokeWidth = 1.8, fill = 'none' }) {
  const paths = allIcons[name]
  if (!paths) return null
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths.map((d) => <Path key={d} d={d} />)}
    </Svg>
  )
}
