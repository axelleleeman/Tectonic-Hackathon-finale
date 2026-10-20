// Children's bike with small wheels and a chain guard.
import { scene, line, circle, rect, join, shape, gloss, stroke, wheel } from './kit.js'

const frame = '#FF8A5B'
const R = [80, 130]
const F = [162, 130]
const C = [118, 132]
const S = [108, 92]
const H = [152, 88]

export const kidsBike = scene({
  type: 'kids-bike',
  category: 'mobility',
  shadow: [120, 64],
  shapes: [
    ...wheel(...R, 22),
    ...wheel(...F, 22),
    stroke(join(line(R, C), line(R, S)), '#E2643A', 4),
    stroke(join(line(S, C), line(C, [154, 98]), line([110, 100], H)), frame, 5.5),
    stroke(line([154, 98], F), '#E2643A', 4),
    stroke(join(line(H, [150, 74]), line([140, 72], [158, 70])), '#3A4352', 4),
    stroke(line(S, [106, 82]), '#3A4352', 4),
    shape('M94 80C94 76 112 76 116 78C116 82 108 84 101 84C96 84 94 82 94 80Z', '#232933'),
    shape(rect(96, 126, 28, 10, 5), '#FFD3C2'),
    shape(circle(...C, 6), '#3A4352'),
    shape(join(circle(158, 72, 2.4), circle(140, 74, 2.4)), '#43D59E'),
  ],
})
