import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { LandingPage } from './components/LandingPage'
import { EventDetail } from './components/EventDetail'
import { AdminDashboard } from '@/components/AdminDashboard'
import { ThemeToggle } from './components/ThemeToggle'
import { Footer } from './components/Footer'

function App() {
  return (
    <Router>
      <div className="relative">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 w-full glassmorphism border-b">
          <div className="container mx-auto px-4 py-4 flex justify-end items-center gap-2">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <ThemeToggle />
          </div>
        </header>

        <Routes>
          <Route path="/" element={
            <>
              <LandingPage />
              <Footer />
            </>
          } />
          <Route path="/event/:id" element={
            <>
              <EventDetail />
              <Footer />
            </>
          } />
          <Route path="/registrations" element={
            <>
              <SignedOut>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
                    <p className="mb-4">Please sign in to access the admin dashboard.</p>
                    <SignInButton />
                  </div>
                </div>
              </SignedOut>
              <SignedIn>
                <AdminDashboard />
              </SignedIn>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App