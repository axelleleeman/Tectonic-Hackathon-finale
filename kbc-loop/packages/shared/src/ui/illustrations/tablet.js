// Tablet docked in a keyboard case.
import { scene, materials, linear, rect, circle, poly, join, shape, gloss, shade } from './kit.js'

const keys = []
for (let row = 0; row < 3; row += 1) {
  const y = 138 + row * 5
  const inset = 8 - row * 2.6
  for (let k = 0; k < 10; k += 1) keys.push(rect(70 + inset + k * 10.4 - row * 0.4, y, 8, 3.4, 1))
}

export const tablet = scene({
  type: 'tablet',
  category: 'electronics',
  shadow: [120, 70],
  gradients: [
    materials.graphite('frame'),
    linear('wall', '#C9BEFF', '#5A3ED6'),
    linear('blob', '#FFD0A8', '#FF8FB8'),
    materials.steel('deck', 'v'),
  ],
  shapes: [
    shape(rect(64, 30, 112, 92, 9), 'url(#frame)'),
    shape(rect(68, 34, 104, 84, 6), 'url(#wall)'),
    shape(circle(146, 58, 22), 'url(#blob)', { opacity: 0.8 }),
    shape(circle(86, 106, 26), '#7C64FF', { opacity: 0.5 }),
    shape(join(rect(78, 48, 40, 5, 2.5), rect(78, 58, 28, 4, 2)), '#FFFFFF', { opacity: 0.9 }),
    gloss(poly([68, 34], [110, 34], [68, 78]), 0.1),
    shape(poly([54, 154], [186, 154], [176, 128], [64, 128]), 'url(#deck)'),
    shade(poly([54, 154], [186, 154], [185, 151], [55, 151]), 0.15),
    shape(join(keys), '#5E6979', { opacity: 0.8 }),
    shape(rect(66, 122, 108, 8, 3), '#3A4352'),
  ],
})
