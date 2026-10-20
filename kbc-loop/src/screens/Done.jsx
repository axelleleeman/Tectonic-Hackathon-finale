import { productById, partnerNames } from '../engine/catalog.js'

export function Done({ productId, actions }) {
  const p = productById(productId)
  return (
    <div className="done">
      <div className="check">✓</div>
      <h2>Geleend!</h2>
      <p>{partnerNames(p)} neemt contact op voor de levering. Financiering en verzekering staan klaar bij KBC. Gaat er iets kapot? Eén tik in Mijn KBC en de partner komt het herstellen.</p>
      <button className="primary" onClick={() => actions.navigate('mykbc')}>Naar Mijn KBC</button>
    </div>
  )
}
