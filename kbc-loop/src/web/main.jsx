import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './web.css'
import WebApp from './WebApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WebApp />
  </StrictMode>,
)
