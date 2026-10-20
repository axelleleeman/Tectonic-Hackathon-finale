import { Icon } from '../../components/ui/Icon.jsx'
import { Photo } from '../../components/ui/Photo.jsx'
import { categoriesFor } from '../../engine/catalog.js'
import { categoryPhoto } from '../../data/index.js'
import { euro } from '../../engine/format.js'

// Tabblad "Aanbod": KBC Loop als nieuwe rubriek, met per categorie een rij partners en producten.
export function Shop({ customer, items, actions }) {
  const cats = categoriesFor(customer.type)
  const inUse = (id) => items.some((i) => i.productId === id && !i.returned)

  return (
    <>
      <div className="promo-card">
        <div>
          <span className="badge-new">Nieuw</span>
          <p><b>KBC Loop</b>: leen in plaats van te kopen. De partner blijft eigenaar en herstelt, KBC regelt financiering en verzekering.</p>
          <button className="pill-btn" onClick={() => actions.navigate('category', { categoryId: cats[0].id })}>Ontdek de partners</button>
        </div>
        <span className="promo-icon"><Icon name="loop" size={40} /></span>
      </div>

      {cats.map((c) => (
        <section key={c.id}>
          <div className="section-head">
            <h2>{c.name}</h2>
            <button className="head-link" onClick={() => actions.navigate('category', { categoryId: c.id })}>Alles tonen</button>
          </div>
          <div className="tile-row">
            <button className="tile photo-tile" onClick={() => actions.navigate('category', { categoryId: c.id })}>
              <Photo src={categoryPhoto(c.id)} tint={c.tint} icon={c.icon} />
              <span>{c.partners.length} partner{c.partners.length > 1 ? 's' : ''}</span>
            </button>
            {c.partners.flatMap((pa) => pa.products).map((p) => (
              <button key={p.id} className="tile" onClick={() => actions.navigate('product', { productId: p.id, signalId: null, categoryId: c.id })}>
                {inUse(p.id) && <em className="badge-in-use">In gebruik</em>}
                <span className="tile-icon">{p.icon}</span>
                <span>{p.name}</span>
                <small>{euro(p.monthly)}/maand</small>
              </button>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
