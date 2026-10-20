// Product picture for the product and cost screens, drawn by the shared ProductImage:
// small rows get the crisp illustration, larger sizes the real product photo.
import { ProductImage } from '../../ui/ProductImage.js'

const SIZES = { sm: { box: 48, radius: 12, photo: false }, md: { box: 64, radius: 14, photo: true }, lg: { box: 96, radius: 16, photo: true } }

export function ProductArt({ product, size = 'md', style }) {
  if (size === 'hero') return <ProductImage product={product} size="hero" style={style} />
  const s = SIZES[size] ?? SIZES.md
  return <ProductImage product={product} photo={s.photo} style={[{ width: s.box, height: s.box, borderRadius: s.radius }, style]} />
}
