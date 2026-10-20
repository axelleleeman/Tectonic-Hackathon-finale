import { productById, partnerOf } from '../../engine/catalog.js'
import { euro, formatDate } from '../../engine/format.js'
import { COINS } from '../../config/index.js'

const STAGES = ['Geleverd', 'In gebruik', 'Herstel', 'Terugname', 'Nieuw leven']

function stageState(item, n) {
  if (item.returned) return 'on'
  if (n < 2) return 'on'
  if (n === 2 && (item.repairs > 0 || item.repair)) return item.repair ? 'busy' : 'on'
  return ''
}

export function LoopItemCard({ item, actions }) {
  const p = productById(item.productId)
  return (
    <div className={`sub ${item.returned ? 'returned' : ''}`}>
      <div className="subhead">
        <span className="icon sm">{p.icon}</span>
        <div>
          <b>{p.name}</b>
          <small>{partnerOf(p).name} · sinds {formatDate(item.since, { withYear: !item.since.startsWith('2026') })} · {euro(p.monthly)}/maand</small>
        </div>
      </div>
      <div className="lifecycle">
        {STAGES.map((st, n) => (
          <span key={st} className={stageState(item, n)}>{st}{n === 2 && item.repairs > 0 ? ` ×${item.repairs}` : ''}</span>
        ))}
      </div>
      {item.returned ? (
        <p className="second-life">♻ Gerefurbished door {partnerOf(p).short}: dit product leeft verder bij een nieuwe klant. +{COINS.return} Kate Coins</p>
      ) : (
        <div className="item-actions">
          <button className="report" onClick={() => actions.navigate('repair', { itemKey: item.key })}>⚠ Meld een defect</button>
          <button className="link small" onClick={() => actions.returnItem(item.key)}>Inleveren</button>
        </div>
      )}
    </div>
  )
}
