// Over-ear headphones.
import { scene, materials, rect, join, shape, gloss, stroke, accent } from './kit.js'

export const headphones = scene({
  type: 'headphones',
  category: 'electronics',
  shadow: [120, 50],
  gradients: [materials.graphite('cup'), accent('electronics', 'pad')],
  shapes: [
    stroke('M76 112C76 52 164 52 164 112', '#2C3440', 11),
    stroke('M80 108C80 58 160 58 160 108', '#5E6979', 3, { opacity: 0.6 }),
    stroke('M96 62C108 54 132 54 144 62', '#A193FF', 6),
    shape(join(rect(66, 98, 14, 30, 5), rect(160, 98, 14, 30, 5)), '#3A4352'),
    shape(join(rect(70, 92, 34, 58, 15), rect(136, 92, 34, 58, 15)), 'url(#cup)'),
    shape(join(rect(96, 98, 12, 46, 6), rect(132, 98, 12, 46, 6)), 'url(#pad)'),
    gloss(join(rect(76, 100, 5, 40, 2.5), rect(142, 100, 5, 40, 2.5)), 0.18),
  ],
})
