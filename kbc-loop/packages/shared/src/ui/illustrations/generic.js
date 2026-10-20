// Generic fallback: a parcel with a circular "loop" arrow.
import { scene, linear, poly, join, shape, gloss, shade, stroke, accents } from './kit.js'

export const generic = scene({
  type: 'generic',
  category: 'generic',
  shadow: [120, 66],
  gradients: [linear('top', '#F6E3C6', '#E7C99C'), linear('left', '#E9C99A', '#CFA670', 'v'), linear('right', '#DDB784', '#BC8E57', 'v')],
  shapes: [
    shape(poly([120, 34], [182, 60], [120, 86], [58, 60]), 'url(#top)'),
    shape(poly([58, 60], [120, 86], [120, 154], [58, 128]), 'url(#left)'),
    shape(poly([120, 86], [182, 60], [182, 128], [120, 154]), 'url(#right)'),
    shape(poly([90, 47], [100, 43], [162, 69], [152, 73]), '#FFFFFF', { opacity: 0.55 }),
    shape(poly([152, 73], [162, 69], [162, 92], [152, 96]), '#FFFFFF', { opacity: 0.4 }),
    stroke('M76 104C76 92 86 84 96 88M102 116C102 128 92 136 82 132', accents.generic[1], 4),
    shape(join(poly([94, 82], [102, 89], [92, 94]), poly([84, 138], [76, 131], [86, 126])), accents.generic[1]),
  ],
})
