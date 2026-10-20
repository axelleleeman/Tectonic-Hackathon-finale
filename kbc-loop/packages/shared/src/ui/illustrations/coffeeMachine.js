// Bean-to-cup espresso machine with a cup under the spout.
import { scene, materials, rect, circle, join, shape, gloss, shade, stroke, accent } from './kit.js'

export const coffeeMachine = scene({
  type: 'coffee-machine',
  category: 'appliances',
  shadow: [120, 44],
  gradients: [materials.graphite('body'), materials.steel('steel', 'v'), materials.glass('screen'), materials.white('cup'), accent('appliances')],
  shapes: [
    shape(rect(92, 24, 36, 14, 5), '#1F252E'),
    shape(rect(96, 21, 28, 6, 3), '#3A4352'),
    shape(rect(84, 34, 72, 122, 14), 'url(#body)'),
    gloss(rect(88, 40, 5, 106, 2.5), 0.15),
    shape(rect(96, 44, 48, 22, 5), 'url(#screen)'),
    shape(rect(101, 49, 20, 4, 2), 'url(#accent)'),
    shape(join(circle(104, 59, 2.5), circle(112, 59, 2.5), circle(120, 59, 2.5)), '#FFFFFF', { opacity: 0.55 }),
    shape(circle(135, 56, 5), 'url(#accent)'),
    shape(rect(96, 74, 48, 64, 8), '#161B22'),
    shape(rect(110, 74, 20, 12, [0, 0, 5, 5]), 'url(#steel)'),
    shape(join(rect(114, 86, 3, 4, 1.5), rect(123, 86, 3, 4, 1.5)), '#9AA6B4'),
    shape('M106 106H134V122a8 8 0 0 1-8 8H114a8 8 0 0 1-8-8Z', 'url(#cup)'),
    stroke('M134 110a6 6 0 0 1 0 12', '#E3E9F0', 3),
    shape(rect(106, 106, 28, 3, 1.5), '#6B4A2E'),
    shape(rect(96, 132, 48, 8, 4), 'url(#steel)'),
    stroke('M114 98c-3-3 3-5 0-8M122 98c-3-3 3-5 0-8', '#FFFFFF', 1.8, { opacity: 0.45 }),
  ],
})
