import { Photo } from '../../components/ui/Photo.jsx'
import { categoriesFor } from '../../engine/catalog.js'
import { categoryPhoto } from '../../data/index.js'

export function Shop({ customer, actions }) {
  const cats = categoriesFor(customer.type)
  return (
    <>
      <Photo className="hero" src={categoryPhoto('hero')} tint={['#00aeef', '#003665']} icon="♻️">
        <span className="hero-kicker">KBC Loop</span>
        <b>Lenen in plaats van kopen</b>
        <small>De partner blijft eigenaar en herstelt. Jij betaalt per maand, KBC regelt financiering en verzekering.</small>
      </Photo>

      <h4>Categorieën</h4>
      <div className="cat-grid">
        {cats.map((c) => (
          <button key={c.id} className="cat-card" onClick={() => actions.navigate('category', { categoryId: c.id })}>
            <Photo src={categoryPhoto(c.id)} tint={c.tint} icon={c.icon} />
            <div className="cat-body">
              <b>{c.name}</b>
              <small>{c.partners.length} partner{c.partners.length > 1 ? 's' : ''} · {c.productCount} product{c.productCount > 1 ? 'en' : ''}</small>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}
