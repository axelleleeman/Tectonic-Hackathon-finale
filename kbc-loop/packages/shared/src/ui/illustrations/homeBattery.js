// Wall-style home battery with charge indicator.
import { scene, materials, rect, join, shape, gloss, shade, accent } from './kit.js'

export const homeBattery = scene({
  type: 'home-battery',
  category: 'energy',
  shadow: [120, 40],
  gradients: [materials.white('body'), accent('energy', 'level', 'v'), materials.graphite('panel', 'v')],
  shapes: [
    shape(rect(90, 26, 64, 130, 14), '#C9D3DE'),
    shape(rect(86, 24, 64, 130, 14), 'url(#body)'),
    shape(rect(100, 40, 36, 74, 8), 'url(#panel)'),
    shape(join(rect(106, 90, 24, 16, 3), rect(106, 70, 24, 16, 3), rect(106, 50, 24, 16, 3)), 'url(#level)'),
    shape(rect(106, 50, 24, 16, 3), '#5E6979', { opacity: 0.85 }),
    shape('M121 120L111 134H119L116 146L127 130H119Z', '#EE8A1F'),
    gloss(rect(90, 30, 5, 116, 2.5), 0.7),
    shade(rect(142, 24, 8, 130, [0, 14, 14, 0]), 0.07),
  ],
})
