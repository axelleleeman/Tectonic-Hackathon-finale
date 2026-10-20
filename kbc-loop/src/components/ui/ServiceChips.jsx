/** Toont bestaande KBC-diensten als chips, met de officiële naam als tooltip. */
export function ServiceChips({ services, withRole = false }) {
  return (
    <div className={`svc-chips ${withRole ? 'rows' : ''}`}>
      {services.map((s) => (
        <span key={`${s.role ?? ''}-${s.id}`} className="svc-chip" title={s.name}>
          <em>KBC</em>{withRole && s.role ? <><b>{s.role}</b> · </> : null}{s.label}
        </span>
      ))}
    </div>
  )
}
