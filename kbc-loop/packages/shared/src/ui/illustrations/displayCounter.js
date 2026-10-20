// Refrigerated display counter for bakeries and delis.
import { scene, materials, linear, rect, ellipse, join, shape, gloss, shade } from './kit.js'

export const displayCounter = scene({
  type: 'display-counter',
  category: 'appliances',
  shadow: [120, 80],
  gradients: [
    materials.white('base', 'v'),
    linear('glass', '#E3F4FF', '#9BCFF0'),
    linear('bread', '#F6C988', '#C98944', 'v'),
    linear('cake', '#FFD2E1', '#F08AAE', 'v'),
  ],
  shapes: [
    shape(rect(42, 104, 156, 52, 8), 'url(#base)'),
    shade(rect(42, 140, 156, 16, [0, 0, 8, 8]), 0.08),
    shape(rect(42, 112, 156, 6), '#1D6CC0'),
    shape(rect(48, 96, 144, 10, 3), '#E9EEF4'),
    shape('M48 98C48 70 66 56 92 54H192V98Z', 'url(#glass)', { opacity: 0.55 }),
    shape(rect(54, 76, 136, 2.5, 1), '#FFFFFF', { opacity: 0.9 }),
    shape(join(ellipse(78, 92, 14, 6), ellipse(108, 92, 14, 6)), 'url(#bread)'),
    shape(join(rect(130, 82, 16, 12, 3), rect(152, 82, 16, 12, 3), rect(174, 84, 12, 10, 3)), 'url(#cake)'),
    shape(join(ellipse(96, 72, 9, 4), ellipse(120, 72, 9, 4)), 'url(#bread)'),
    shape(join(ellipse(150, 72, 10, 4), ellipse(174, 72, 8, 4)), '#F5E4C8'),
    shape(rect(46, 50, 150, 6, 3), '#DCE3EB'),
    gloss('M56 92C58 74 70 64 88 60L92 62C76 66 64 76 62 92Z', 0.8),
    gloss(rect(48, 120, 144, 3, 1.5), 0.6),
  ],
})
