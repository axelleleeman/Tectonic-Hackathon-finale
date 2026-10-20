// Professional three-deck bakery oven.
import { scene, materials, linear, rect, join, shape, gloss, shade } from './kit.js'

const deck = (y) => [
  shape(rect(64, y, 112, 30, 4), '#2A313C'),
  shape(rect(74, y + 8, 76, 18, 3), 'url(#fire)'),
  gloss(rect(76, y + 10, 30, 3, 1.5), 0.35),
  shape(rect(74, y + 2, 76, 4, 2), 'url(#handle)'),
  shape(rect(156, y + 7, 12, 16, 3), '#3E4756'),
  shape(rect(160, y + 11, 4, 4, 2), '#FF8A3D'),
]

export const oven = scene({
  type: 'oven',
  category: 'business',
  shadow: [120, 66],
  gradients: [materials.steel('body'), materials.steel('handle', 'v'), linear('fire', '#FFD08A', '#E2622A', 'v')],
  shapes: [
    shape(rect(56, 26, 128, 116, 8), 'url(#body)'),
    shade(rect(176, 26, 8, 116, [0, 8, 8, 0]), 0.08),
    shape(rect(56, 26, 128, 8, [8, 8, 0, 0]), '#E6EBF1'),
    ...deck(36),
    ...deck(70),
    ...deck(104),
    shape(join(rect(62, 140, 8, 16, 2), rect(170, 140, 8, 16, 2)), '#5D6878'),
  ],
})
