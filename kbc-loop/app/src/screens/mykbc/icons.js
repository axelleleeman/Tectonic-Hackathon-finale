// Extra lijn-iconen voor Mijn KBC en Aanbod (generiek, geen merkbeelden), zelfde stijl als ui/icons.js.
import Svg, { Path } from 'react-native-svg'
import { Icon } from '../../ui/Icon.js'
import { colors } from '../../theme.js'

const extraIcons = {
  card: ['M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M3 10h18', 'M7 15h4'],
  shield: ['M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z', 'M9 12l2 2 4-4'],
  trustbox: ['M10 4h9a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-9', 'M4 9V5a1 1 0 0 1 1-1h2', 'M4 15v4a1 1 0 0 0 1 1h2', 'M9 9l-3 3 3 3', 'M14 9l3 3-3 3'],
  bulb: ['M9 18h6', 'M10 21h4', 'M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z'],
  rays: ['M12 1v2', 'M4.2 4.2l1.4 1.4', 'M19.8 4.2l-1.4 1.4', 'M1 11h2', 'M21 11h2'],
  leaf: ['M5 19c0-8 5-13 14-14 0 9-5 14-13 14z', 'M5 19l7-7'],
  eye: ['M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  bolt: ['M13 2L4 14h7l-1 8 9-12h-7z'],
  car: ['M5 16V11l2-5h10l2 5v5', 'M3 16h18v3H3z', 'M7 19v2', 'M17 19v2', 'M5 11h14'],
  road: ['M8 3L4 21', 'M16 3l4 18', 'M12 4v3', 'M12 10v3', 'M12 16v3'],
  steering: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M3.5 10h5.6', 'M14.9 10h5.6', 'M12 15v6'],
  receipt: ['M6 3h12v18l-3-2-3 2-3-2-3 2z', 'M9 8h6', 'M9 12h6', 'M9 16h3'],
  mail: ['M3 6h18v12H3z', 'M3 7l9 6 9-6'],
  vault: ['M4 4h16v16H4z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M7 20v1', 'M17 20v1'],
  sun: ['M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M12 2v2', 'M12 20v2', 'M4.9 4.9l1.4 1.4', 'M17.7 17.7l1.4 1.4', 'M2 12h2', 'M20 12h2', 'M4.9 19.1l1.4-1.4', 'M17.7 6.3l1.4-1.4'],
  flower: ['M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M12 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6z', 'M12 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', 'M10 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z', 'M14 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0z'],
  gift: ['M4 10h16v10H4z', 'M3 7h18v3H3z', 'M12 7v13', 'M12 7C10 3 7 4 8 7', 'M12 7c2-4 5-3 4 0'],
  ticket2: ['M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z', 'M14 7v10'],
}

/** Icoon uit ui/icons.js of uit de extra set hierboven. */
export function LineIcon({ name, size = 22, color = colors.kmNavy, strokeWidth = 1.8 }) {
  const paths = extraIcons[name]
  if (!paths) return <Icon name={name} size={size} color={color} />
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths.map((d) => <Path key={d} d={d} />)}
    </Svg>
  )
}
