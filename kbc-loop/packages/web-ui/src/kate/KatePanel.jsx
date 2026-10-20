// Kate on the web: a white chat panel. Desktop: a ~400px drawer sliding in from the right over a dim backdrop;
// narrow screens: full screen. Rendered in a portal on <body> so sticky/blurred headers can't clip it.
// Open/closed is LOCAL to the page (no OPEN_KATE/CLOSE_KATE), so the customer's phone isn't affected.
// Kate never changes the shared state herself: she navigates via the callbacks and the page asks to confirm.
import { useCallback, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { greeting } from '@kbc-loop/shared/kate/conversation.js'
import { useLoop } from '../useLoop.js'
import { KateIcon } from './KateIcon.jsx'
import { KateIntro, KateMessage, Message } from './KateMessages.jsx'
import { KateChips } from './KateChips.jsx'
import { KateComposer } from './KateComposer.jsx'
import { useKateConversation } from './useKateConversation.js'
import { useDialogFocus } from './useDialogFocus.js'
import './kate.css'

function KateDialog({ customer, items, signals, onClose, onRepair, onProduct, onOverview }) {
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const pending = useRef(null)
  const titleId = useId()

  // Navigation closes Kate first; the target runs once focus is back on the launcher,
  // so a dialog the page opens next remembers the launcher as the element to return to.
  const onNavigate = useCallback((screen, params) => {
    const targets = {
      repair: () => onRepair?.(params.itemKey),
      product: () => onProduct?.(params.productId, params.signalId),
      overview: () => onOverview?.(),
    }
    pending.current = targets[screen] ?? null
    onClose()
  }, [onClose, onRepair, onProduct, onOverview])

  const onClosed = useCallback(() => {
    const run = pending.current
    pending.current = null
    if (run) setTimeout(run, 0)
  }, [])

  useDialogFocus({ dialogRef, initialFocusRef: inputRef, onClose, onClosed })
  const chat = useKateConversation({ items, signals, onNavigate })

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [chat.messages.length])

  return createPortal(
    <div className="kate-layer">
      <div className="kate-backdrop" onClick={onClose} aria-hidden="true" />
      <section ref={dialogRef} className="kate-panel" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="kate-head">
          <h2 id={titleId} className="kate-title">Kate</h2>
          <button type="button" className="kate-close" onClick={onClose} aria-label="Close Kate">
            <KateIcon name="close" size={20} strokeWidth={2} />
          </button>
        </header>
        <div ref={listRef} className="kate-scroll">
          <div className="kate-thread" role="log" aria-live="polite" aria-relevant="additions">
            <KateIntro />
            <KateMessage>{greeting(customer)}</KateMessage>
            {chat.messages.map((m) => <Message key={m.id} from={m.from} text={m.text} />)}
            <KateChips chips={chat.chips} onChoose={chat.choose} busy={chat.busy} />
          </div>
        </div>
        <div className="kate-foot">
          <KateComposer inputRef={inputRef} onSend={chat.ask} onVoice={chat.voice} disabled={chat.busy} />
        </div>
      </section>
    </div>,
    document.body,
  )
}

function KateDialogWithLoop(props) {
  const { customer, items, signals } = useLoop()
  return <KateDialog customer={customer} items={items} signals={signals} {...props} />
}

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {{ customer, items, signals }} [props.loop] result of useLoop() when the page already has it
 * @param {(itemKey: string) => void} [props.onRepair] open the fault-report flow for this item
 * @param {(productId: string, signalId?: string) => void} [props.onProduct] open this product in the marketplace
 * @param {() => void} [props.onOverview] show what the customer borrows (e.g. "Your Home")
 */
export function KatePanel({ open, loop, ...props }) {
  if (!open) return null
  if (!loop) return <KateDialogWithLoop {...props} />
  return <KateDialog customer={loop.customer} items={loop.items} signals={loop.signals} {...props} />
}
