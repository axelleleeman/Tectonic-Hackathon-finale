import { dayLabel, money, signedMoney } from '../product/format.js'

/** The next six monthly direct debits, with the change versus the month before. */
export function UpcomingPayments({ upcoming }) {
  return (
    <table className="cp-table">
      <caption className="lp-sr">Upcoming payments</caption>
      <thead>
        <tr><th scope="col">Date</th><th scope="col" className="cp-num">Amount</th></tr>
      </thead>
      <tbody>
        {upcoming.map((u, n) => {
          const change = n ? u.amount - upcoming[n - 1].amount : 0
          return (
            <tr key={u.date}>
              <th scope="row">{dayLabel(u.date)} {u.date.slice(0, 4)}{n === 0 && <span className="lp-tag cp-next">Next</span>}</th>
              <td className="cp-num lp-num"><b>{money(u.amount)}</b>{change !== 0 && <small>{signedMoney(change)}</small>}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
