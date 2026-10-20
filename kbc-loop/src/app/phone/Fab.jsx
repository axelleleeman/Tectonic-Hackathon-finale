import { Icon } from '../../components/ui/Icon.jsx'

/** Ronde betaalknop rechtsonder, zoals in KBC Mobile (in de demo niet actief). */
export function Fab() {
  return <span className="fab" aria-hidden="true"><Icon name="transfer" size={26} /></span>
}
