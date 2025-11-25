import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/components/ThemeProvider'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="eventora-theme">
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignInUrl="/registrations">
        <App />
      </ClerkProvider>
    </ThemeProvider>
  </StrictMode>,
)