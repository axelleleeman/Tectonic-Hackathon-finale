// Heat-pump tumble dryer.
import { scene, materials, linear, rect, circle, join, shape, gloss, shade, stroke } from './kit.js'

export const dryer = scene({
  type: 'dryer',
  category: 'appliances',
  shadow: [120, 50],
  gradients: [
    materials.white('body'),
    materials.graphite('ring'),
    linear('door', '#E7EEF6', '#9DB0C6'),
    linear('laundry', '#FFB3C9', '#E0709A'),
  ],
  shapes: [
    shape(rect(78, 32, 84, 124, 10), 'url(#body)'),
    shade(rect(154, 32, 8, 124, [0, 10, 10, 0]), 0.06),
    shape(rect(78, 32, 84, 24, [10, 10, 0, 0]), '#F4F7FA'),
    shape(rect(78, 55, 84, 1.5), '#C9D3DE'),
    shape(rect(84, 38, 26, 12, 3), '#DCE4EC'),
    shape(rect(84, 43, 26, 1.2), '#B7C3D0'),
    shape(rect(116, 39, 22, 10, 3), '#1D2633'),
    shape(join(circle(121, 44, 1.6), circle(126, 44, 1.6), circle(131, 44, 1.6)), '#FFB86B'),
    shape(circle(149, 44, 7), '#E3E9F0'),
    shape(circle(149, 44, 4.5), '#1D6CC0'),
    shape(circle(120, 104, 34), '#D5DDE6'),
    shape(circle(120, 104, 30), 'url(#ring)'),
    shape(circle(120, 104, 23), 'url(#door)'),
    shape('M100 112c4-10 14-12 20-6s16 4 20-4v4a20 20 0 0 1-40 10z', 'url(#laundry)', { opacity: 0.9 }),
    shape('M104 116c6-6 12-4 18 0s12 4 16-2a20 20 0 0 1-34 6z', '#7FB9EC', { opacity: 0.85 }),
    stroke('M101 94a22 22 0 0 1 14-12', '#FFFFFF', 3, { opacity: 0.7 }),
    shape(rect(147, 98, 5, 12, 2.5), '#B8C4D1'),
    gloss(rect(82, 60, 6, 90, 3), 0.5),
    shape(rect(84, 152, 12, 6, 2), '#7E8B9A'),
    shape(rect(144, 152, 12, 6, 2), '#7E8B9A'),
  ],
})
