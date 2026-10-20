import { useState } from 'react'
import { KateAvatar } from '../../components/ui/KateAvatar.jsx'
import { Icon } from '../../components/ui/Icon.jsx'
import { matchIntent } from '../../engine/kateIntents.js'

export function KateSheet({ customer, items, signals, actions }) {
  const [text, setText] = useState('')
  const [reply, setReply] = useState(null)
  const fixable = items.find((i) => !i.returned && !i.repair)
  const tip = signals.find((s) => s.productId)

  const handlers = {
    defect: () => (fixable ? actions.navigate('repair', { itemKey: fixable.key }) : setReply('Je leent nog niets dat ik kan laten herstellen.')),
    overview: () => actions.navigate('mykbc'),
    tip: () => (tip ? actions.navigate('product', { productId: tip.productId, signalId: tip.id }) : setReply('Ik heb op dit moment geen nieuwe tip voor je.')),
  }

  const chips = [
    fixable && ['Er is iets kapot', 'defect'],
    tip && ['Heb je een tip voor mij?', 'tip'],
    ['Wat leen ik via KBC Loop?', 'overview'],
  ].filter(Boolean)

  const submit = (e) => {
    e.preventDefault()
    const intent = matchIntent(text)
    if (intent) handlers[intent]()
    else setReply('Dat begrijp ik nog niet. Probeer bv. “mijn lamp flikkert”.')
  }

  return (
    <div className="sheet-backdrop" onClick={actions.closeKate}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Kate">
        <div className="sheet-grip" />
        <div className="kate-msg"><KateAvatar /><p>Dag {customer.name}, ik ben Kate. Waarmee kan ik je helpen?</p></div>
        {reply && <div className="kate-msg"><KateAvatar /><p>{reply}</p></div>}
        <div className="chips">{chips.map(([label, intent]) => <button key={label} onClick={handlers[intent]}>{label}</button>)}</div>
        <form className="kate-input" onSubmit={submit}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Typ je vraag aan Kate…" aria-label="Vraag aan Kate" />
          <button type="submit" aria-label="Verstuur"><Icon name="send" size={18} /></button>
        </form>
      </div>
    </div>
  )
}
