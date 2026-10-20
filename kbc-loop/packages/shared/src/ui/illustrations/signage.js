// Portrait digital-signage screen on a floor stand.
import { scene, materials, linear, rect, circle, ellipse, poly, join, shape, gloss } from './kit.js'

export const signage = scene({
  type: 'signage',
  category: 'electronics',
  shadow: [120, 34],
  gradients: [materials.graphite('frame'), linear('screen', '#C9BEFF', '#5A3ED6', 'v'), materials.steel('pole', 'h')],
  shapes: [
    shape(rect(116, 118, 8, 32, 2), 'url(#pole)'),
    shape(ellipse(120, 151, 26, 4.6), '#5E6979'),
    shape(rect(88, 14, 64, 108, 7), 'url(#frame)'),
    shape(rect(92, 18, 56, 100, 4), 'url(#screen)'),
    shape(circle(120, 54, 20), '#FFD0A8', { opacity: 0.95 }),
    shape(circle(120, 54, 12), '#FF8FB8'),
    shape(join(rect(100, 84, 40, 6, 3), rect(106, 94, 28, 4, 2)), '#FFFFFF', { opacity: 0.95 }),
    shape(rect(108, 104, 24, 8, 4), '#FFCB52'),
    gloss(poly([92, 18], [124, 18], [92, 64]), 0.12),
  ],
})
