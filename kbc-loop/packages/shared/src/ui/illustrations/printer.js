// Office multifunction printer with scanner lid and paper trays.
import { scene, materials, rect, poly, join, shape, gloss, shade, accent } from './kit.js'

export const printer = scene({
  type: 'printer',
  category: 'electronics',
  shadow: [120, 66],
  gradients: [materials.white('body'), materials.white('lid', 'v'), materials.glass('screen'), accent('electronics')],
  shapes: [
    shape(rect(58, 62, 124, 94, 8), 'url(#body)'),
    shade(rect(174, 62, 8, 94, [0, 8, 8, 0]), 0.07),
    shape(rect(54, 46, 132, 20, 6), 'url(#lid)'),
    shade(rect(54, 62, 132, 4, 2), 0.1),
    shape(rect(72, 74, 76, 10, 3), '#2C3440'),
    shape(poly([80, 76], [140, 76], [144, 94], [76, 94]), '#FFFFFF'),
    shade(poly([80, 76], [140, 76], [141, 80], [79, 80]), 0.12),
    shape(join(rect(84, 84, 40, 2, 1), rect(84, 88, 30, 2, 1)), '#A193FF', { opacity: 0.8 }),
    shape(poly([152, 70], [176, 70], [178, 88], [150, 88]), 'url(#screen)'),
    shape(rect(156, 76, 14, 4, 2), 'url(#accent)'),
    shape(join(rect(66, 104, 108, 1.6), rect(66, 128, 108, 1.6)), '#C9D3DE'),
    shape(join(rect(108, 112, 24, 5, 2.5), rect(108, 136, 24, 5, 2.5)), '#B6C1CD'),
    gloss(rect(62, 70, 4, 80, 2), 0.6),
  ],
})
