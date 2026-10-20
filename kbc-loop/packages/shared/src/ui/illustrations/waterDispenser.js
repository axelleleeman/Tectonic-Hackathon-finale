// Mains-fed filtered water dispenser with a glass of water.
import { scene, materials, linear, rect, circle, join, shape, gloss, shade } from './kit.js'

export const waterDispenser = scene({
  type: 'water-dispenser',
  category: 'appliances',
  shadow: [120, 36],
  gradients: [materials.white('body'), materials.graphite('nook', 'v'), linear('water', '#BFE6FF', '#5FB4F0', 'v')],
  shapes: [
    shape(rect(94, 26, 52, 130, 12), 'url(#body)'),
    shade(rect(138, 26, 8, 130, [0, 12, 12, 0]), 0.07),
    shape(rect(102, 36, 36, 10, 3), '#E3E9F0'),
    shape(join(circle(110, 41, 2.5), circle(120, 41, 2.5)), '#1D6CC0'),
    shape(circle(130, 41, 2.5), '#62D0FF'),
    shape(rect(102, 54, 36, 52, 8), 'url(#nook)'),
    shape(join(rect(110, 54, 6, 8, [0, 0, 2, 2]), rect(124, 54, 6, 8, [0, 0, 2, 2])), '#AAB6C4'),
    shape('M110 76H130L128 100H112Z', '#FFFFFF', { opacity: 0.35 }),
    shape('M111 84H129L128 100H112Z', 'url(#water)', { opacity: 0.9 }),
    shape(rect(104, 100, 32, 4, 2), '#5D6878'),
    gloss(rect(98, 112, 5, 38, 2.5), 0.55),
    shape(rect(102, 116, 36, 2, 1), '#C9D3DE'),
  ],
})
