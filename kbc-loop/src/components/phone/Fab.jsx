import { Icon } from '../ui/Icon.jsx'

/** Ronde betaalknop rechtsonder, zoals in KBC Mobile (in de demo niet actief). */
export function Fab() {
  return <button className="fab" aria-label="Betalen" tabIndex={-1}><Icon name="transfer" size={24} /></button>
}
