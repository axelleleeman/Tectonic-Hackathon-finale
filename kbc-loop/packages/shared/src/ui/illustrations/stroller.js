// Pram with carrycot and hood.
import { scene, linear, line, join, shape, gloss, stroke, wheel, accents } from './kit.js'

const [light, deep] = accents.family

export const stroller = scene({
  type: 'stroller',
  category: 'family',
  shadow: [118, 66],
  gradients: [linear('cot', light, deep), linear('hood', '#FFD0E0', light)],
  shapes: [
    stroke(join(line([84, 138], [124, 104], [156, 138]), line([124, 104], [168, 46])), '#3A4352', 4),
    stroke(line([160, 44], [176, 48]), '#232933', 6),
    shape('M66 84H170C170 106 152 120 128 120H104C82 120 66 106 66 84Z', 'url(#cot)'),
    shape('M66 84C66 58 84 40 108 38V84Z', 'url(#hood)'),
    stroke('M74 84C74 64 88 50 104 46', '#FFFFFF', 1.6, { opacity: 0.7 }),
    shape('M66 82H170V88H66Z', '#FFFFFF', { opacity: 0.9 }),
    gloss('M76 96C80 108 92 114 104 115C92 110 84 104 80 94Z', 0.4),
    ...wheel(84, 140, 16),
    ...wheel(156, 140, 16),
  ],
})
