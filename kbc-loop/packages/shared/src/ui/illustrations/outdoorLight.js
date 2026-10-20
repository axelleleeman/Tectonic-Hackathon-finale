// Outdoor post lantern for gardens, paths and car parks, beside a shrub.
import { scene, materials, linear, rect, circle, ellipse, poly, join, shape, gloss } from './kit.js'

export const outdoorLight = scene({
  type: 'outdoor-light',
  category: 'energy',
  shadow: [118, 50],
  gradients: [
    materials.graphite('post', 'h'),
    materials.glow('lantern'),
    linear('shrub', '#7EDDA6', '#2E9E6A'),
    linear('halo', '#FFE7A3', '#FFF8E7', 'v'),
  ],
  shapes: [
    shape(circle(124, 56, 40), 'url(#halo)', { opacity: 0.7 }),
    shape(join(circle(78, 132, 22), circle(98, 126, 20), circle(62, 142, 14)), 'url(#shrub)'),
    shape(join(circle(162, 140, 16), circle(178, 144, 12)), 'url(#shrub)', { opacity: 0.85 }),
    shape(rect(116, 82, 16, 74, 3), 'url(#post)'),
    shape(rect(110, 148, 28, 8, 3), '#2C3440'),
    shape(rect(112, 78, 24, 6, 2), '#2C3440'),
    shape(poly([108, 40], [140, 40], [136, 78], [112, 78]), 'url(#lantern)'),
    shape(join(rect(122.5, 40, 3, 38)), '#2C3440', { opacity: 0.8 }),
    shape(poly([100, 40], [124, 24], [148, 40]), '#2C3440'),
    shape(rect(100, 38, 48, 5, 2), '#3A4352'),
    gloss(poly([111, 44], [118, 44], [116, 74], [114, 74]), 0.6),
    shape(ellipse(124, 156, 34, 4), '#FFD777', { opacity: 0.4 }),
  ],
})
