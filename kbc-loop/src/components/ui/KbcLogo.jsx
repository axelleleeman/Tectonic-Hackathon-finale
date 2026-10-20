const src = `${import.meta.env.BASE_URL}img/kbc-logo.png`

export function KbcLogo({ height = 24, className = '' }) {
  return <img className={`kbc-logo ${className}`} src={src} alt="KBC" height={height} />
}
