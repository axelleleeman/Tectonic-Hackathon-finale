// Upright single-door freezer or professional fridge in brushed steel.
import { scene, materials, rect, line, join, shape, gloss, shade, stroke } from './kit.js'

export const freezer = scene({
  type: 'freezer',
  category: 'appliances',
  shadow: [120, 44],
  gradients: [materials.steel('body'), materials.graphite('handle', 'h')],
  shapes: [
    shape(rect(86, 14, 68, 142, 9), 'url(#body)'),
    shade(rect(146, 14, 8, 142, [0, 9, 9, 0]), 0.08),
    shape(rect(86, 14, 68, 18, [9, 9, 0, 0]), '#2C3440'),
    shape(join(rect(94, 20, 30, 2, 1), rect(94, 25, 30, 2, 1)), '#4A5566'),
    shape(rect(130, 19, 18, 8, 2), '#0F151E'),
    shape(rect(133, 21.5, 9, 3, 1.5), '#62D0FF'),
    shape(rect(140, 50, 6, 64, 3), 'url(#handle)'),
    stroke(join(line([104, 70], [104, 92]), line([94.5, 75.5], [113.5, 86.5]), line([94.5, 86.5], [113.5, 75.5])), '#5FA8E8', 3, { opacity: 0.85 }),
    gloss(rect(90, 38, 5, 110, 2.5), 0.55),
    shape(rect(92, 152, 10, 6, 2), '#5D6878'),
    shape(rect(138, 152, 10, 6, 2), '#5D6878'),
  ],
})
