import { useEffect, useState } from 'react'

/**
 * Toont een foto als die bestaat; anders een illustratie in de categoriekleuren.
 * De foto wordt eerst op de achtergrond geladen, zodat je nooit een "kapotte afbeelding" ziet.
 */
export function Photo({ src, tint, icon, children, className = '' }) {
  const [loadedSrc, setLoadedSrc] = useState(null)

  useEffect(() => {
    let alive = true
    const img = new Image()
    img.onload = () => alive && setLoadedSrc(src)
    img.src = src
    return () => { alive = false }
  }, [src])

  return (
    <div className={`photo ${className}`} style={{ '--t1': tint[0], '--t2': tint[1] }}>
      <span className="photo-fallback" aria-hidden="true">{icon}</span>
      {loadedSrc === src && <img src={src} alt="" />}
      {children && <div className="photo-overlay">{children}</div>}
    </div>
  )
}
