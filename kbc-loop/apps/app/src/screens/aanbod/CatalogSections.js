// The tile rows of the Loop tab: KBC products, Themes, Mobility, For your business, Home & energy and
// Good causes. Wherever KBC Loop fits, a tappable KBC Loop tile comes first; the other tiles are dimmed.
// A row without any KBC Loop tile is dimmed as a whole.
import { Dimmed } from '../../ui/Dimmed.js'
import { Tile, TileRow, SWATCH } from './Tile.js'

const GUTTER = 16
const LOOP_SHORT = { energie: 'Energy', toestellen: 'Appliances', elektronica: 'Electronics', mobiliteit: 'Bikes', gezin: 'Family & baby', zaak: 'Business' }

/** Tappable tile to a KBC Loop category (for rows such as Mobility and Home & energy). */
function LoopCategoryTile({ category: c, onOpen }) {
  return (
    <Tile isNew emoji={c.icon} swatch={c.tint} label={`${LOOP_SHORT[c.id] ?? c.name} via Loop`}
      a11y={`KBC Loop: borrow ${c.name}. Open the category`} onPress={() => onOpen(c.id)} />
  )
}

/** Row with the KBC Loop tiles of the given categories first, then the regular (dimmed) tiles. */
function ThemedRow({ title, loopIds, categories, onOpen, tiles }) {
  const loopCats = categories.filter((c) => loopIds.includes(c.id))
  const row = (
    <TileRow title={title} onAll={loopCats.length ? () => onOpen(loopCats[0].id) : null} showAll={tiles.length > 2}>
      {loopCats.map((c) => <LoopCategoryTile key={c.id} category={c} onOpen={onOpen} />)}
      {tiles.map((t) => <Tile key={t.label} {...t} />)}
    </TileRow>
  )
  return loopCats.length ? row : <Dimmed bleed={GUTTER}>{row}</Dimmed>
}

export function ProductsSection({ onLoop }) {
  return (
    <TileRow title="KBC products" showAll={false}>
      <Tile isNew icon="loop" label="KBC Loop" a11y="KBC Loop: borrow instead of buying. Discover the partners" onPress={onLoop} />
      <Tile icon="wallet" label="Accounts" />
      <Tile icon="card" label={'Payment\nmethods'} />
      <Tile icon="piggy" label="Saving and investing" />
      <Tile icon="house" label="Loans" />
    </TileRow>
  )
}

export function ThemesSection({ onLoop }) {
  return (
    <TileRow title="Themes">
      <Tile isNew icon="loop" swatch={SWATCH.loop} label="KBC Loop" a11y="Theme KBC Loop: borrow instead of buying. Discover the partners" onPress={onLoop} />
      <Tile icon="signpost" swatch={SWATCH.navy} label="MyMobility" />
      <Tile icon="house" swatch={SWATCH.blue} label="MyHome" />
      <Tile icon="leaf" swatch={SWATCH.green} label="Greener together" />
      <Tile icon="eye" swatch={SWATCH.yellow} label="Money at a glance" />
    </TileRow>
  )
}

export function MobilitySection(props) {
  return (
    <ThemedRow {...props} title="Mobility" loopIds={['mobiliteit']} tiles={[
      { icon: 'road', label: 'Road vignettes', isNew: true },
      { icon: 'steering', label: 'Get your driving licence' },
      { icon: 'steering', label: 'Practise driving' },
      { icon: 'parking', label: 'Parking' },
    ]} />
  )
}

export function BusinessSection(props) {
  return (
    <ThemedRow {...props} title="For your business" loopIds={['zaak']} tiles={[
      { icon: 'bolt', label: 'Energy advice', isNew: true },
      { icon: 'receipt', label: 'Business mobility' },
      { icon: 'mail', label: 'Registered e-mail' },
      { icon: 'vault', label: 'Digital vault' },
    ]} />
  )
}

export function HomeEnergySection(props) {
  return (
    <ThemedRow {...props} title="Home & energy" loopIds={['energie', 'toestellen']} tiles={[
      { icon: 'sun', label: 'Solar panels' },
      { icon: 'bolt', label: 'Save energy' },
      { icon: 'house', label: 'Renovate' },
    ]} />
  )
}

export function CharitySection() {
  return (
    <TileRow title="Good causes" showAll={false}>
      <Tile icon="heart" label="Solidarity campaign" isNew />
      <Tile icon="flower" label="Support research" />
    </TileRow>
  )
}
