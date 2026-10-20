// Electric bicycle with frame battery and mid-drive motor.
import { scene, materials, line, circle, rect, join, shape, stroke, wheel, accents } from './kit.js'

const [light, deep] = accents.mobility
const R = [68, 126]
const F = [172, 126]
const C = [116, 128]
const S = [104, 80]
const H = [158, 76]
const H2 = [161, 90]

export const ebike = scene({
  type: 'ebike',
  category: 'mobility',
  shadow: [120, 84],
  gradients: [materials.graphite('battery')],
  shapes: [
    ...wheel(...R, 30),
    ...wheel(...F, 30),
    stroke(join(line(R, C), line(R, S)), deep, 4.5),
    stroke(join(line(S, C), line(C, H2), line([106, 88], H)), light, 6),
    stroke(line(H2, F), deep, 4.5),
    stroke(line([123, 116], [150, 96]), 'url(#battery)', 8),
    stroke(line(H, [154, 62]), '#3A4352', 4),
    stroke(line([146, 62], [166, 60]), '#232933', 4.5),
    stroke(line(S, [101, 68]), '#3A4352', 4),
    shape('M88 66C88 62 108 61 114 64C114 68 104 70 96 70C90 70 88 68 88 66Z', '#232933'),
    shape(circle(...C, 9), '#3A4352'),
    shape(circle(...C, 4), '#8C97A6'),
    shape(rect(161, 70, 7, 5, 2), '#FFE27A'),
  ],
})
