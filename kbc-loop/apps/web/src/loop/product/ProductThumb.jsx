import { categoryOf } from '@kbc-loop/shared/engine/catalog.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { productIcon } from '../model.js'

// TEMPORARY guard: the shared ProductImage lands in parallel.
const ProductImage = Object.values(import.meta.glob('../../../../../packages/web-ui/src/components/ProductImage.jsx', { eager: true }))[0]?.ProductImage

/** Product illustration in one of three sizes (md = list thumb, lg = option card, hero = product page). */
export function ProductThumb({ product, size = 'md' }) {
  return (
    <span className={`pp-thumb pp-thumb-${size}`} aria-hidden="true">
      {ProductImage
        ? <ProductImage product={product} size={size} />
        : <LoopIcon name={productIcon(product.id, categoryOf(product)?.id)} size={size === 'hero' ? 72 : size === 'lg' ? 36 : 22} />}
    </span>
  )
}
