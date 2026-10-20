import { StatusBar } from './StatusBar.jsx'

export function PhoneFrame({ header, footer, overlay, children }) {
  return (
    <div className="phone">
      <div className="notch" />
      <div className="screen">
        <StatusBar />
        {header}
        <main className="content">{children}</main>
        {footer}
        {overlay}
      </div>
    </div>
  )
}
