// Robot vacuum cleaner.
import { scene, materials, rect, circle, ellipse, join, shape, gloss, shade, accent } from './kit.js'

export const vacuum = scene({
  type: 'vacuum',
  category: 'appliances',
  shadow: [120, 66],
  gradients: [materials.white('top', 'v'), materials.graphite('side', 'h'), accent('appliances')],
  shapes: [
    shape('M58 116V132A62 20 0 0 0 182 132V116Z', 'url(#side)'),
    shape(ellipse(120, 116, 62, 20), 'url(#top)'),
    shape(ellipse(120, 116, 48, 14), '#EEF2F6'),
    shape('M80 112A40 11 0 0 1 160 112A40 10 0 0 0 80 112Z', '#FFFFFF', { opacity: 0.8 }),
    shape('M108 100V108A12 4 0 0 0 132 108V100Z', '#2C3440'),
    shape(ellipse(120, 100, 12, 4), '#4A5566'),
    shape(ellipse(120, 99, 7, 2.2), 'url(#accent)'),
    shape(rect(110, 120, 20, 4, 2), 'url(#accent)'),
    shade('M58 124A62 20 0 0 0 182 124V128A62 20 0 0 1 58 128Z', 0.25),
    gloss(ellipse(96, 112, 14, 3), 0.6),
  ],
})
