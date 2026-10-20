// Ergonomic mesh office chair on castors.
import { scene, materials, rect, circle, line, join, shape, gloss, stroke } from './kit.js'

export const officeChair = scene({
  type: 'office-chair',
  category: 'business',
  shadow: [120, 50],
  gradients: [materials.graphite('frame'), materials.graphite('mesh', 'v'), materials.steel('lift', 'h')],
  shapes: [
    stroke(join(line([120, 136], [80, 148]), line([120, 136], [160, 148]), line([120, 136], [104, 150]), line([120, 136], [136, 150])), '#2C3440', 5),
    shape(join(circle(80, 151, 5), circle(160, 151, 5), circle(104, 152, 4.5), circle(136, 152, 4.5)), '#3A4352'),
    shape(rect(116, 104, 8, 34, 3), 'url(#lift)'),
    shape(rect(92, 18, 56, 74, 22), 'url(#frame)'),
    shape(rect(97, 23, 46, 64, 18), 'url(#mesh)'),
    stroke('M101 40H139M101 52H139M101 64H139M101 76H139', '#7E8B9A', 1, { opacity: 0.45 }),
    shape(rect(100, 66, 40, 8, 4), '#1C4A78'),
    stroke(join(line([82, 92], [82, 78], [94, 74]), line([158, 92], [158, 78], [146, 74])), '#3A4352', 4),
    shape(join(rect(74, 74, 18, 6, 3), rect(148, 74, 18, 6, 3)), '#232933'),
    shape(rect(82, 90, 76, 18, 9), 'url(#frame)'),
    gloss(rect(88, 92, 64, 3, 1.5), 0.15),
    gloss(rect(100, 26, 5, 50, 2.5), 0.12),
  ],
})
