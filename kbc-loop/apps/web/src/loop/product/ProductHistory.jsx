import { date } from './format.js'

/** Lifecycle of one item, derived from the shared state: delivery, repairs, the open repair and the return. */
export function ProductHistory({ row, endDate }) {
  const { item, partner } = row
  const repairs = item.repairs ?? 0
  const events = [{ title: 'Delivered and installed', text: date(item.since) }]
  if (repairs > 0) events.push({ title: `Repaired ${repairs === 1 ? 'once' : `${repairs} times`} instead of replaced`, text: 'Included in your subscription' })
  if (item.repair) {
    events.push({
      title: `${item.repair.preventive ? 'Wear reported by the device' : 'Problem reported'}: ${item.repair.issue}`,
      text: item.repair.step >= 3 ? 'Repaired and tested' : `Repair step ${item.repair.step} of 3`,
      now: true,
    })
  }
  events.push(item.returned
    ? { title: `Returned to ${partner.name}`, text: `${item.returnedOn ? `${date(item.returnedOn)} · ` : ''}Parts and materials get a second life` }
    : { title: `Contract ends · returns to ${partner.name}`, text: `${date(endDate)} · or keep it longer`, future: true })

  return (
    <section className="pp-section" aria-labelledby="pp-history-title">
      <div className="pp-sechead"><h2 id="pp-history-title">History</h2></div>
      <ol className="pp-history lp-card">
        {events.map((e) => (
          <li key={e.title} className={e.now ? 'pp-h-now' : e.future ? 'pp-h-future' : ''}>
            <b>{e.title}</b><small>{e.text}</small>
          </li>
        ))}
      </ol>
    </section>
  )
}
