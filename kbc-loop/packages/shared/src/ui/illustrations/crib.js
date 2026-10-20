// Solid-wood convertible cot with mattress and pillow.
import { scene, materials, linear, rect, join, shape, gloss, shade, accents } from './kit.js'

const slats = []
for (let i = 0; i < 11; i += 1) slats.push(rect(60 + i * 11.6, 66, 5, 58, 2.5))

export const crib = scene({
  type: 'crib',
  category: 'family',
  shadow: [120, 84],
  gradients: [materials.wood('wood'), materials.wood('post', 'h'), linear('pillow', accents.family[0], accents.family[1])],
  shapes: [
    shape(rect(54, 104, 132, 22, 4), '#FFFFFF'),
    shape(rect(62, 96, 30, 12, 6), 'url(#pillow)'),
    shade(rect(54, 118, 132, 8), 0.06),
    shape(join(slats), 'url(#wood)'),
    shape(rect(46, 60, 148, 9, 4.5), 'url(#wood)'),
    shape(rect(46, 122, 148, 10, 4), 'url(#wood)'),
    shape(join(rect(40, 48, 14, 108, 5), rect(186, 48, 14, 108, 5)), 'url(#post)'),
    gloss(join(rect(43, 54, 3, 96, 1.5), rect(189, 54, 3, 96, 1.5)), 0.5),
    gloss(rect(52, 61.5, 136, 2, 1), 0.5),
  ],
})
