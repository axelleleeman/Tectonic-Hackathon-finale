// Input at the bottom: a large rounded field and a round KBC-blue button.
// Empty field: microphone (voice doesn't work in the demo yet); with text: a send arrow.
import { useState } from 'react'
import { KateIcon } from './KateIcon.jsx'

export function KateComposer({ onSend, onVoice, disabled, inputRef }) {
  const [text, setText] = useState('')
  const hasText = text.trim().length > 0

  const submit = (e) => {
    e.preventDefault()
    if (hasText && onSend(text)) setText('')
  }

  return (
    <form className="kate-composer" onSubmit={submit}>
      <input ref={inputRef} className="kate-input" type="text" value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Type your question" aria-label="Question for Kate" autoComplete="off" maxLength={300} />
      {hasText ? (
        <button type="submit" className="kate-send" disabled={disabled} aria-label="Send question">
          <KateIcon name="arrowUp" size={22} strokeWidth={2.2} />
        </button>
      ) : (
        <button type="button" className="kate-send" disabled={disabled} onClick={onVoice} aria-label="Ask by voice">
          <KateIcon name="mic" size={22} strokeWidth={2.2} />
        </button>
      )}
    </form>
  )
}
