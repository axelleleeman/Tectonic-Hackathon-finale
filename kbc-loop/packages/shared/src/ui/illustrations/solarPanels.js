// Tilted solar panel array on a frame, with the sun behind it.
import { scene, materials, linear, line, circle, poly, join, shape, gloss, stroke, lerp } from './kit.js'

const BL = [38, 132]
const BR = [202, 132]
const TR = [182, 52]
const TL = [58, 52]
const grid = []
for (let i = 1; i < 6; i += 1) grid.push(line(lerp(BL, BR, i / 6), lerp(TL, TR, i / 6)))
for (let j = 1; j < 4; j += 1) grid.push(line(lerp(BL, TL, j / 4), lerp(BR, TR, j / 4)))

export const solarPanels = scene({
  type: 'solar-panels',
  category: 'energy',
  shadow: [120, 86],
  gradients: [
    linear('cells', '#3D6FC0', '#142B57'),
    materials.steel('frame', 'h'),
    linear('sun', '#FFE27A', '#FFA53A'),
  ],
  shapes: [
    shape(circle(184, 40, 26), '#FFE7A3', { opacity: 0.6 }),
    shape(circle(184, 40, 16), 'url(#sun)'),
    stroke(join(line([62, 132], [76, 156]), line([178, 132], [164, 156]), line([92, 132], [94, 156]), line([148, 132], [146, 156])), '#8C97A6', 5),
    shape(poly([BL[0] - 4, BL[1] + 4], [BR[0] + 4, BR[1] + 4], [TR[0] + 3, TR[1] - 3], [TL[0] - 3, TL[1] - 3]), 'url(#frame)'),
    shape(poly(BL, BR, TR, TL), 'url(#cells)'),
    stroke(join(grid), '#8FB6EC', 1.4, { opacity: 0.55 }),
    gloss(poly([58, 52], [118, 52], [72, 132], [38, 132]), 0.12),
    gloss(poly([134, 52], [150, 52], [128, 132], [110, 132]), 0.08),
  ],
})
