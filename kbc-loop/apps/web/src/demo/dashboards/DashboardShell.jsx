import { KbcLogo } from '@kbc-loop/web-ui/components/KbcLogo.jsx'

export function DashboardShell({ eyebrow, title, note, children }) {
  return (
    <section className="dashboard">
      <header className="dash-head">
        <KbcLogo height={34} className="dash-logo" />
        <span className="dash-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <small>{note}</small>
      </header>
      {children}
    </section>
  )
}
