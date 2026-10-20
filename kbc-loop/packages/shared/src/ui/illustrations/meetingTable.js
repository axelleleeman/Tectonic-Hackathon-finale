// Meeting-room set: table, chairs and acoustic wall panels.
import { scene, materials, linear, rect, join, shape, gloss, shade, accents } from './kit.js'

const [light, deep] = accents.business

export const meetingTable = scene({
  type: 'meeting-table',
  category: 'business',
  shadow: [120, 90],
  gradients: [materials.wood('top', 'v'), linear('chair', light, deep), linear('panel', '#E6EDF5', '#BFCDDD')],
  shapes: [
    shape(join(rect(38, 22, 34, 50, 6), rect(78, 22, 34, 50, 6), rect(128, 22, 34, 50, 6), rect(168, 22, 34, 50, 6)), 'url(#panel)', { opacity: 0.9 }),
    shape(join(rect(52, 60, 30, 40, 9), rect(105, 60, 30, 40, 9), rect(158, 60, 30, 40, 9)), 'url(#chair)'),
    gloss(join(rect(56, 64, 4, 28, 2), rect(109, 64, 4, 28, 2), rect(162, 64, 4, 28, 2)), 0.25),
    shape(join(rect(52, 106, 8, 48, 2), rect(180, 106, 8, 48, 2)), '#3A4352'),
    shape(rect(30, 94, 180, 12, 5), 'url(#top)'),
    shade(rect(30, 101, 180, 5, [0, 0, 5, 5]), 0.15),
    shape(join(rect(66, 112, 20, 30, 6), rect(154, 112, 20, 30, 6)), 'url(#chair)', { opacity: 0.85 }),
    shape(join(rect(74, 142, 4, 12), rect(162, 142, 4, 12)), '#3A4352'),
  ],
})
