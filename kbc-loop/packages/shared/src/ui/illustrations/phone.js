// Smartphone, front view with a soft abstract wallpaper.
import { scene, materials, linear, rect, circle, poly, join, shape, gloss } from './kit.js'

export const phone = scene({
  type: 'phone',
  category: 'electronics',
  shadow: [122, 34],
  gradients: [
    materials.graphite('frame'),
    linear('wall', '#B7A8FF', '#4B2FC9'),
    linear('blob', '#FFB3D1', '#8E7BFF'),
  ],
  shapes: [
    shape(rect(100, 18, 50, 138, 13), '#1A1F28'),
    shape(rect(95, 16, 50, 138, 13), 'url(#frame)'),
    shape(rect(98, 19, 44, 132, 10.5), 'url(#wall)'),
    shape(circle(132, 50, 26), 'url(#blob)', { opacity: 0.85 }),
    shape(circle(104, 124, 30), '#7C64FF', { opacity: 0.55 }),
    shape(rect(112, 24, 16, 5, 2.5), '#0B0E14'),
    shape(join(rect(106, 70, 28, 4, 2), rect(110, 78, 20, 3, 1.5)), '#FFFFFF', { opacity: 0.9 }),
    shape(join(rect(106, 128, 9, 9, 3), rect(118, 128, 9, 9, 3), rect(130, 128, 9, 9, 3)), '#FFFFFF', { opacity: 0.55 }),
    shape(rect(110, 145, 20, 2, 1), '#FFFFFF', { opacity: 0.8 }),
    gloss(poly([98, 19], [124, 19], [98, 70]), 0.12),
    shape(rect(144.5, 46, 2, 16, 1), '#3A4352'),
  ],
})
