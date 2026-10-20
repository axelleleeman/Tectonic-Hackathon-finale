import { useId } from 'react'
import { LoopIcon } from '../LoopIcon.jsx'

/**
 * Optional photo of the problem. The image stays in this browser (local preview only); it is never uploaded.
 * Only the fact that a photo was added is sent along with the report.
 */
export function PhotoPicker({ file, previewUrl, onChange }) {
  const id = useId()
  return (
    <div className="pp-photo">
      {previewUrl ? (
        <figure className="pp-photo-preview">
          <img src={previewUrl} alt="Your photo of the problem" />
          <figcaption>
            <span className="lp-min0"><b>{file.name}</b><small>{Math.max(1, Math.round(file.size / 1024))} KB · stays on this device</small></span>
            <button type="button" className="lp-btn lp-sm" onClick={() => onChange(null)}>Remove</button>
          </figcaption>
        </figure>
      ) : (
        <label className="pp-drop" htmlFor={id}>
          <span className="pp-drop-ic"><LoopIcon name="plus" size={22} /></span>
          <b>Add a photo</b>
          <small>JPG, PNG or HEIC from your camera or files</small>
        </label>
      )}
      <input id={id} className="pp-file" type="file" accept="image/*" data-autofocus
        aria-label={previewUrl ? 'Replace photo' : 'Add a photo'}
        onChange={(e) => { const f = e.target.files?.[0]; if (f && f.type.startsWith('image/')) onChange(f); e.target.value = '' }} />
      {previewUrl && <label className="lp-btn lp-sm pp-replace" htmlFor={id}>Replace photo</label>}
    </div>
  )
}
