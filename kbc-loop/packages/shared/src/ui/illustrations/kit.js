// Building blocks for the product illustrations: path helpers, shared materials and the common
// "product shot" stage (soft halo + floor shadow). Everything here returns plain data, so the
// specs can be rendered by react-native-svg (app) and by inline SVG (web) alike.

export const VIEWBOX = '0 0 240 180'
export const FLOOR = 156

const r2 = (v) => Math.round(v * 100) / 100

// ── Paths ───────────────────────────────────────────────────────────────────────────────────

/** Rounded rectangle. `r` is a number or [topLeft, topRight, bottomRight, bottomLeft]. */
export function rect(x, y, w, h, r = 0) {
  const [tl, tr, br, bl] = (Array.isArray(r) ? r : [r, r, r, r]).map((v) => Math.min(v, w / 2, h / 2))
  const arc = (rad, ex, ey) => (rad ? `A${r2(rad)} ${r2(rad)} 0 0 1 ${r2(ex)} ${r2(ey)}` : '')
  return `M${r2(x + tl)} ${r2(y)}H${r2(x + w - tr)}${arc(tr, x + w, y + tr)}V${r2(y + h - br)}${arc(br, x + w - br, y + h)}`
    + `H${r2(x + bl)}${arc(bl, x, y + h - bl)}V${r2(y + tl)}${arc(tl, x + tl, y)}Z`
}

export const ellipse = (cx, cy, rx, ry = rx) =>
  `M${r2(cx - rx)} ${r2(cy)}A${r2(rx)} ${r2(ry)} 0 1 0 ${r2(cx + rx)} ${r2(cy)}A${r2(rx)} ${r2(ry)} 0 1 0 ${r2(cx - rx)} ${r2(cy)}Z`

export const circle = (cx, cy, r) => ellipse(cx, cy, r, r)

/** Open polyline through [x, y] points (use with a stroke). */
export const line = (...pts) => `M${pts.map(([x, y]) => `${r2(x)} ${r2(y)}`).join('L')}`

/** Closed polygon through [x, y] points. */
export const poly = (...pts) => `${line(...pts)}Z`

/** Merge several sub-paths into one `d`, so they share a single fill. */
export const join = (...ds) => ds.flat().join(' ')

/** Linear interpolation between two points. */
export const lerp = ([ax, ay], [bx, by], t) => [ax + (bx - ax) * t, ay + (by - ay) * t]

// ── Shapes ──────────────────────────────────────────────────────────────────────────────────

export const shape = (d, fill, extra = {}) => ({ d, fill, ...extra })
export const stroke = (d, color, strokeWidth, extra = {}) => ({ d, fill: 'none', stroke: color, strokeWidth, ...extra })
/** White sheen on a surface. */
export const gloss = (d, opacity = 0.35) => ({ d, fill: '#FFFFFF', opacity })
/** Darker side or recess. */
export const shade = (d, opacity = 0.08) => ({ d, fill: '#0D2B45', opacity })

// ── Gradients ───────────────────────────────────────────────────────────────────────────────

const DIRS = { v: [0, 0, 0, 1], h: [0, 0, 1, 0], d: [0, 0, 1, 1], u: [0, 1, 0, 0] }

/** Linear gradient in object-bounding-box units. `dir` is 'v', 'h', 'd' (diagonal) or [x1, y1, x2, y2]. */
export function linear(id, from, to, dir = 'd') {
  const [x1, y1, x2, y2] = Array.isArray(dir) ? dir : DIRS[dir]
  return { id, stops: [[0, from], [1, to]], x1, y1, x2, y2 }
}

/** Shared materials so every illustration uses the same white, steel, graphite, glass and wood. */
export const materials = {
  white: (id = 'white', dir = 'd') => linear(id, '#FFFFFF', '#DCE3EB', dir),
  steel: (id = 'steel', dir = 'd') => linear(id, '#F4F7FA', '#AAB6C4', dir),
  graphite: (id = 'graphite', dir = 'd') => linear(id, '#5E6979', '#232933', dir),
  glass: (id = 'glass', dir = 'd') => linear(id, '#3B4C6B', '#101726', dir),
  wood: (id = 'wood', dir = 'd') => linear(id, '#F3D9B5', '#C8935C', dir),
  glow: (id = 'glow', dir = 'v') => linear(id, '#FFF3C4', '#FFC24D', dir),
}

// ── Category look ───────────────────────────────────────────────────────────────────────────

export const backgrounds = {
  energy: ['#FFF8E7', '#FFE4BA'],
  appliances: ['#EFF7FE', '#D2E7F8'],
  electronics: ['#F3F1FF', '#DCD5FB'],
  mobility: ['#ECF9F2', '#CBEDDB'],
  family: ['#FFF1F6', '#F9D5E2'],
  business: ['#F1F4F8', '#D5DEE9'],
  generic: ['#F4F6F9', '#DDE4EC'],
}

/** Two-tone accent per category (light, deep). */
export const accents = {
  energy: ['#FFCB52', '#EE8A1F'],
  appliances: ['#62B6F2', '#1D6CC0'],
  electronics: ['#A193FF', '#5A3ED6'],
  mobility: ['#43D59E', '#0C8C6B'],
  family: ['#FF9FC0', '#DE4C7D'],
  business: ['#64A0DB', '#1C4A78'],
  generic: ['#7FB3E6', '#2E6DB0'],
}

export const accent = (category, id = 'accent', dir = 'd') => linear(id, accents[category][0], accents[category][1], dir)

// ── Stage ───────────────────────────────────────────────────────────────────────────────────

/** Soft contact shadow on the floor, centred on `cx`. */
export const floorShadow = (cx = 120, rx = 60, y = FLOOR) => [
  { d: ellipse(cx, y, rx, 7), fill: '#0D2B45', opacity: 0.1 },
  { d: ellipse(cx, y, rx * 0.72, 3.6), fill: '#0D2B45', opacity: 0.14 },
]

/**
 * Assemble an illustration spec on the shared stage.
 * @param {object} o
 * @param {string} o.type        illustration type id
 * @param {string} o.category    key of `backgrounds`
 * @param {Array}  o.shapes      product shapes, back to front
 * @param {Array}  [o.gradients] gradient definitions referenced as url(#id)
 * @param {[number, number]|false} [o.shadow] [centreX, radiusX] of the floor shadow, or false
 */
export function scene({ type, category, shapes, gradients = [], shadow = [120, 60] }) {
  return {
    type,
    category,
    viewBox: VIEWBOX,
    background: backgrounds[category],
    gradients,
    shapes: [
      { d: circle(120, 82, 74), fill: '#FFFFFF', opacity: 0.45 },
      ...(shadow ? floorShadow(shadow[0], shadow[1]) : []),
      ...shapes,
    ],
  }
}

/** Bicycle-style wheel: tyre, rim, spokes and hub (4 shapes). */
export function wheel(cx, cy, r, tyre = '#262C36') {
  const spokes = []
  for (let i = 0; i < 6; i += 1) {
    const a = (i * Math.PI) / 6
    const dx = Math.cos(a) * (r - 4)
    const dy = Math.sin(a) * (r - 4)
    spokes.push(line([cx - dx, cy - dy], [cx + dx, cy + dy]))
  }
  return [
    stroke(circle(cx, cy, r - 2.5), tyre, 5),
    stroke(circle(cx, cy, r - 5.5), '#C9D3DE', 1.6),
    stroke(join(spokes), '#9AA6B4', 0.8, { opacity: 0.8 }),
    shape(circle(cx, cy, Math.max(2.5, r / 8)), '#5E6979'),
  ]
}
