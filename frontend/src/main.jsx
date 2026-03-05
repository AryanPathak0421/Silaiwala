import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { AuthProvider as TailorAuthProvider } from './modules/tailor/context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TailorAuthProvider>
      <App />
    </TailorAuthProvider>
  </StrictMode>,
)
