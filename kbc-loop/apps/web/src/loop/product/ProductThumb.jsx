import { ProductImage } from '@kbc-loop/web-ui/components/ProductImage.jsx'

/**
 * Product image in one of three sizes (md = list thumb, lg = option card, hero = product page).
 * Small thumbs use the illustration: photos do not read well at 48px.
 */
export function ProductThumb({ product, size = 'md' }) {
  return (
    <span className={`pp-thumb pp-thumb-${size}`} aria-hidden="true">
      <ProductImage product={product} size={size} photo={size !== 'md'} />
    </span>
  )
}
