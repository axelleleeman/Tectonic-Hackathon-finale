// Tabblad "Aanbod" zoals in KBC Mobile, met KBC Loop als nieuwe rubriek: de KBC Loop-banner en
// -categorieën bovenaan, daarna de gewone rubrieken (gedempt) met overal een KBC Loop-ingang waar die past.
import { categoriesFor } from '@kbc-loop/shared/engine/catalog.js'
import { LoopHero } from './aanbod/LoopHero.js'
import { LoopCategories } from './aanbod/LoopCategories.js'
import { FavouritesSection, TicketsSection } from './aanbod/TopSections.js'
import { BusinessSection, CharitySection, HomeEnergySection, MobilitySection, ProductsSection, ThemesSection } from './aanbod/CatalogSections.js'
import { CoinOffersSection } from './aanbod/CoinOffers.js'
import { TipsCard } from './aanbod/TipsCard.js'

export function Shop({ customer, items, actions }) {
  const cats = categoriesFor(customer.type)
  const openCategory = (categoryId) => actions.navigate('category', { categoryId })
  const openLoop = () => openCategory(cats[0].id)
  const rowProps = { categories: cats, onOpen: openCategory }

  return (
    <>
      <LoopHero onDiscover={openLoop} />
      <LoopCategories categories={cats} items={items} actions={actions} />
      <FavouritesSection />
      <TicketsSection />
      <ProductsSection onLoop={openLoop} />
      <ThemesSection onLoop={openLoop} />
      <CoinOffersSection onMyLoop={() => actions.navigate('mykbc')} />
      <MobilitySection {...rowProps} />
      <BusinessSection {...rowProps} />
      <HomeEnergySection {...rowProps} />
      <CharitySection />
      <TipsCard />
    </>
  )
}
