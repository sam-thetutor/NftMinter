import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@nfid/identitykit/react/styles.css"
import { IdentityKitProvider } from "@nfid/identitykit/react"
import { InternetIdentity, NFIDW } from '@nfid/identitykit'



createRoot(document.getElementById('root')).render(
  <IdentityKitProvider signers={[NFIDW,InternetIdentity]}>
    <App />
  </IdentityKitProvider>
)
