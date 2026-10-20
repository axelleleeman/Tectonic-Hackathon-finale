// Product bundle: a gift-wrapped box with a tag.
import { scene, linear, rect, circle, poly, join, shape, gloss, shade, stroke, accents } from './kit.js'

export const bundle = scene({
  type: 'bundle',
  category: 'generic',
  shadow: [120, 62],
  gradients: [linear('box', '#FFFFFF', '#D2DCE7'), linear('ribbon', accents.generic[0], accents.generic[1])],
  shapes: [
    shape(rect(70, 76, 100, 80, 8), 'url(#box)'),
    shade(rect(70, 76, 100, 14), 0.1),
    shape(rect(64, 62, 112, 22, 7), 'url(#box)'),
    shape(join(rect(112, 62, 16, 94)), 'url(#ribbon)'),
    shape('M120 62C104 38 84 42 90 54C94 62 110 62 120 62ZM120 62C136 38 156 42 150 54C146 62 130 62 120 62Z', 'url(#ribbon)'),
    shape(circle(120, 61, 6), accents.generic[1]),
    gloss(rect(74, 66, 32, 4, 2), 0.7),
    stroke('M160 92L178 108', '#8C97A6', 1.4),
    shape(poly([172, 104], [194, 112], [190, 124], [168, 116]), '#FFE27A'),
    shape(circle(174, 109, 2), '#FFFFFF'),
  ],
})
