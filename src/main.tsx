import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Application } from '@/app/Application'
import './index.css'

const spaRedirect = sessionStorage.getItem('balloon_spa_redirect')
if (spaRedirect) {
  sessionStorage.removeItem('balloon_spa_redirect')
  const current = location.href
  if (spaRedirect !== current) {
    const url = new URL(spaRedirect)
    history.replaceState(null, '', url.pathname + url.search + url.hash)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Application />
  </StrictMode>,
)
