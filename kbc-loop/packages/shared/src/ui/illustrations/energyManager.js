// Smart energy manager: a small wall display showing consumption bars.
import { scene, materials, rect, circle, line, join, shape, gloss, shade, stroke, accent } from './kit.js'

export const energyManager = scene({
  type: 'energy-manager',
  category: 'energy',
  shadow: [120, 46],
  gradients: [materials.white('body'), materials.glass('screen'), accent('energy', 'bars', 'v')],
  shapes: [
    shape(rect(78, 36, 88, 116, 14), '#C9D3DE'),
    shape(rect(74, 34, 88, 116, 14), 'url(#body)'),
    shape(rect(84, 46, 68, 56, 7), 'url(#screen)'),
    shape(join(rect(92, 80, 7, 14, 2), rect(102, 72, 7, 22, 2), rect(112, 84, 7, 10, 2), rect(122, 66, 7, 28, 2), rect(132, 76, 7, 18, 2)), 'url(#bars)'),
    stroke(line([92, 66], [104, 60], [116, 64], [128, 54], [144, 58]), '#62D0FF', 2),
    shape(circle(144, 58, 2.6), '#62D0FF'),
    shape(join(circle(104, 122, 8), circle(132, 122, 8)), '#E3E9F0'),
    shape(circle(104, 122, 4), '#EE8A1F'),
    shape(circle(132, 122, 4), '#5E6979'),
    gloss(rect(78, 40, 4, 104, 2), 0.7),
  ],
})
