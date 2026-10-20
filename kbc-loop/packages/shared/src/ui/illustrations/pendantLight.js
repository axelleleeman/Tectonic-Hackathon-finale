// Pendant LED fixture as used in shops, offices and warehouses, with a cone of light.
import { scene, materials, linear, rect, ellipse, poly, join, shape, gloss } from './kit.js'

export const pendantLight = scene({
  type: 'pendant-light',
  category: 'energy',
  shadow: false,
  gradients: [
    materials.graphite('shade'),
    linear('beam', '#FFE9A8', '#FFF8E7', 'v'),
    materials.glow('diffuser', 'h'),
  ],
  shapes: [
    shape(poly([80, 96], [160, 96], [204, 156], [36, 156]), 'url(#beam)', { opacity: 0.85 }),
    shape(ellipse(120, 156, 84, 8), '#FFD777', { opacity: 0.35 }),
    shape(rect(118.5, 0, 3, 50), '#3A4352'),
    shape(rect(112, 44, 16, 10, 3), '#3A4352'),
    shape('M72 96C72 70 94 52 120 52S168 70 168 96Z', 'url(#shade)'),
    gloss('M84 86C86 72 98 62 112 59C100 66 92 76 90 88Z', 0.18),
    shape(ellipse(120, 96, 48, 7), '#232933'),
    shape(ellipse(120, 96, 42, 5), 'url(#diffuser)'),
    shape(join(rect(70, 95, 6, 2.4, 1.2), rect(164, 95, 6, 2.4, 1.2)), '#5E6979'),
  ],
})
