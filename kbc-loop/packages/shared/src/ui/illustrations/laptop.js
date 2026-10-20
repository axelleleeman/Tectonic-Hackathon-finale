// Open laptop, slightly from above.
import { scene, materials, linear, rect, circle, poly, join, shape, gloss, shade } from './kit.js'

export const laptop = scene({
  type: 'laptop',
  category: 'electronics',
  shadow: [120, 78],
  gradients: [
    materials.steel('lid'),
    linear('wall', '#C9BEFF', '#5A3ED6'),
    linear('blob', '#9EF0D0', '#4CC3FF'),
    linear('deck', '#EEF2F6', '#B8C3CF', 'v'),
  ],
  shapes: [
    shape(rect(66, 28, 108, 78, 7), 'url(#lid)'),
    shape(rect(70, 32, 100, 70, 4), '#141A24'),
    shape(rect(73, 35, 94, 64, 3), 'url(#wall)'),
    shape(circle(148, 52, 20), 'url(#blob)', { opacity: 0.75 }),
    shape(circle(88, 92, 22), '#7C64FF', { opacity: 0.5 }),
    shape(join(rect(82, 48, 40, 5, 2.5), rect(82, 58, 26, 4, 2)), '#FFFFFF', { opacity: 0.9 }),
    gloss(poly([73, 35], [112, 35], [73, 76]), 0.1),
    shape(poly([66, 106], [174, 106], [194, 146], [46, 146]), 'url(#deck)'),
    shape(poly([76, 110], [164, 110], [174, 128], [66, 128]), '#AAB5C2', { opacity: 0.55 }),
    shape(poly([104, 132], [136, 132], [138, 142], [102, 142]), '#C8D1DB'),
    shape(rect(44, 146, 152, 6, [0, 0, 4, 4]), '#9AA6B4'),
    shade(rect(108, 146, 24, 2.4, 1.2), 0.25),
  ],
})
