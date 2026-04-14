import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { LanguageProvider } from './i18n/LanguageContext'
import './index.css'
import App from './App'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;
if (!publishableKey) throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey} proxyUrl="https://clerk.5queens.club">
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ClerkProvider>
  </StrictMode>
)
