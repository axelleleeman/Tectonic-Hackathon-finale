// Suggestions below Kate's greeting: wrapping outlined pills in KBC blue.
// Non-interactive suggestions (e.g. "Call KBC Live") are shown light grey without an action.
export function KateChips({ chips, onChoose, busy }) {
  return (
    <ul className="kate-chips" aria-label="Suggestions">
      {chips.map((chip) => (
        <li key={chip.id}>
          {chip.disabled ? (
            <span className="kate-chip kate-chip-off" aria-disabled="true">{chip.label}</span>
          ) : (
            <button type="button" className="kate-chip" disabled={busy} onClick={() => onChoose(chip)}>{chip.label}</button>
          )}
        </li>
      ))}
    </ul>
  )
}
