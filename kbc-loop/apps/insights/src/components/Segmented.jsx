/** Segmented control (a labelled radio group styled as pills). options: [[value, label]] */
export function Segmented({ label, name, value, options, onChange }) {
  return (
    <fieldset className="ins-seg">
      <legend className="ins-sr">{label}</legend>
      {options.map(([v, l]) => (
        <label key={v} className={value === v ? 'on' : ''}>
          <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} />
          <span>{l}</span>
        </label>
      ))}
    </fieldset>
  )
}
