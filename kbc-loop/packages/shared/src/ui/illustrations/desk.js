// Electric sit-stand desk with a monitor and a plant.
import { scene, materials, linear, rect, circle, ellipse, join, shape, gloss, shade, accents } from './kit.js'

export const desk = scene({
  type: 'desk',
  category: 'business',
  shadow: [120, 84],
  gradients: [materials.wood('top', 'v'), materials.graphite('leg', 'h'), linear('screen', accents.business[0], accents.business[1]), linear('leaf', '#7EDDA6', '#2E9E6A')],
  shapes: [
    shape(join(rect(62, 84, 12, 66, 2), rect(166, 84, 12, 66, 2)), 'url(#leg)'),
    shape(join(rect(64, 104, 8, 46), rect(168, 104, 8, 46)), '#5E6979', { opacity: 0.5 }),
    shape(join(rect(46, 148, 44, 6, 3), rect(150, 148, 44, 6, 3)), '#2C3440'),
    shape(rect(114, 64, 12, 12, 2), '#5E6979'),
    shape(rect(84, 26, 72, 42, 4), '#232933'),
    shape(rect(87, 29, 66, 36, 2), 'url(#screen)'),
    shape(join(rect(94, 36, 28, 4, 2), rect(94, 44, 18, 3, 1.5)), '#FFFFFF', { opacity: 0.85 }),
    shape(ellipse(120, 76, 14, 2.4), '#3A4352'),
    shape(join(ellipse(168, 54, 7, 14), ellipse(180, 58, 6, 12), ellipse(158, 60, 6, 11)), 'url(#leaf)'),
    shape(rect(160, 62, 18, 16, [3, 3, 5, 5]), '#F4F7FA'),
    shape(rect(36, 76, 168, 10, 4), 'url(#top)'),
    shade(rect(36, 82, 168, 4, [0, 0, 4, 4]), 0.15),
    shape(rect(184, 86, 12, 5, [0, 0, 2, 2]), '#2C3440'),
    shape(circle(190, 88, 1.2), '#62D0FF'),
  ],
})
