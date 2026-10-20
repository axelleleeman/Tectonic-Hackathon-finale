// Front-loading electric cargo bike with a box for children or deliveries.
import { scene, materials, linear, line, circle, rect, join, shape, gloss, stroke, wheel, accents } from './kit.js'

const [light, deep] = accents.mobility

export const cargoBike = scene({
  type: 'cargo-bike',
  category: 'mobility',
  shadow: [120, 92],
  gradients: [linear('box', light, deep), materials.graphite('battery')],
  shapes: [
    ...wheel(56, 128, 28),
    ...wheel(182, 136, 20),
    stroke(join(line([56, 128], [96, 132], [82, 82]), line([56, 128], [82, 86])), deep, 4.5),
    stroke(line([96, 132], [190, 132]), deep, 5),
    stroke(join(line([82, 82], [96, 132]), line([96, 132], [112, 82])), light, 6),
    stroke(line([112, 82], [182, 136]), deep, 4),
    stroke(line([108, 94], [100, 116]), 'url(#battery)', 7),
    stroke(join(line([112, 82], [114, 64]), line([104, 64], [124, 62])), '#232933', 4.5),
    shape('M66 74C66 70 86 69 92 72C92 76 82 78 74 78C68 78 66 76 66 74Z', '#232933'),
    stroke(line([82, 82], [79, 74]), '#3A4352', 4),
    shape(rect(124, 88, 66, 42, 7), 'url(#box)'),
    gloss(rect(128, 92, 58, 4, 2), 0.35),
    shape(rect(124, 100, 66, 2), '#0B6B52', { opacity: 0.5 }),
    shape(circle(96, 132, 8), '#3A4352'),
  ],
})
