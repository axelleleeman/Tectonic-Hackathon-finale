// Flat-screen TV on slim feet, showing an abstract landscape.
import { scene, materials, linear, rect, circle, poly, join, shape, gloss } from './kit.js'

export const tv = scene({
  type: 'tv',
  category: 'electronics',
  shadow: [120, 74],
  gradients: [
    materials.graphite('frame'),
    linear('sky', '#FFD9B8', '#8E7BFF', 'v'),
    linear('hill', '#6C5CE7', '#2D1B8F', 'v'),
    linear('hill2', '#A193FF', '#5A3ED6', 'v'),
  ],
  shapes: [
    shape(join(poly([66, 128], [74, 128], [64, 152], [56, 152]), poly([166, 128], [174, 128], [184, 152], [176, 152])), '#2C3440'),
    shape(rect(34, 34, 172, 100, 5), 'url(#frame)'),
    shape(rect(37, 37, 166, 92, 3), 'url(#sky)'),
    shape(circle(156, 70, 13), '#FFF3D6', { opacity: 0.95 }),
    shape('M37 104C62 86 86 84 112 98S170 92 203 82V129H37Z', 'url(#hill2)'),
    shape('M37 116C70 102 100 106 126 116S180 112 203 104V129H37Z', 'url(#hill)'),
    gloss(poly([37, 37], [96, 37], [37, 90]), 0.12),
    shape(rect(112, 131, 16, 1.6, 0.8), '#62D0FF'),
  ],
})
