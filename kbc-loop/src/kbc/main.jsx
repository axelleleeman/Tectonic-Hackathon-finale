import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './kbc.css'
import InsightsApp from './InsightsApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InsightsApp />
  </StrictMode>,
)
