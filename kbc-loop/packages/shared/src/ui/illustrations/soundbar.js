// Soundbar with a separate subwoofer.
import { scene, materials, rect, circle, join, shape, gloss, shade } from './kit.js'

const dots = []
for (let i = 0; i < 18; i += 1) dots.push(circle(50 + i * 5.8, 122, 1.1))

export const soundbar = scene({
  type: 'soundbar',
  category: 'electronics',
  shadow: [120, 84],
  gradients: [materials.graphite('body'), materials.graphite('sub'), materials.glass('cone')],
  shapes: [
    shape(rect(150, 60, 56, 96, 10), 'url(#sub)'),
    shade(rect(198, 60, 8, 96, [0, 10, 10, 0]), 0.25),
    shape(circle(178, 106, 22), '#1A1F28'),
    shape(circle(178, 106, 17), 'url(#cone)'),
    shape(circle(178, 106, 6), '#3A4352'),
    shape(rect(36, 112, 116, 22, 11), 'url(#body)'),
    shape(join(dots), '#8C97A6', { opacity: 0.8 }),
    gloss(rect(46, 115, 96, 2.4, 1.2), 0.22),
    shape(circle(140, 128, 1.6), '#62D0FF'),
    gloss(rect(154, 66, 4, 84, 2), 0.12),
  ],
})
