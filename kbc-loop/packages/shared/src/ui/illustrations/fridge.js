// Two-door fridge-freezer.
import { scene, materials, rect, join, shape, gloss, shade } from './kit.js'

export const fridge = scene({
  type: 'fridge',
  category: 'appliances',
  shadow: [120, 44],
  gradients: [materials.white('body'), materials.steel('handle', 'h')],
  shapes: [
    shape(rect(84, 14, 72, 142, 11), 'url(#body)'),
    shade(rect(148, 14, 8, 142, [0, 11, 11, 0]), 0.07),
    shade(rect(84, 98, 72, 2), 0.18),
    shape(rect(140, 30, 6, 40, 3), 'url(#handle)'),
    shape(rect(140, 108, 6, 30, 3), 'url(#handle)'),
    shape(rect(96, 28, 24, 12, 3), '#1D2633'),
    shape(join(rect(100, 32, 7, 4, 1.5), rect(110, 32, 6, 4, 1.5)), '#62D0FF'),
    gloss(rect(89, 20, 5, 72, 2.5), 0.6),
    gloss(rect(89, 104, 5, 44, 2.5), 0.6),
    shape(rect(90, 152, 10, 6, 2), '#7E8B9A'),
    shape(rect(140, 152, 10, 6, 2), '#7E8B9A'),
  ],
})
