// Front-loading washing machine.
import { scene, materials, linear, rect, circle, ellipse, join, shape, gloss, shade, stroke } from './kit.js'

export const washer = scene({
  type: 'washer',
  category: 'appliances',
  shadow: [120, 50],
  gradients: [
    materials.white('body'),
    materials.steel('ring'),
    linear('door', '#BFE2FA', '#3D78B4'),
    linear('water', '#7CC4F4', '#2F7FCB', 'v'),
  ],
  shapes: [
    shape(rect(78, 32, 84, 124, 10), 'url(#body)'),
    shade(rect(154, 32, 8, 124, [0, 10, 10, 0]), 0.06),
    shape(rect(78, 32, 84, 24, [10, 10, 0, 0]), '#F4F7FA'),
    shape(rect(78, 55, 84, 1.5), '#C9D3DE'),
    shape(rect(86, 39, 20, 10, 3), '#E3E9F0'),
    shape(rect(112, 39, 26, 10, 3), '#1D2633'),
    shape(rect(116, 42.5, 12, 3, 1.5), '#62D0FF'),
    shape(circle(149, 44, 7), 'url(#ring)'),
    shape(circle(149, 44, 3), '#FFFFFF', { opacity: 0.8 }),
    shape(circle(120, 104, 34), '#D5DDE6'),
    shape(circle(120, 104, 30), 'url(#ring)'),
    shape(circle(120, 104, 23), 'url(#door)'),
    shape(join(ellipse(120, 113, 20, 9)), 'url(#water)', { opacity: 0.75 }),
    shape('M104 98a18 18 0 0 1 22-14a20 20 0 0 0-22 14z', '#FFFFFF', { opacity: 0.6 }),
    stroke('M101 94a22 22 0 0 1 14-12', '#FFFFFF', 3, { opacity: 0.55 }),
    shape(rect(147, 98, 5, 12, 2.5), '#B8C4D1'),
    gloss(rect(82, 60, 6, 90, 3), 0.5),
    shape(rect(84, 152, 12, 6, 2), '#7E8B9A'),
    shape(rect(144, 152, 12, 6, 2), '#7E8B9A'),
  ],
})
