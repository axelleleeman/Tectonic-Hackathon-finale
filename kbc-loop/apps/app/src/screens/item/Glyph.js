// Line icons for the product and cost screens (24×24 grid, same style as ui/Icon).
import Svg, { Path } from 'react-native-svg'
import { colors } from '../../theme.js'

const PATHS = {
  wrench: ['M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8a1.4 1.4 0 0 0 2 2l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.4 2.4-2-.6-.6-2z'],
  upgrade: ['M12 19V7', 'M7 11l5-5 5 5', 'M5 21h14'],
  returnBox: ['M3 8l9-4 9 4v8l-9 4-9-4z', 'M3 8l9 4 9-4', 'M12 12v8'],
  receipt: ['M6 3h12v18l-3-2-3 2-3-2-3 2z', 'M9 8h6', 'M9 12h6', 'M9 16h3'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  camera: ['M4 8h3l2-3h6l2 3h3v11H4z', 'M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'],
  calendar: ['M5 5h14v15H5z', 'M5 10h14', 'M9 3v4', 'M15 3v4'],
  truck: ['M3 7h11v9H3z', 'M14 10h4l3 3v3h-7', 'M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  leaf: ['M5 19c0-8 5-13 14-14 0 9-5 14-13 14z', 'M5 19l7-7'],
  info: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 11v5', 'M12 8h.01'],
  chevron: ['M9 6l6 6-6 6'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  coin: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M9.5 8v8', 'M9.5 12l4.5-4', 'M11 11l3 5'],
  euro: ['M17 6.5A6.5 6.5 0 1 0 17 17.5', 'M5 10h8', 'M5 14h8'],
}

export function Glyph({ name, size = 22, color = colors.kmNavy, strokeWidth = 1.9 }) {
  const paths = PATHS[name]
  if (!paths) return null
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths.map((d) => <Path key={d} d={d} />)}
    </Svg>
  )
}
