import { useEffect, useRef, useState } from 'react'
import { Icon } from '../components/Icon.jsx'

/** Stop button with an inline confirmation (no modal). */
export function StopCampaign({ label, onStop }) {
  const [confirm, setConfirm] = useState(false)
  const keepRef = useRef(null)
  useEffect(() => { if (confirm) keepRef.current?.focus() }, [confirm])
  return (
    <section className="ins-card ins-pad ins-stop" aria-labelledby="stop-title">
      <div className="ins-min0">
        <h2 id="stop-title" className="ins-h2">Stop campaign</h2>
        {confirm && <p className="ins-muted ins-small">Customers who already received it keep their offer.</p>}
      </div>
      {confirm ? (
        <div className="ins-row" role="group" aria-label={`Confirm stopping the campaign for ${label}`}>
          <button type="button" ref={keepRef} className="ins-btn" onClick={() => setConfirm(false)}>Keep running</button>
          <button type="button" className="ins-btn ins-danger" onClick={onStop}><Icon name="stop" size={16} />Yes, stop campaign</button>
        </div>
      ) : (
        <button type="button" className="ins-btn" onClick={() => setConfirm(true)}><Icon name="stop" size={16} />Stop campaign</button>
      )}
    </section>
  )
}
