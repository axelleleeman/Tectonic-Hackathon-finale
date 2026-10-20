// The Loop tab (the KBC Mobile offers screen with KBC Loop as the new focus): the KBC Loop banner and
// categories at the top, then the regular sections. Every KBC Loop entry point is vivid and tappable;
// everything else is dimmed (whole sections here, single tiles inside mixed rows).
import { categoriesFor } from '@kbc-loop/shared/engine/catalog.js'
import { Dimmed } from '../ui/Dimmed.js'
import { LoopHero } from './aanbod/LoopHero.js'
import { LoopCategories } from './aanbod/LoopCategories.js'
import { FavouritesSection, TicketsSection } from './aanbod/TopSections.js'
import { BusinessSection, CharitySection, HomeEnergySection, MobilitySection, ProductsSection, ThemesSection } from './aanbod/CatalogSections.js'
import { CoinOffersSection } from './aanbod/CoinOffers.js'
import { TipsCard } from './aanbod/TipsCard.js'

const GUTTER = 16

export function Shop({ customer, items, actions }) {
  const cats = categoriesFor(customer.type)
  const openCategory = (categoryId) => actions.navigate('category', { categoryId })
  const openLoop = () => openCategory(cats[0].id)
  const rowProps = { categories: cats, onOpen: openCategory }

  return (
    <>
      <LoopHero onDiscover={openLoop} />
      <LoopCategories categories={cats} items={items} actions={actions} />
      <Dimmed bleed={GUTTER}>
        <FavouritesSection />
        <TicketsSection />
      </Dimmed>
      <ProductsSection onLoop={openLoop} />
      <ThemesSection onLoop={openLoop} />
      <CoinOffersSection onMyLoop={() => actions.navigate('mykbc')} />
      <MobilitySection {...rowProps} />
      <BusinessSection {...rowProps} />
      <HomeEnergySection {...rowProps} />
      <Dimmed bleed={GUTTER}>
        <CharitySection />
        <TipsCard />
      </Dimmed>
    </>
  )
}
