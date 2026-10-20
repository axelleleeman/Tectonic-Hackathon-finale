// Smart LED bulb with a warm glow.
import { scene, materials, linear, rect, circle, ellipse, join, shape, gloss, stroke } from './kit.js'

export const lamp = scene({
  type: 'lamp',
  category: 'energy',
  shadow: [120, 22],
  gradients: [
    linear('bulb', '#FFFDF4', '#FFE08A'),
    materials.steel('cap', 'h'),
    linear('halo', '#FFE7A3', '#FFC24D', 'v'),
  ],
  shapes: [
    shape(circle(120, 62, 52), 'url(#halo)', { opacity: 0.35 }),
    shape(circle(120, 62, 40), '#FFE7A3', { opacity: 0.45 }),
    shape('M120 22C144 22 160 40 160 62C160 79 150 89 144 100C141 106 140 110 140 114H100C100 110 99 106 96 100C90 89 80 79 80 62C80 40 96 22 120 22Z', 'url(#bulb)'),
    stroke('M110 112V92L114 80L120 90L126 80L130 92V112', '#F2A93B', 2.6),
    gloss('M96 46C100 34 110 28 120 28C110 32 102 40 100 52Z', 0.85),
    shape(rect(100, 114, 40, 8, 3), 'url(#cap)'),
    shape(join(rect(102, 122, 36, 6, 3), rect(104, 129, 32, 6, 3), rect(106, 136, 28, 6, 3)), 'url(#cap)'),
    shape(join(rect(102, 127.4, 36, 1.4), rect(104, 134.4, 32, 1.4)), '#8994A3', { opacity: 0.6 }),
    shape('M110 142H130L126 150H114Z', '#3A4352'),
    shape(ellipse(120, 151, 6, 2.4), '#5E6979'),
  ],
})
