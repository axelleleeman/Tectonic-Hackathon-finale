// Modular shop shelving stocked with products.
import { scene, materials, rect, join, shape, gloss, shade } from './kit.js'

const items = [
  ['#FF9FC0', [[60, 46, 14, 22], [78, 50, 14, 18], [96, 44, 14, 24]]],
  ['#62B6F2', [[124, 48, 18, 20], [146, 48, 18, 20], [168, 52, 12, 16]]],
  ['#FFCB52', [[60, 86, 22, 18], [86, 84, 22, 20]]],
  ['#43D59E', [[118, 82, 10, 22], [132, 82, 10, 22], [146, 82, 10, 22], [160, 86, 18, 18]]],
  ['#A193FF', [[60, 118, 16, 22], [80, 122, 26, 18], [126, 116, 20, 24], [150, 122, 28, 18]]],
]

export const shelving = scene({
  type: 'shelving',
  category: 'business',
  shadow: [120, 80],
  gradients: [materials.steel('frame', 'h'), materials.white('shelf', 'v')],
  shapes: [
    shape(rect(52, 20, 136, 132, 4), '#E6ECF2'),
    shade(rect(52, 20, 136, 132, 4), 0.05),
    ...items.map(([color, boxes]) => shape(join(boxes.map(([x, y, w, h]) => rect(x, y, w, h, 3))), color)),
    gloss(join(items.flatMap(([, boxes]) => boxes.map(([x, y, , h]) => rect(x + 2, y + 2, 3, h - 4, 1.5)))), 0.45),
    shape(join(rect(48, 68, 144, 6, 2), rect(48, 104, 144, 6, 2), rect(48, 140, 144, 6, 2)), 'url(#shelf)'),
    shade(join(rect(48, 72, 144, 2), rect(48, 108, 144, 2), rect(48, 144, 144, 2)), 0.12),
    shape(join(rect(44, 16, 8, 140, 3), rect(188, 16, 8, 140, 3)), 'url(#frame)'),
  ],
})
