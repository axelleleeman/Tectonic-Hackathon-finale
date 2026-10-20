// Messages in the Kate conversation, as in KBC Mobile:
// Kate: the avatar with plain text below it (no bubble); the user: a light-blue bubble on the right.
import { KateAvatar, KateIcon } from './KateIcon.jsx'

/** "Today" + "Ask Kate, your AI assistant ✦" at the top of the conversation. */
export function KateIntro() {
  return (
    <div className="kate-intro">
      <span className="kate-today">Today</span>
      <span className="kate-intro-line">Ask Kate, your AI assistant <KateIcon name="sparkle" size={14} filled strokeWidth={0.8} /></span>
    </div>
  )
}

export function KateMessage({ children }) {
  return (
    <div className="kate-msg kate-msg-kate">
      <KateAvatar />
      <p className="kate-msg-text"><span className="kate-sr">Kate: </span>{children}</p>
    </div>
  )
}

export function UserMessage({ children }) {
  return (
    <div className="kate-msg kate-msg-user">
      <p className="kate-msg-text"><span className="kate-sr">You: </span>{children}</p>
    </div>
  )
}

export function Message({ from, text }) {
  return from === 'user' ? <UserMessage>{text}</UserMessage> : <KateMessage>{text}</KateMessage>
}
