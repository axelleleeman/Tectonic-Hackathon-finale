// Outdoor heat-pump unit with fan grille and refrigerant pipes.
import { scene, materials, rect, circle, line, join, shape, gloss, shade, stroke } from './kit.js'

const vents = []
for (let i = 0; i < 7; i += 1) vents.push(rect(150, 74 + i * 9, 26, 3, 1.5))

export const heatPump = scene({
  type: 'heat-pump',
  category: 'energy',
  shadow: [118, 72],
  gradients: [materials.white('body'), materials.graphite('fan'), materials.steel('pipe', 'v')],
  shapes: [
    stroke(join(line([186, 92], [200, 92], [200, 156]), line([186, 104], [208, 104], [208, 156])), '#B9C3CF', 5),
    shape(rect(50, 58, 138, 90, 9), 'url(#body)'),
    shade(rect(180, 58, 8, 90, [0, 9, 9, 0]), 0.07),
    shape(rect(50, 58, 138, 8, [9, 9, 0, 0]), '#F4F7FA'),
    shape(circle(100, 104, 34), '#D5DDE6'),
    shape(circle(100, 104, 30), 'url(#fan)'),
    shape('M100 104C92 86 104 78 110 82C114 88 106 96 100 104ZM100 104C118 98 124 110 120 116C114 118 108 110 100 104ZM100 104C96 122 82 120 80 114C82 108 92 106 100 104Z', '#8C97A6'),
    shape(circle(100, 104, 5), '#C9D3DE'),
    stroke(join(circle(100, 104, 20), circle(100, 104, 26)), '#FFFFFF', 1, { opacity: 0.25 }),
    shape(join(vents), '#D5DDE6'),
    shape(rect(150, 136, 26, 6, 3), '#F08A24'),
    gloss(rect(54, 70, 4, 72, 2), 0.7),
    shape(join(rect(60, 148, 16, 8, 2), rect(162, 148, 16, 8, 2)), '#7E8B9A'),
  ],
})
