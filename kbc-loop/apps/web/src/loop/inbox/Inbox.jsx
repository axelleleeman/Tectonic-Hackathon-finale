import { useEffect, useRef, useState } from 'react'
import { TODAY } from '@kbc-loop/shared/config/index.js'
import { dayLabel } from '../product/format.js'
import { inboxList, webTarget } from './inboxModel.js'
import './inbox.css'

const quietDate = (d) => { const iso = String(d).slice(0, 10); return iso === TODAY ? 'Today' : dayLabel(iso) }
const BELL = 'M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 21h4'

/**
 * Bell with an unread badge in the KBC LOOP header; opens a small panel with the customer's notifications.
 * Tapping a notification marks it read and opens its target; "Mark all as read" clears the badge.
 */
export function Inbox({ loop, actions, go }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)
  const list = inboxList(loop.state)
  const unread = list.filter((n) => !n.read)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); wrap.current?.querySelector('button')?.focus() } }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  const markRead = (ids) => { if (ids.length) actions.markNotificationsRead?.(ids) }
  const openOne = (n) => {
    if (!n.read) markRead([n.id])
    setOpen(false)
    go(...webTarget(n.target))
  }

  const label = unread.length ? `Notifications, ${unread.length} unread` : 'Notifications'
  return (
    <div className="ib" ref={wrap}>
      <button type="button" className="lp-iconbtn ib-bell" aria-label={label} title="Notifications" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <svg className="lp-i" width={18} height={18} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={BELL} /></svg>
        {unread.length > 0 && <span className="ib-badge lp-num" aria-hidden="true">{unread.length > 9 ? '9+' : unread.length}</span>}
      </button>
      {open && (
        <div className="ib-panel lp-card" role="dialog" aria-label="Notifications">
          <div className="ib-head">
            <b>Notifications</b>
            <button type="button" className="lp-btn lp-ghost lp-sm" disabled={!unread.length} onClick={() => markRead(unread.map((n) => n.id))}>Mark all as read</button>
          </div>
          {list.length ? (
            <ul className="ib-list">
              {list.map((n) => (
                <li key={n.id}>
                  <button type="button" className={`ib-item ${n.read ? '' : 'ib-unread'}`} onClick={() => openOne(n)}>
                    <span className="ib-dot" aria-hidden="true" />
                    <span className="ib-body">
                      <b>{n.title}</b>
                      {n.body && <span>{n.body}</span>}
                    </span>
                    {n.date && <time className="ib-date" dateTime={n.date}>{quietDate(n.date)}</time>}
                    {!n.read && <span className="lp-sr"> (unread)</span>}
                  </button>
                </li>
              ))}
            </ul>
          ) : <p className="ib-empty">You are all caught up.</p>}
        </div>
      )}
    </div>
  )
}
