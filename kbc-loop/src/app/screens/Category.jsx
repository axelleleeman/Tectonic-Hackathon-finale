import { Photo } from '../../components/ui/Photo.jsx'
import { categoriesFor } from '../../engine/catalog.js'
import { categoryPhoto } from '../../data/index.js'
import { euro } from '../../engine/format.js'
import { ServiceChips } from '../../components/ui/ServiceChips.jsx'
import { servicesForCategory } from '../../engine/integrations.js'

export function Category({ customer, categoryId, items, actions }) {
  const cat = categoriesFor(customer.type).find((c) => c.id === categoryId)
  if (!cat) return null
  const inUse = (id) => items.some((i) => i.productId === id && !i.returned)

  return (
    <>
      <Photo className="cat-hero" src={categoryPhoto(cat.id)} tint={cat.tint} icon={cat.icon}>
        <b>{cat.name}</b>
        <small>{cat.blurb}</small>
      </Photo>

      {cat.partners.map((pa) => (
        <section key={pa.id} className="partner-section">
          <div className="partner-head">
            <span className="partner-logo">{pa.short.slice(0, 2)}</span>
            <div><b>{pa.name}</b><small>{pa.tagline}</small></div>
          </div>
          <div className="product-row">
            {pa.products.map((p) => (
              <button key={p.id} className="product-card" onClick={() => actions.navigate('product', { productId: p.id, signalId: null, categoryId: cat.id })}>
                <span className="icon">{p.icon}</span>
                <b>{p.name}</b>
                <small>{p.detail}</small>
                <span className="from">{inUse(p.id) ? '✓ in gebruik' : `${euro(p.monthly)}/maand`}</span>
              </button>
            ))}
          </div>
        </section>
      ))}

      {servicesForCategory(cat.id).length > 0 && (
        <div className="kbc-box">
          <b>Ook bij KBC</b>
          <ServiceChips services={servicesForCategory(cat.id)} />
        </div>
      )}
    </>
  )
}
