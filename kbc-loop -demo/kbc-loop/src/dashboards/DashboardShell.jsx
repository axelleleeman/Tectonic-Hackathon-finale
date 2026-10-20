export function DashboardShell({ eyebrow, title, note, children }) {
  return (
    <section className="dashboard">
      <header className="dash-head">
        <span className="dash-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <small>{note}</small>
      </header>
      {children}
    </section>
  )
}
