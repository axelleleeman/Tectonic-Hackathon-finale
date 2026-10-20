// Wooden high chair with tray.
import { scene, materials, linear, rect, line, join, shape, gloss, stroke, accents } from './kit.js'

export const highChair = scene({
  type: 'high-chair',
  category: 'family',
  shadow: [120, 50],
  gradients: [materials.wood('wood'), linear('cushion', accents.family[0], accents.family[1])],
  shapes: [
    stroke(join(line([96, 96], [78, 156]), line([144, 96], [162, 156])), '#C8935C', 6),
    stroke(join(line([104, 96], [96, 156]), line([136, 96], [144, 156])), '#D9AE7C', 5),
    stroke(line([84, 132], [156, 132]), '#C8935C', 4),
    shape(rect(98, 30, 44, 60, 12), 'url(#wood)'),
    shape(rect(104, 36, 32, 50, 9), 'url(#cushion)'),
    shape(rect(92, 84, 56, 14, 5), 'url(#wood)'),
    shape(rect(130, 70, 40, 9, 4.5), '#FFFFFF'),
    shape(rect(130, 76, 40, 4, 2), '#E3E9F0'),
    gloss(rect(102, 34, 4, 50, 2), 0.4),
  ],
})
