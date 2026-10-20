// "A photo of my product": a real photo when one exists (shared/ui/photos), otherwise the product's
// original illustration (shared/ui/illustrations) rendered as inline SVG. Same props as the app version.
import { useId, useState } from 'react'
import { illustrationFor, productLabel } from '@kbc-loop/shared/ui/illustrations/index.js'
import { photoKeyFor } from '@kbc-loop/shared/ui/photos/index.js'
import { photoAssets } from '@kbc-loop/shared/ui/photos/assets.js'

const HEIGHTS = { md: 96, lg: 180 }
const RADII = { md: 14, lg: 20, hero: 24 }

function frameStyle(size, rounded, style) {
  const base = size === 'hero'
    ? { width: '100%', aspectRatio: '4 / 3' }
    : { height: HEIGHTS[size] ?? HEIGHTS.md, width: Math.round((HEIGHTS[size] ?? HEIGHTS.md) * (4 / 3)) }
  return { display: 'block', overflow: 'hidden', flexShrink: 0, borderRadius: rounded ? (RADII[size] ?? RADII.md) : 0, ...base, ...style }
}

/**
 * @param {object} props
 * @param {object|string} props.product  catalogue product (or its id)
 * @param {'md'|'lg'|'hero'} [props.size] md ≈ 96 px card thumb, lg ≈ 180 px, hero = full width 4:3
 * @param {boolean} [props.rounded]
 * @param {object} [props.style]          extra inline style for the frame (e.g. width: '100%')
 * @param {string} [props.className]
 * @param {boolean} [props.photo]         false forces the illustration
 */
export function ProductImage({ product, size = 'md', rounded = true, style, className, photo = true }) {
  const label = productLabel(product)
  const [failed, setFailed] = useState(false)
  const src = photo && !failed ? photoAssets[photoKeyFor(product)] : null
  const frame = frameStyle(size, rounded, style)

  if (src) {
    return (
      <img src={src} alt={label} className={className} loading="lazy" decoding="async" onError={() => setFailed(true)}
        style={{ objectFit: 'cover', background: '#E9EEF4', ...frame }} />
    )
  }
  return <ProductIllustration product={product} label={label} className={className} style={frame} />
}

/** The illustration on its own (inline SVG, unique gradient ids per instance). */
export function ProductIllustration({ product, label = productLabel(product), className, style }) {
  const spec = illustrationFor(product)
  const uid = `pi${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const ref = (v) => (typeof v === 'string' && v.startsWith('url(#') ? `url(#${uid}-${v.slice(5, -1)})` : v)
  const [x, y, w, h] = spec.viewBox.split(' ').map(Number)
  const gradients = [{ id: 'bg', stops: [[0, spec.background[0]], [1, spec.background[1]]], x1: 0, y1: 0, x2: 1, y2: 1 }, ...(spec.gradients ?? [])]

  return (
    <svg role="img" aria-label={label} className={className} style={style} viewBox={spec.viewBox} preserveAspectRatio="xMidYMid slice">
      <defs>
        {gradients.map((g) => (
          <linearGradient key={g.id} id={`${uid}-${g.id}`} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}>
            {g.stops.map(([offset, color, opacity]) => <stop key={offset} offset={offset} stopColor={color} stopOpacity={opacity ?? 1} />)}
          </linearGradient>
        ))}
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${uid}-bg)`} />
      {spec.shapes.map((s, i) => (
        <path key={i} d={s.d} fill={ref(s.fill)} opacity={s.opacity} stroke={ref(s.stroke)} strokeWidth={s.strokeWidth}
          strokeLinecap={s.stroke ? 'round' : undefined} strokeLinejoin={s.stroke ? 'round' : undefined} />
      ))}
    </svg>
  )
}
