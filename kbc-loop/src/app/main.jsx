import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import MobileApp from './MobileApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MobileApp />
  </StrictMode>,
)
