// Child car seat seen from the front, with harness and base.
import { scene, materials, linear, rect, circle, line, join, shape, gloss, shade, stroke, accents } from './kit.js'

const [light, deep] = accents.family

export const carSeat = scene({
  type: 'car-seat',
  category: 'family',
  shadow: [120, 50],
  gradients: [materials.graphite('shell'), linear('fabric', light, deep), materials.graphite('base', 'v')],
  shapes: [
    shape(rect(76, 130, 88, 22, 7), 'url(#base)'),
    shape(rect(82, 22, 76, 60, 24), 'url(#shell)'),
    shape(rect(74, 66, 92, 74, 22), 'url(#shell)'),
    shape(rect(92, 30, 56, 44, 18), 'url(#fabric)'),
    shape(rect(88, 74, 64, 58, 16), 'url(#fabric)'),
    shade(rect(96, 106, 48, 24, 10), 0.12),
    stroke(join(line([106, 76], [116, 112]), line([134, 76], [124, 112]), line([120, 112], [120, 130])), '#2C3440', 4.5),
    shape(rect(112, 106, 16, 10, 3), '#C9D3DE'),
    shape(rect(116, 109, 8, 4, 2), '#DE4C7D'),
    gloss(rect(98, 36, 6, 30, 3), 0.25),
    shape(circle(120, 141, 3), '#43D59E'),
  ],
})
