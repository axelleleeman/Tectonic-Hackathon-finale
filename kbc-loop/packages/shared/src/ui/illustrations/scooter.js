// Electric kick scooter.
import { scene, materials, line, rect, join, shape, gloss, stroke, wheel, accents } from './kit.js'

const [light, deep] = accents.mobility

export const scooter = scene({
  type: 'scooter',
  category: 'mobility',
  shadow: [120, 74],
  gradients: [materials.graphite('deck', 'v')],
  shapes: [
    ...wheel(62, 138, 16),
    ...wheel(176, 138, 16),
    stroke(line([62, 138], [80, 128]), '#3A4352', 4),
    shape(rect(70, 122, 96, 12, 6), 'url(#deck)'),
    gloss(rect(76, 124, 80, 2, 1), 0.2),
    stroke(line([162, 128], [176, 138]), '#3A4352', 4),
    stroke(line([164, 128], [150, 34]), light, 6),
    stroke(line([150, 40], [154, 64]), deep, 2, { opacity: 0.6 }),
    stroke(line([134, 32], [166, 30]), '#232933', 5),
    shape(rect(156, 72, 6, 4, 2), '#FFE27A'),
  ],
})
