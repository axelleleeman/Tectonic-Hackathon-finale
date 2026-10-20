import { test } from 'node:test'
import assert from 'node:assert/strict'
import { partners } from '../src/data/partners.js'
import { partnerProfiles, partnerProfile } from '../src/data/partnerProfiles.js'

test('every partner has a profile with the required fields', () => {
  for (const id of Object.keys(partners)) {
    const p = partnerProfiles[id]
    assert.ok(p, `${id} has no profile`)
    for (const key of ['about', 'headquarters', 'serviceArea', 'highlight']) assert.ok(typeof p[key] === 'string' && p[key].length > 0, `${id}.${key}`)
    for (const key of ['repairSlaHours', 'technicians', 'refurbishRate', 'co2PerUnitKg']) assert.ok(typeof p[key] === 'number' && p[key] > 0, `${id}.${key}`)
    assert.ok(p.refurbishRate <= 100, `${id}.refurbishRate`)
    assert.ok(p.founded === null || (Number.isInteger(p.founded) && p.founded > 1800), `${id}.founded`)
    assert.ok(Array.isArray(p.services) && p.services.length >= 3, `${id}.services`)
    assert.ok(Array.isArray(p.certifications) && p.certifications.every((c) => c.endsWith('(demo)')), `${id}.certifications`)
  }
})

test('profiles exist only for known partners and unknown ids get a default', () => {
  for (const id of Object.keys(partnerProfiles)) assert.ok(partners[id], `profile for unknown partner ${id}`)
  assert.equal(typeof partnerProfile('nope').about, 'string')
})
