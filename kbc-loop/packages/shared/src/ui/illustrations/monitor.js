// Desktop monitor on a stand.
import { scene, materials, linear, rect, circle, ellipse, poly, join, shape, gloss } from './kit.js'

export const monitor = scene({
  type: 'monitor',
  category: 'electronics',
  shadow: [120, 46],
  gradients: [
    materials.graphite('frame'),
    linear('wall', '#BDE7FF', '#5A3ED6'),
    linear('blob', '#FFD0A8', '#FF8FB8'),
    materials.steel('stand', 'h'),
  ],
  shapes: [
    shape(poly([112, 104], [128, 104], [132, 150], [108, 150]), 'url(#stand)'),
    shape(ellipse(120, 151, 34, 5), '#AAB6C4'),
    shape(ellipse(120, 150, 34, 4.4), 'url(#stand)'),
    shape(rect(52, 26, 136, 84, 7), 'url(#frame)'),
    shape(rect(56, 30, 128, 72, 4), 'url(#wall)'),
    shape(circle(156, 48, 24), 'url(#blob)', { opacity: 0.8 }),
    shape(circle(76, 98, 28), '#7C64FF', { opacity: 0.45 }),
    shape(join(rect(68, 44, 48, 6, 3), rect(68, 55, 32, 4, 2)), '#FFFFFF', { opacity: 0.9 }),
    gloss(poly([56, 30], [104, 30], [56, 82]), 0.1),
    shape(rect(52, 102, 136, 8, [0, 0, 7, 7]), '#2C3440'),
    shape(circle(120, 106, 1.6), '#62D0FF'),
  ],
})
