import { useMemo } from 'react'
import { LoopIcon } from '../LoopIcon.jsx'
import { partnerSummaries } from '../partner/partnerModel.js'
import { PartnerLogo } from './PartnerLogo.jsx'
import './intro.css'

const countLabel = (pa, customerType) => {
  if (pa.count) return `${pa.count} product${pa.count === 1 ? '' : 's'}`
  return customerType === 'kmo' ? 'For personal customers' : 'For business customers'
}

/** "Our partners": every partner as a tile (initials, name, category, highlight, product count) → partner page. */
export function PartnerStrip({ customerType, onPartner }) {
  const list = useMemo(() => partnerSummaries(customerType), [customerType])
  return (
    <section className="lp-section lp-pstrip" aria-labelledby="lp-pstrip-title">
      <h2 className="lp-sechead" id="lp-pstrip-title">
        Our partners
        <span className="lp-n lp-num">{list.length} circular partners</span>
      </h2>
      <ul className="lp-ptiles">
        {list.map((pa) => (
          <li key={pa.id}>
            <a href={`#loop/partner/${pa.id}`} className={`lp-card lp-ptile ${pa.count ? '' : 'lp-ptile-off'}`}
              onClick={(e) => { e.preventDefault(); onPartner(pa.id) }}>
              <span className="lp-ptile-top">
                <PartnerLogo name={pa.name} />
                <span className="lp-min0">
                  <b>{pa.name}</b>
                  <span className="lp-sub">{pa.category?.name}</span>
                </span>
                <LoopIcon name="chev" size={16} className="lp-chev" />
              </span>
              <span className="lp-ptile-hl">{pa.profile.highlight}</span>
              <span className="lp-ptile-n">{countLabel(pa, customerType)}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
