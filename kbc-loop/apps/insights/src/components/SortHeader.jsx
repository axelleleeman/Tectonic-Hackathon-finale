/** Column header with a sort button; aria-sort tells assistive tech the current order. */
export function SortHeader({ id, label, numeric, sort, onSort }) {
  const on = sort.key === id
  return (
    <th scope="col" className={numeric ? 'r' : ''} aria-sort={on ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className={`ins-sort ${on ? 'on' : ''}`} onClick={() => onSort(id, numeric)}>
        {label}<span className={`ins-sort-i ${on ? sort.dir : ''}`} aria-hidden="true" />
      </button>
    </th>
  )
}
