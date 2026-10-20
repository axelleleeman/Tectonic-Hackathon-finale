// Nagebootste chatknop rechtsonder in de hero (niet klikbaar).
export function KbcLive() {
  return (
    <div className="kbc-live" aria-hidden="true">
      <div className="kbc-live-pill">
        <span>Heb je een vraag: KBC Live geeft je snel een antwoord.</span>
        <span className="kbc-live-dot"><i /><b>KBC Live</b><small>klik voor hulp</small></span>
      </div>
      <p>Elke werkdag van 8 tot 22 uur en zaterdag van 9 tot 17 uur.</p>
    </div>
  )
}
