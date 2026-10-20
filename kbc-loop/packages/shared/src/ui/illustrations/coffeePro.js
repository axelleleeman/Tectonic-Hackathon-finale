// Traditional two-group espresso machine for cafés and offices.
import { scene, materials, rect, circle, poly, join, shape, gloss, shade, accent } from './kit.js'

export const coffeePro = scene({
  type: 'coffee-pro',
  category: 'appliances',
  shadow: [120, 74],
  gradients: [materials.steel('body'), materials.graphite('dark'), materials.white('cup'), accent('appliances', 'accent', 'h')],
  shapes: [
    shape(join(rect(70, 46, 16, 12, 3), rect(92, 46, 16, 12, 3), rect(132, 46, 16, 12, 3), rect(154, 46, 16, 12, 3)), 'url(#cup)'),
    shape(rect(56, 56, 128, 8, 3), '#C4CDD8'),
    shape(rect(52, 62, 136, 78, 10), 'url(#body)'),
    shape(rect(52, 72, 136, 7), 'url(#accent)'),
    shade(rect(52, 124, 136, 16, [0, 0, 10, 10]), 0.1),
    shape(join(circle(108, 92, 7), circle(132, 92, 7)), '#FFFFFF'),
    shape(join(circle(108, 92, 5.5), circle(132, 92, 5.5)), '#1F252E'),
    shape(join(rect(107.4, 87.5, 1.2, 5, 0.6), rect(131.4, 87.5, 1.2, 5, 0.6)), '#FF6B6B'),
    shape(join(rect(70, 90, 22, 14, 4), rect(148, 90, 22, 14, 4)), 'url(#dark)'),
    shape(join(rect(74, 104, 14, 6, 2), rect(152, 104, 14, 6, 2)), '#AAB6C4'),
    shape(join(poly([66, 104], [46, 112], [48, 116], [70, 110]), poly([174, 104], [194, 112], [192, 116], [170, 110])), '#1F252E'),
    shape(rect(60, 128, 120, 10, 4), 'url(#dark)'),
    shape(join(rect(72, 118, 16, 10, 3), rect(152, 118, 16, 10, 3)), 'url(#cup)'),
    gloss(rect(56, 66, 128, 3, 1.5), 0.7),
    shape(join(rect(60, 138, 10, 18, 3), rect(170, 138, 10, 18, 3)), '#5D6878'),
  ],
})
