export function Stat({ value, label, hint, tone }) {
  return (
    <div className={`stat ${tone ?? ''}`}>
      <strong>{value}</strong>
      <small>{label}</small>
      {hint && <em>{hint}</em>}
    </div>
  )
}
