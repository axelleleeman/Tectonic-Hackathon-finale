// Point-of-sale set: touchscreen till, receipt printer and card terminal.
import { scene, materials, linear, rect, poly, join, shape, gloss, shade, accents } from './kit.js'

export const posTerminal = scene({
  type: 'pos-terminal',
  category: 'business',
  shadow: [118, 80],
  gradients: [materials.graphite('body'), linear('screen', accents.business[0], accents.business[1]), materials.white('printer'), materials.glass('pad')],
  shapes: [
    shape(poly([92, 150], [132, 150], [124, 108], [100, 108]), '#3A4352'),
    shape(rect(84, 146, 56, 10, 4), 'url(#body)'),
    shape(poly([66, 34], [160, 28], [164, 104], [70, 112]), 'url(#body)'),
    shape(poly([71, 39], [155, 34], [159, 99], [75, 106]), 'url(#screen)'),
    shape(join(poly([80, 46], [116, 44], [116, 62], [81, 64]), poly([122, 44], [148, 42], [149, 60], [123, 62])), '#FFFFFF', { opacity: 0.25 }),
    shape(join(poly([82, 72], [148, 68], [149, 74], [82, 78]), poly([82, 84], [128, 81], [128, 86], [82, 89])), '#FFFFFF', { opacity: 0.6 }),
    gloss(poly([71, 39], [110, 37], [74, 80]), 0.12),
    shape(rect(30, 116, 42, 40, 7), 'url(#printer)'),
    shape(poly([40, 116], [62, 116], [60, 90], [42, 90]), '#FFFFFF'),
    shade(rect(36, 114, 30, 4, 2), 0.3),
    shape(rect(170, 104, 38, 52, 8), 'url(#body)'),
    shape(rect(176, 110, 26, 16, 3), 'url(#pad)'),
    shape(join([0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => rect(177 + c * 9, 131 + r * 7, 6, 4.5, 1.5)))), '#8C97A6'),
  ],
})
