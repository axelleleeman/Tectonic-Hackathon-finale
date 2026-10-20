// De tegelrijen van Aanbod: KBC-Producten, Thema's, Mobiliteit, Voor je zaak, Wonen & Energie en
// Goede doelen. Overal waar KBC Loop past, staat vooraan een klikbare KBC Loop-tegel; de rest is gedempt.
import { Tile, TileRow, SWATCH } from './Tile.js'

const LOOP_SHORT = { energie: 'Energie', toestellen: 'Toestellen', elektronica: 'Elektronica', mobiliteit: 'Fietsen', gezin: 'Gezin & baby', zaak: 'Voor je zaak' }

/** Klikbare tegel naar een KBC Loop-categorie (voor rijen als Mobiliteit en Wonen & Energie). */
function LoopCategoryTile({ category: c, onOpen }) {
  return (
    <Tile isNew emoji={c.icon} swatch={c.tint} label={`${LOOP_SHORT[c.id] ?? c.name} lenen`}
      a11y={`KBC Loop: ${c.name}`} onPress={() => onOpen(c.id)} />
  )
}

/** Rij met eerst de KBC Loop-tegels van de opgegeven categorieën, dan de gewone (gedempte) tegels. */
function ThemedRow({ title, loopIds, categories, onOpen, tiles }) {
  const loopCats = categories.filter((c) => loopIds.includes(c.id))
  return (
    <TileRow title={title} onAll={loopCats.length ? () => onOpen(loopCats[0].id) : null} showAll={tiles.length > 2}>
      {loopCats.map((c) => <LoopCategoryTile key={c.id} category={c} onOpen={onOpen} />)}
      {tiles.map((t) => <Tile key={t.label} {...t} />)}
    </TileRow>
  )
}

export function ProductsSection({ onLoop }) {
  return (
    <TileRow title="KBC-Producten" showAll={false}>
      <Tile isNew icon="loop" label="KBC Loop" a11y="KBC Loop: lenen in plaats van kopen" onPress={onLoop} />
      <Tile icon="wallet" label="Rekeningen" />
      <Tile icon="card" label={'Betaal-\nmiddelen'} />
      <Tile icon="piggy" label="Sparen en beleggen" />
      <Tile icon="house" label="Leningen" />
    </TileRow>
  )
}

export function ThemesSection({ onLoop }) {
  return (
    <TileRow title="Thema's">
      <Tile isNew icon="loop" swatch={SWATCH.loop} label="KBC Loop" a11y="Thema KBC Loop: lenen in plaats van kopen" onPress={onLoop} />
      <Tile icon="signpost" swatch={SWATCH.navy} label="MyMobility" />
      <Tile icon="house" swatch={SWATCH.blue} label="MyHome" />
      <Tile icon="leaf" swatch={SWATCH.green} label="Samen duurzamer" />
      <Tile icon="eye" swatch={SWATCH.yellow} label="Zicht op geld" />
    </TileRow>
  )
}

export function MobilitySection(props) {
  return (
    <ThemedRow {...props} title="Mobiliteit" loopIds={['mobiliteit']} tiles={[
      { icon: 'road', label: 'Vignetten', isNew: true },
      { icon: 'steering', label: 'Rijbewijs B halen' },
      { icon: 'steering', label: 'Rijbewijs B oefenen' },
      { icon: 'parking', label: 'Parkeren' },
    ]} />
  )
}

export function BusinessSection(props) {
  return (
    <ThemedRow {...props} title="Voor je zaak" loopIds={['zaak']} tiles={[
      { icon: 'bolt', label: 'Energieadvies', isNew: true },
      { icon: 'receipt', label: 'Zakelijke mobiliteit' },
      { icon: 'mail', label: 'Aangetekend e-mailen' },
      { icon: 'vault', label: 'Digitale kluis' },
    ]} />
  )
}

export function HomeEnergySection(props) {
  return (
    <ThemedRow {...props} title="Wonen & Energie" loopIds={['energie', 'toestellen']} tiles={[
      { icon: 'sun', label: 'Zonnepanelen' },
      { icon: 'bolt', label: 'Energie besparen' },
      { icon: 'house', label: 'Renoveren' },
    ]} />
  )
}

export function CharitySection() {
  return (
    <TileRow title="Goede doelen" showAll={false}>
      <Tile icon="heart" label="Solidariteits-actie" isNew />
      <Tile icon="flower" label="Steun het onderzoek" />
    </TileRow>
  )
}
