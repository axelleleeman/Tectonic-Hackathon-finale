// "A photo of my product": a real photo when one exists (shared/ui/photos), otherwise the product's
// original illustration (shared/ui/illustrations) drawn with react-native-svg. Same props as the web version.
import { useId, useState } from 'react'
import { Image, View } from 'react-native'
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg'
import { illustrationFor, productLabel } from '@kbc-loop/shared/ui/illustrations/index.js'
import { photoKeyFor } from '@kbc-loop/shared/ui/photos/index.js'
import { photoAssets } from '@kbc-loop/shared/ui/photos/assets.js'

const HEIGHTS = { md: 96, lg: 180 }
const RADII = { md: 14, lg: 20, hero: 24 }

function frameStyle(size, rounded) {
  const base = size === 'hero'
    ? { width: '100%', aspectRatio: 4 / 3 }
    : { height: HEIGHTS[size] ?? HEIGHTS.md, width: Math.round((HEIGHTS[size] ?? HEIGHTS.md) * (4 / 3)) }
  return { overflow: 'hidden', backgroundColor: '#E9EEF4', borderRadius: rounded ? (RADII[size] ?? RADII.md) : 0, ...base }
}

/**
 * @param {object} props
 * @param {object|string} props.product  catalogue product (or its id)
 * @param {'md'|'lg'|'hero'} [props.size] md ≈ 96 pt card thumb, lg ≈ 180 pt, hero = full width 4:3
 * @param {boolean} [props.rounded]
 * @param {object} [props.style]          extra style for the frame (e.g. { width: '100%' })
 * @param {boolean} [props.photo]         false forces the illustration
 */
export function ProductImage({ product, size = 'md', rounded = true, style, photo = true }) {
  const label = productLabel(product)
  const [failed, setFailed] = useState(false)
  const source = photo && !failed ? photoAssets[photoKeyFor(product)] : null

  return (
    <View style={[frameStyle(size, rounded), style]} accessible accessibilityRole="image" accessibilityLabel={label}>
      {source
        ? <Image source={source} style={{ width: '100%', height: '100%' }} resizeMode="cover" onError={() => setFailed(true)} />
        : <ProductIllustration product={product} />}
    </View>
  )
}

/** The illustration on its own, filling its parent (unique gradient ids per instance). */
export function ProductIllustration({ product }) {
  const spec = illustrationFor(product)
  const uid = `pi${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const ref = (v) => (typeof v === 'string' && v.startsWith('url(#') ? `url(#${uid}-${v.slice(5, -1)})` : v)
  const [x, y, w, h] = spec.viewBox.split(' ').map(Number)
  const gradients = [{ id: 'bg', stops: [[0, spec.background[0]], [1, spec.background[1]]], x1: 0, y1: 0, x2: 1, y2: 1 }, ...(spec.gradients ?? [])]

  return (
    <Svg width="100%" height="100%" viewBox={spec.viewBox} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <Defs>
        {gradients.map((g) => (
          <LinearGradient key={g.id} id={`${uid}-${g.id}`} x1={String(g.x1)} y1={String(g.y1)} x2={String(g.x2)} y2={String(g.y2)}>
            {g.stops.map(([offset, color, opacity]) => <Stop key={offset} offset={String(offset)} stopColor={color} stopOpacity={opacity ?? 1} />)}
          </LinearGradient>
        ))}
      </Defs>
      <Rect x={x} y={y} width={w} height={h} fill={`url(#${uid}-bg)`} />
      {spec.shapes.map((s, i) => (
        <Path key={i} d={s.d} fill={ref(s.fill)} opacity={s.opacity ?? 1} stroke={ref(s.stroke)} strokeWidth={s.strokeWidth}
          strokeLinecap={s.stroke ? 'round' : undefined} strokeLinejoin={s.stroke ? 'round' : undefined} />
      ))}
    </Svg>
  )
}
