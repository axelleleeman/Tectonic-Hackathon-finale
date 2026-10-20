// Built-in style dishwasher with a stack of plates peeking from the open rack.
import { scene, materials, rect, circle, join, shape, gloss, shade } from './kit.js'

export const dishwasher = scene({
  type: 'dishwasher',
  category: 'appliances',
  shadow: [120, 52],
  gradients: [materials.white('body'), materials.steel('handle', 'v')],
  shapes: [
    shape(rect(78, 36, 84, 120, 9), 'url(#body)'),
    shade(rect(154, 36, 8, 120, [0, 9, 9, 0]), 0.06),
    shape(rect(78, 36, 84, 20, [9, 9, 0, 0]), '#F4F7FA'),
    shape(rect(78, 55, 84, 1.5), '#C9D3DE'),
    shape(rect(86, 41, 30, 10, 3), '#1D2633'),
    shape(rect(90, 44.5, 14, 3, 1.5), '#62D0FF'),
    shape(join(circle(126, 46, 3), circle(136, 46, 3), circle(146, 46, 3)), '#C3CEDA'),
    shape(circle(155, 46, 3), '#1D6CC0'),
    shape(rect(92, 66, 56, 6, 3), 'url(#handle)'),
    shade(rect(92, 71, 56, 2, 1), 0.12),
    shape(rect(78, 140, 84, 16, [0, 0, 9, 9]), '#D3DBE4'),
    shape(rect(78, 140, 84, 1.5), '#BDC8D4'),
    gloss(rect(82, 80, 76, 3, 1.5), 0.6),
    gloss(rect(82, 60, 6, 76, 3), 0.5),
    // plates in the open top rack
    shape(rect(98, 22, 44, 16, 4), '#E9EEF4'),
    shape(join(rect(102, 14, 6, 22, 3), rect(110, 12, 6, 24, 3), rect(118, 14, 6, 22, 3)), '#FFFFFF'),
    shape(join(rect(126, 18, 5, 18, 2.5), rect(133, 18, 5, 18, 2.5)), '#9CCBF2'),
  ],
})
