// Single-person acoustic phone booth with glass door.
import { scene, materials, linear, rect, poly, join, shape, gloss, shade, accents } from './kit.js'

export const phoneBooth = scene({
  type: 'phone-booth',
  category: 'business',
  shadow: [120, 50],
  gradients: [materials.white('shell'), linear('glass', '#D9EEFF', '#8DB7DD'), materials.wood('wood', 'v'), linear('felt', accents.business[0], accents.business[1])],
  shapes: [
    shape(rect(78, 12, 84, 144, 10), 'url(#shell)'),
    shade(rect(154, 12, 8, 144, [0, 10, 10, 0]), 0.08),
    shape(rect(84, 18, 72, 8, 3), '#FFF3C4'),
    shape(rect(86, 30, 68, 120, 4), 'url(#felt)'),
    shape(rect(94, 90, 52, 6, 2), 'url(#wood)'),
    shape(rect(108, 112, 22, 6, 3), 'url(#wood)'),
    shape(rect(117, 118, 4, 30), '#3A4352'),
    shape(rect(86, 30, 68, 120, 4), 'url(#glass)', { opacity: 0.45 }),
    gloss(poly([88, 32], [108, 32], [88, 72]), 0.4),
    gloss(poly([120, 32], [128, 32], [88, 120], [88, 104]), 0.18),
    shape(rect(145, 82, 4, 22, 2), '#5E6979'),
    shape(rect(78, 150, 84, 6, [0, 0, 6, 6]), '#5E6979'),
  ],
})
