import { useMemo, useState } from 'react'
import { num } from '@kbc-loop/shared/engine/format.js'
import { SortHeader } from '../components/SortHeader.jsx'
import { nextSort, sortRows } from '../sorting.js'

/** Sortable columns: [key, header, value getter, numeric] */
const COLUMNS = [
  ['name', 'Partner', (r) => r.name, false],
  ['inField', 'Products in field', (r) => r.inField, true],
  ['openRepairs', 'Open repairs', (r) => r.openRepairs, true],
  ['repairHours', 'Avg repair time', (r) => r.repairHours, true],
  ['refurbishRate', 'Refurbish rate', (r) => r.refurbishRate, true],
  ['potential', 'Expected contracts', (r) => r.potential, true],
]

/** Partner performance in one sortable table (cards on small screens). */
export function PartnersTable({ rows }) {
  const [sort, setSort] = useState({ key: 'inField', dir: 'desc' })
  const sorted = useMemo(() => sortRows(rows, COLUMNS, sort), [rows, sort])
  const label = COLUMNS.find(([k]) => k === sort.key)[1]
  return (
    <section className="ins-section" aria-labelledby="partners-h">
      <div className="ins-section-head">
        <h2 id="partners-h" className="ins-h2">Partners</h2>
        <p className="ins-chart-cap">Products in the field and open repairs are live; repair time and refurbish rate come from the partner profiles (illustrative)</p>
      </div>
      <div className="ins-card ins-table-card">
        <table className="ins-table ins-ptable">
          <caption className="ins-sr">Partner performance, sorted by {label} ({sort.dir === 'asc' ? 'ascending' : 'descending'})</caption>
          <thead>
            <tr>{COLUMNS.map(([k, l, , numeric]) => <SortHeader key={k} id={k} label={l} numeric={numeric} sort={sort} onSort={(key, n) => setSort((s) => nextSort(s, key, n))} />)}</tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id}>
                <th scope="row"><b>{r.name}</b><small>{r.category}</small></th>
                <td className="r ins-num" data-label="Products in field">{num(r.inField)}</td>
                <td className={`r ins-num ${r.openRepairs ? 'ins-warn' : ''}`} data-label="Open repairs">{num(r.openRepairs)}</td>
                <td className="r ins-num" data-label="Avg repair time">{num(r.repairHours)} h</td>
                <td className="r ins-num" data-label="Refurbish rate">
                  <span className="ins-meter" aria-hidden="true"><span style={{ width: `${r.refurbishRate}%` }} /></span>{num(r.refurbishRate)}%
                </td>
                <td className="r ins-num" data-label="Expected contracts">{num(r.potential)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
