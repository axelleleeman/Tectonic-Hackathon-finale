import { ProductImage } from '@kbc-loop/web-ui/components/ProductImage.jsx'

/** Product photo or illustration in one of three sizes (md = list thumb, lg = option card, hero = product page). */
export function ProductThumb({ product, size = 'md' }) {
  return (
    <span className={`pp-thumb pp-thumb-${size}`} aria-hidden="true">
      <ProductImage product={product} size={size} />
    </span>
  )
}
