// Walk-behind battery floor scrubber.
import { scene, materials, linear, rect, circle, line, join, shape, gloss, shade, stroke, accents } from './kit.js'

export const floorScrubber = scene({
  type: 'floor-scrubber',
  category: 'business',
  shadow: [118, 72],
  gradients: [linear('tank', accents.business[0], accents.business[1]), materials.graphite('base', 'v'), materials.steel('bar', 'h')],
  shapes: [
    stroke(join(line([150, 96], [174, 36]), line([166, 34], [184, 40])), '#3A4352', 5),
    shape(rect(168, 30, 14, 10, 4), '#232933'),
    shape('M70 92C70 74 84 64 104 64H140C152 64 160 74 160 86V124H70Z', 'url(#tank)'),
    gloss('M78 90C78 78 88 70 102 70H130C110 72 88 76 84 92Z', 0.3),
    shape(rect(92, 76, 30, 6, 3), '#FFFFFF', { opacity: 0.7 }),
    shape(rect(62, 118, 108, 24, 8), 'url(#base)'),
    shape(rect(48, 138, 82, 12, 6), '#2C3440'),
    shape(rect(52, 147, 74, 5, 2.5), '#62B6F2', { opacity: 0.6 }),
    shape(circle(150, 144, 11), '#232933'),
    shape(circle(150, 144, 4), '#8C97A6'),
    shade(rect(62, 118, 108, 4, 2), 0.2),
  ],
})
