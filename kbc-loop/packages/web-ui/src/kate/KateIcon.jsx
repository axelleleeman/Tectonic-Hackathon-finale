// Line icons used by Kate (same SVG paths as the mobile app's Kate).
const paths = {
  kate: ['M5 9h14', 'M7 12h10', 'M9 15h6', 'M12 5v2', 'M12 17v2'],
  mic: ['M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z', 'M5.5 11a6.5 6.5 0 0 0 13 0', 'M12 17.5V21'],
  arrowUp: ['M12 20V4', 'M6 10l6-6 6 6'],
  sparkle: ['M12 3c.6 4.6 2.6 6.6 8 9-5.4 2.4-7.4 4.4-8 9-.6-4.6-2.6-6.6-8-9 5.4-2.4 7.4-4.4 8-9z'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
}

export function KateIcon({ name, size = 22, filled = false, strokeWidth = 1.8, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths[name].map((d) => <path key={d} d={d} />)}
    </svg>
  )
}

/** Kate's avatar: the Kate mark in a light-blue circle, as in KBC Mobile. */
export function KateAvatar({ size = 34 }) {
  return (
    <span className="kate-avatar" style={{ width: size, height: size }} aria-hidden="true">
      <KateIcon name="kate" size={Math.round(size * 0.6)} />
    </span>
  )
}
