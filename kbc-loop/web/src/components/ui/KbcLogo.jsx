import logo from '../../assets/brand/kbc-logo.png'

export function KbcLogo({ height = 24, className = '' }) {
  return <img className={`kbc-logo ${className}`} src={logo} alt="KBC" height={height} />
}
