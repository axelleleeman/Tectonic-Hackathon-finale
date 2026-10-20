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
        <div className="lp-min0">
          <h2 id="lp-home-title">Your home</h2>
          <p>Everything you use through KBC LOOP. Open a product for its contract, condition and repairs.</p>
        </div>
        <button type="button" className="lp-add" onClick={onAdd}>
          <span className="lp-add-ic" aria-hidden="true"><LoopIcon name="plus" size={20} /></span>
          <span>Add a product</span>
        </button>
      </div>
      {owned.length === 0 && (
        <div className="lp-card lp-empty">
          <p>You are not using anything through KBC LOOP yet. Add a product from the catalogue to get started.</p>
        </div>
      )}
      {owned.map((s) => (
        <CategorySection key={s.category.id} category={s.category} rows={s.rows} flashKey={flashKey} onOpen={onOpen} onBrowse={onBrowse} />
      ))}
      {empty.length > 0 && (
        <div className="lp-empties">
          <h3 className="lp-empties-title">More categories</h3>
          {empty.map((s) => (
            <CategorySection key={s.category.id} category={s.category} rows={[]} onOpen={onOpen} onBrowse={onBrowse} />
          ))}
        </div>
      )}
    </section>
  )
}
