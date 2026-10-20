// Product picture for the product and cost screens. TEMPORARY fallback until ui/ProductImage.js lands:
// the category illustration with the product emoji.
import { categoryOf } from '@kbc-loop/shared/engine/catalog.js'
import { Photo } from '../../ui/Photo.js'

const SIZES = { sm: { box: 44, icon: 22 }, md: { box: 64, icon: 30 }, lg: { box: 96, icon: 44 }, hero: { box: 200, icon: 84 } }

export function ProductArt({ product, size = 'md', style }) {
  const s = SIZES[size] ?? SIZES.md
  const cat = categoryOf(product)
  const frame = size === 'hero' ? { height: s.box, borderRadius: 20 } : { width: s.box, height: s.box, borderRadius: 14 }
  return <Photo tint={cat?.tint ?? ['#e9f4fb', '#cde8f6']} icon={product.icon} iconSize={s.icon} style={[frame, style]} />
}
