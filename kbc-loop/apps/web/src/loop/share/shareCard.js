// Shareable impact card: drawn with Canvas 2D (no libraries) and downloaded as a PNG.
// Navy card with the KBC LOOP wordmark, CO₂ saved, ≈ km by car, Kate Coins, products in use and the year.
import { num } from '@kbc-loop/shared/engine/format.js'
import { TODAY } from '@kbc-loop/shared/config/index.js'

const W = 1080
const H = 1350
const NAVY = '#0C2340'
const NAVY_2 = '#123660'
const INK = '#EEF3FA'
const MUTED = '#A3B5CF'
const ACCENT = '#4AABEE'
const ECO = '#4CCB93'
const FONT = "'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"

function loopMark(ctx, x, y, s, color) {
  // The loop (∞) mark: two circles joined by a figure-eight curve
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = s * 0.14
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.bezierCurveTo(x + s * 0.4, y - s * 0.5, x + s, y - s * 0.5, x + s, y)
  ctx.bezierCurveTo(x + s, y + s * 0.5, x + s * 0.4, y + s * 0.5, x, y)
  ctx.bezierCurveTo(x - s * 0.4, y - s * 0.5, x - s, y - s * 0.5, x - s, y)
  ctx.bezierCurveTo(x - s, y + s * 0.5, x - s * 0.4, y + s * 0.5, x, y)
  ctx.stroke()
  ctx.restore()
}

/** Super subtle half-transparent blue→green surface with a hairline, behind the sustainability (CO₂) figure. */
function ecoPanel(ctx, x, y, w, h, r = 28) {
  ctx.save()
  ctx.beginPath()
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r)
  else ctx.rect(x, y, w, h)
  const g = ctx.createLinearGradient(x, y, x + w, y + h)
  g.addColorStop(0, 'rgba(74, 171, 238, .12)')
  g.addColorStop(1, 'rgba(63, 201, 138, .17)')
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = 'rgba(92, 200, 138, .28)'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.restore()
}

function figure(ctx, { x, y, label, value, unit, color }) {
  ctx.fillStyle = MUTED
  ctx.font = `500 34px ${FONT}`
  ctx.fillText(label, x, y)
  ctx.fillStyle = color
  ctx.font = `600 104px ${FONT}`
  ctx.fillText(value, x, y + 112)
  if (unit) {
    const w = ctx.measureText(value).width
    ctx.font = `500 48px ${FONT}`
    ctx.fillText(unit, x + w + 14, y + 112)
  }
}

/** Draws the card on a new canvas and returns it. */
export function drawImpactCard({ name, totals, coins }) {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, NAVY_2)
  bg.addColorStop(1, NAVY)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Quiet decorative loop in the corner
  ctx.globalAlpha = 0.08
  loopMark(ctx, W - 180, 220, 260, INK)
  ctx.globalAlpha = 1

  const x = 96
  loopMark(ctx, x + 34, 140, 30, ACCENT)
  ctx.fillStyle = INK
  ctx.font = `700 44px ${FONT}`
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('KBC LOOP', x + 86, 156)

  ctx.fillStyle = INK
  ctx.font = `600 64px ${FONT}`
  ctx.fillText('My impact', x, 330)
  ctx.fillStyle = MUTED
  ctx.font = `400 34px ${FONT}`
  ctx.fillText(`${name ? `${name} · ` : ''}${TODAY.slice(0, 4)}`, x, 386)

  ecoPanel(ctx, x - 40, 474, W - 2 * x + 80, 286)
  figure(ctx, { x, y: 540, label: 'CO₂ saved', value: num(totals.co2Kg), unit: 'kg', color: ECO })
  ctx.fillStyle = MUTED
  ctx.font = `400 34px ${FONT}`
  ctx.fillText(`≈ ${num(totals.carKm)} km less driving by car`, x, 714)

  ctx.fillStyle = 'rgba(255, 255, 255, .12)'
  ctx.fillRect(x, 790, W - 2 * x, 2)

  figure(ctx, { x, y: 900, label: 'Kate Coins', value: num(coins), color: INK })
  figure(ctx, { x: W / 2 + 20, y: 900, label: 'Products in use', value: num(totals.active), color: INK })

  ctx.fillStyle = MUTED
  ctx.font = `400 30px ${FONT}`
  ctx.fillText('Borrow instead of buy. Repaired, returned, reused.', x, H - 110)
  return canvas
}

/** Renders the card and downloads it as kbc-loop-impact-<year>.png. */
export async function downloadImpactCard(data) {
  try { await document.fonts?.ready } catch { /* fonts unavailable: system font is fine */ }
  const canvas = drawImpactCard(data)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) return
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kbc-loop-impact-${TODAY.slice(0, 4)}.png`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
