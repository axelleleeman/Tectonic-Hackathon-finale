// Bestaande KBC-diensten waar KBC Loop op voortbouwt.
// `name` = naam zoals in de KBC-ecosysteemlijst (KBC_Ecosystems.xlsx), `label` = korte uitleg in de app.

export const kbcServices = {
  kateInsights: { name: 'Query income and expenses via Kate', label: 'Kate-inzichten in je uitgaven', ecosystem: 'Digital platforms and assistance' },
  psd2: { name: 'PSD2 Account Information Services', label: 'Rekeningen bij andere banken (PSD2)', ecosystem: 'General integrations' },
  homeLoan: { name: 'Home loan', label: 'Woonkrediet', ecosystem: 'Housing' },
  businessCo2: { name: 'Business CO2 insights and sector comparison', label: 'CO₂-inzichten voor je zaak', ecosystem: 'Energy and sustainability' },
  kate: { name: 'Kate', label: 'Kate, je digitale assistent', ecosystem: 'Digital platforms and assistance' },
  kbcMobile: { name: 'KBC Mobile', label: 'KBC Mobile', ecosystem: 'Digital platforms and assistance' },
  businessApp: { name: 'KBC Business app', label: 'KBC Business app', ecosystem: 'Digital platforms and assistance' },
  b2bAsset: { name: 'B2B Asset Financing', label: 'KBC financiert de toestellen van de partner', ecosystem: 'Business' },
  b2bAssetHub: { name: 'B2B Asset Financing - Partner Hub', label: 'Financiering ingebouwd bij de partner', ecosystem: 'Business' },
  instalmentHub: { name: 'Instalment Loan - Partner Hub', label: 'Afbetaling bij overname van het product', ecosystem: 'General integrations' },
  m2m: { name: 'Machine-to-machine payment solutions', label: 'Betalen per gebruik (toestel rekent zelf af)', ecosystem: 'Business' },
  homeInsurance: { name: 'Home insurance', label: 'Woonverzekering', ecosystem: 'Housing' },
  officeInsurance: { name: 'Office and building insurance', label: 'Kantoor- en gebouwverzekering', ecosystem: 'Business protection' },
  bicycleInsurance: { name: 'Bicycle insurance', label: 'Fietsverzekering', ecosystem: 'Mobility' },
  familyInsurance: { name: 'Family insurance', label: 'Familiale verzekering', ecosystem: 'Family and protection' },
  onlineFraud: { name: 'Online fraud insurance', label: 'Verzekering tegen online fraude', ecosystem: 'Security' },
  kateCoins: { name: 'Kate Coins', label: 'Kate Coins voor herstellen en inleveren', ecosystem: 'Shopping and everyday services' },
  joyn: { name: 'Joyn loyalty points', label: 'Joyn-punten bij partners', ecosystem: 'Shopping and everyday services' },
  ecoWise: { name: 'ecoWise', label: 'Je impact in ecoWise', ecosystem: 'Energy and sustainability' },
  kubeEsg: { name: 'Kube ESG', label: 'ESG-rapportering voor je zaak', ecosystem: 'Energy and sustainability' },
  savingTips: { name: 'Energy consumption and saving tips', label: 'Energieverbruik en bespaartips', ecosystem: 'Energy and sustainability' },
  partnerHub: { name: 'KBC Partner Hub', label: 'Partners sluiten aan via de Partner Hub', ecosystem: 'Digital platforms and assistance' },
  devPortal: { name: 'KBC Developer Portal', label: 'API’s voor partners', ecosystem: 'Digital platforms and assistance' },
  webhooks: { name: 'Application status webhooks', label: 'Live status van herstellingen', ecosystem: 'General integrations' },
  energyLoan: { name: 'Energy loan', label: 'Energielening', ecosystem: 'Energy and sustainability' },
  solarQuote: { name: 'Calculate solar panels and request a quote', label: 'Zonnepanelen berekenen', ecosystem: 'Energy and sustainability' },
  batteryQuote: { name: 'Calculate a home battery and request a quote', label: 'Thuisbatterij berekenen', ecosystem: 'Energy and sustainability' },
  myHome: { name: 'MyHome', label: 'MyHome', ecosystem: 'Housing' },
  myMobility: { name: 'MyMobility', label: 'MyMobility', ecosystem: 'Mobility' },
  bikeLoan: { name: 'Bicycle, scooter or motorcycle loan', label: 'Fietslening (om over te nemen)', ecosystem: 'Mobility' },
  businessDashboard: { name: 'KBC Business Dashboard', label: 'KBC Business Dashboard', ecosystem: 'Digital platforms and assistance' },
}

// KBC Loop stap voor stap: welke bestaande diensten worden gebruikt.
export const loopSteps = [
  { step: 'Signaal herkennen', services: ['kateInsights', 'psd2', 'homeLoan', 'businessCo2'] },
  { step: 'Voorstel tonen', services: ['kate', 'kbcMobile', 'businessApp'] },
  { step: 'Financieren', services: ['b2bAsset', 'b2bAssetHub', 'instalmentHub'] },
  { step: 'Betalen per gebruik', services: ['m2m'] },
  { step: 'Verzekeren', services: ['homeInsurance', 'officeInsurance', 'bicycleInsurance', 'onlineFraud'] },
  { step: 'Belonen', services: ['kateCoins', 'joyn'] },
  { step: 'Impact meten', services: ['ecoWise', 'kubeEsg', 'savingTips'] },
  { step: 'Partners aansluiten', services: ['partnerHub', 'devPortal', 'webhooks'] },
]

// Verwante KBC-diensten per Loop-categorie (cross-sell op de categoriepagina).
export const categoryServices = {
  energie: ['energyLoan', 'solarQuote', 'batteryQuote', 'savingTips'],
  toestellen: ['homeInsurance', 'myHome'],
  elektronica: ['onlineFraud', 'familyInsurance'],
  mobiliteit: ['myMobility', 'bicycleInsurance', 'bikeLoan'],
  gezin: ['familyInsurance'],
  zaak: ['businessDashboard', 'officeInsurance', 'kubeEsg'],
}
