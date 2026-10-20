import { LoopIcon } from '../LoopIcon.jsx'
import { CategorySection } from './CategorySection.jsx'

/**
 * "Your home": every category, with the products the customer has (active and returned as history).
 * The "Add a product" button sits next to the title; on phones it floats at the bottom right.
 */
export function YourHome({ sections, flashKey, onOpen, onBrowse, onAdd }) {
  const owned = sections.filter((s) => s.rows.length)
  const empty = sections.filter((s) => !s.rows.length)
  return (
    <section className="lp-home" id="lp-home" aria-labelledby="lp-home-title">
      <div className="lp-home-head">
        <h2 id="lp-home-title">Your home</h2>
        <button type="button" className="lp-add" onClick={onAdd}>
          <LoopIcon name="plus" size={18} />
          <span>Add a product</span>
        </button>
      </div>
      {owned.length === 0 && (
        <div className="lp-card lp-empty"><p>Nothing in your home yet.</p></div>
      )}
      {owned.map((s) => (
        <CategorySection key={s.category.id} category={s.category} rows={s.rows} flashKey={flashKey} onOpen={onOpen} onBrowse={onBrowse} />
      ))}
      {empty.length > 0 && (
        <div className="lp-empties">
          <h3 className="lp-empties-title">Explore more</h3>
          <div className="lp-chips">
            {empty.map((s) => (
              <CategorySection key={s.category.id} category={s.category} rows={[]} onOpen={onOpen} onBrowse={onBrowse} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
