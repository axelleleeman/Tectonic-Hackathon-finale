// Line icons (24×24, stroke = currentColor), same drawing style as the KBC LOOP web page.
const PATHS = {
  sun: ['M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z', 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'],
  moon: ['M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z'],
  shield: ['M12 2.5 4.5 5.5v6c0 4.6 3.2 8.4 7.5 10 4.3-1.6 7.5-5.4 7.5-10v-6z', 'm8.8 12 2.2 2.2 4.3-4.4'],
  check: ['m5 12.5 4.5 4.5L19 7.5'],
  arrow: ['M5 12h14M13 6l6 6-6 6'],
  back: ['M19 12H5M11 6l-6 6 6 6'],
  plus: ['M12 5v14M5 12h14'],
  chev: ['m9 6 6 6-6 6'],
  leaf: ['M5 19c0-8 5-13 15-14-1 10-6 15-14 15M5 19l7-7'],
  stop: ['M7 7h10v10H7z'],
  pencil: ['M4 20h4L19 9l-4-4L4 16v4z', 'M13.5 6.5l4 4'],
}

export function Icon({ name, size = 18, className = '' }) {
  return (
    <svg className={`ins-i ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {(PATHS[name] ?? []).map((d) => <path key={d} d={d} />)}
    </svg>
  )
}
