import { date } from './format.js'

/** Lifecycle of one item: delivery, repairs, the open repair and the return. */
export function ProductHistory({ row, endDate }) {
  const { item } = row
  const repairs = item.repairs ?? 0
  const events = [{ title: 'Delivered', text: date(item.since) }]
  if (repairs > 0) events.push({ title: repairs === 1 ? 'Repaired' : `Repaired ${repairs}×`, text: 'Included' })
  if (item.repair) events.push({ title: item.repair.issue, text: item.repair.step >= 3 ? 'Repaired' : `Repair step ${item.repair.step} of 3`, now: true })
  events.push(item.returned
    ? { title: 'Returned', text: date(item.returnedOn) }
    : { title: 'Contract ends', text: date(endDate), future: true })

  return (
    <section aria-labelledby="pp-history-h">
      <h3 id="pp-history-h" className="pp-h3">History</h3>
      <ol className="pp-history">
        {events.map((e) => (
          <li key={e.title} className={e.now ? 'pp-h-now' : e.future ? 'pp-h-future' : ''}>
            <b>{e.title}</b><small>{e.text}</small>
          </li>
        ))}
      </ol>
    </section>
  )
}
