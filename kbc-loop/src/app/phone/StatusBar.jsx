import { Icon } from '../../components/ui/Icon.jsx'

export function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <span className="sb-icons"><Icon name="signal" size={14} /><Icon name="wifi" size={14} /><Icon name="battery" size={16} /></span>
    </div>
  )
}
