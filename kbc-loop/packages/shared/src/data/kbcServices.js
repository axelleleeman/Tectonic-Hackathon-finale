// Existing KBC services that KBC Loop builds on.
// `name` = name as in the KBC ecosystem list (KBC_Ecosystems.xlsx), `label` = short explanation in the app.

export const kbcServices = {
  kateInsights: { name: 'Query income and expenses via Kate', label: 'Kate insights into your spending', ecosystem: 'Digital platforms and assistance' },
  psd2: { name: 'PSD2 Account Information Services', label: 'Accounts at other banks (PSD2)', ecosystem: 'General integrations' },
  homeLoan: { name: 'Home loan', label: 'Home loan', ecosystem: 'Housing' },
  businessCo2: { name: 'Business CO2 insights and sector comparison', label: 'CO₂ insights for your business', ecosystem: 'Energy and sustainability' },
  kate: { name: 'Kate', label: 'Kate, your digital assistant', ecosystem: 'Digital platforms and assistance' },
  kbcMobile: { name: 'KBC Mobile', label: 'KBC Mobile', ecosystem: 'Digital platforms and assistance' },
  businessApp: { name: 'KBC Business app', label: 'KBC Business app', ecosystem: 'Digital platforms and assistance' },
  b2bAsset: { name: 'B2B Asset Financing', label: 'KBC finances the partner’s equipment', ecosystem: 'Business' },
  b2bAssetHub: { name: 'B2B Asset Financing - Partner Hub', label: 'Financing built into the partner’s checkout', ecosystem: 'Business' },
  instalmentHub: { name: 'Instalment Loan - Partner Hub', label: 'Instalments if you buy the product out', ecosystem: 'General integrations' },
  m2m: { name: 'Machine-to-machine payment solutions', label: 'Pay per use (the device settles payment itself)', ecosystem: 'Business' },
  homeInsurance: { name: 'Home insurance', label: 'Home insurance', ecosystem: 'Housing' },
  officeInsurance: { name: 'Office and building insurance', label: 'Office and building insurance', ecosystem: 'Business protection' },
  bicycleInsurance: { name: 'Bicycle insurance', label: 'Bicycle insurance', ecosystem: 'Mobility' },
  familyInsurance: { name: 'Family insurance', label: 'Family liability insurance', ecosystem: 'Family and protection' },
  onlineFraud: { name: 'Online fraud insurance', label: 'Online fraud insurance', ecosystem: 'Security' },
  kateCoins: { name: 'Kate Coins', label: 'Kate Coins for repairing and returning', ecosystem: 'Shopping and everyday services' },
  joyn: { name: 'Joyn loyalty points', label: 'Joyn points at partners', ecosystem: 'Shopping and everyday services' },
  ecoWise: { name: 'ecoWise', label: 'Your impact in ecoWise', ecosystem: 'Energy and sustainability' },
  kubeEsg: { name: 'Kube ESG', label: 'ESG reporting for your business', ecosystem: 'Energy and sustainability' },
  savingTips: { name: 'Energy consumption and saving tips', label: 'Energy use and saving tips', ecosystem: 'Energy and sustainability' },
  partnerHub: { name: 'KBC Partner Hub', label: 'Partners connect via the Partner Hub', ecosystem: 'Digital platforms and assistance' },
  devPortal: { name: 'KBC Developer Portal', label: 'APIs for partners', ecosystem: 'Digital platforms and assistance' },
  webhooks: { name: 'Application status webhooks', label: 'Live repair status', ecosystem: 'General integrations' },
  energyLoan: { name: 'Energy loan', label: 'Energy loan', ecosystem: 'Energy and sustainability' },
  solarQuote: { name: 'Calculate solar panels and request a quote', label: 'Calculate solar panels', ecosystem: 'Energy and sustainability' },
  batteryQuote: { name: 'Calculate a home battery and request a quote', label: 'Calculate a home battery', ecosystem: 'Energy and sustainability' },
  myHome: { name: 'MyHome', label: 'MyHome', ecosystem: 'Housing' },
  myMobility: { name: 'MyMobility', label: 'MyMobility', ecosystem: 'Mobility' },
  bikeLoan: { name: 'Bicycle, scooter or motorcycle loan', label: 'Bicycle loan (to buy it out)', ecosystem: 'Mobility' },
  businessDashboard: { name: 'KBC Business Dashboard', label: 'KBC Business Dashboard', ecosystem: 'Digital platforms and assistance' },
}

// KBC Loop step by step: which existing services are used.
export const loopSteps = [
  { step: 'Spot the signal', services: ['kateInsights', 'psd2', 'homeLoan', 'businessCo2'] },
  { step: 'Show the offer', services: ['kate', 'kbcMobile', 'businessApp'] },
  { step: 'Finance', services: ['b2bAsset', 'b2bAssetHub', 'instalmentHub'] },
  { step: 'Pay per use', services: ['m2m'] },
  { step: 'Insure', services: ['homeInsurance', 'officeInsurance', 'bicycleInsurance', 'onlineFraud'] },
  { step: 'Reward', services: ['kateCoins', 'joyn'] },
  { step: 'Measure impact', services: ['ecoWise', 'kubeEsg', 'savingTips'] },
  { step: 'Connect partners', services: ['partnerHub', 'devPortal', 'webhooks'] },
]

// Related KBC services per Loop category (cross-sell on the category page).
export const categoryServices = {
  energie: ['energyLoan', 'solarQuote', 'batteryQuote', 'savingTips'],
  toestellen: ['homeInsurance', 'myHome'],
  elektronica: ['onlineFraud', 'familyInsurance'],
  mobiliteit: ['myMobility', 'bicycleInsurance', 'bikeLoan'],
  gezin: ['familyInsurance'],
  zaak: ['businessDashboard', 'officeInsurance', 'kubeEsg'],
}
