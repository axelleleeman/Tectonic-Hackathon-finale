// EV charging pedestal with a coiled cable and plug.
import { scene, materials, rect, circle, join, shape, gloss, shade, stroke, accent } from './kit.js'

export const evCharger = scene({
  type: 'ev-charger',
  category: 'energy',
  shadow: [118, 46],
  gradients: [materials.white('box'), materials.graphite('post', 'h'), accent('energy', 'ring')],
  shapes: [
    shape(rect(108, 100, 20, 56, 4), 'url(#post)'),
    shape(rect(102, 150, 32, 6, 3), '#2C3440'),
    stroke('M104 96C76 104 70 132 92 138S132 128 138 112', '#2C3440', 6),
    shape(rect(88, 28, 60, 76, 16), 'url(#box)'),
    shade(rect(140, 28, 8, 76, [0, 16, 16, 0]), 0.07),
    shape(circle(118, 58, 18), 'url(#ring)'),
    shape(circle(118, 58, 13), '#FFFFFF'),
    shape('M120 48L112 60H118L115 70L124 56H118Z', '#EE8A1F'),
    shape(rect(108, 84, 20, 4, 2), '#C9D3DE'),
    gloss(rect(92, 34, 5, 62, 2.5), 0.7),
    shape(rect(134, 100, 14, 22, 5), '#3A4352'),
    shape(rect(137, 120, 8, 6, 2), '#232933'),
  ],
})
