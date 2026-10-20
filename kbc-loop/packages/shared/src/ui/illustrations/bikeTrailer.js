// Two-seat child bike trailer that converts to a jogging stroller.
import { scene, linear, line, circle, join, shape, gloss, stroke, wheel, accents } from './kit.js'

const [light, deep] = accents.family

export const bikeTrailer = scene({
  type: 'bike-trailer',
  category: 'family',
  shadow: [124, 74],
  gradients: [linear('canopy', light, deep), linear('mesh', '#FFFFFF', '#E7EEF6')],
  shapes: [
    stroke(line([84, 126], [40, 112]), '#3A4352', 4),
    shape(circle(38, 112, 4), '#232933'),
    shape('M84 132V96C84 66 110 50 140 50C164 50 180 64 184 86L190 132Z', 'url(#canopy)'),
    shape('M100 110V96C100 76 116 64 136 64C152 64 164 74 168 90L170 110Z', 'url(#mesh)', { opacity: 0.85 }),
    stroke('M118 66L118 110M136 64V110M154 70L154 110', '#D5DDE6', 1.2),
    gloss('M92 96C92 76 108 60 128 56C112 64 100 78 98 96Z', 0.3),
    shape('M80 128H194V136C194 140 190 142 186 142H88C84 142 80 140 80 136Z', '#3A4352'),
    ...wheel(140, 134, 22),
    stroke(line([190, 130], [204, 146]), '#3A4352', 3.5),
    shape(circle(204, 148, 7), '#262C36'),
    stroke(line([84, 96], [72, 76]), '#FFCB52', 1.6),
    shape('M72 76L84 72L76 82Z', '#FFCB52'),
  ],
})
