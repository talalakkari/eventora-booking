import { ArrowRight, Mail, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SEO } from './SEO'

export function NoEventsLanding() {
  return (
    <>
      <SEO
        title="TrueStride Events | Upcoming Experiences & Connections"
        description="Join TrueStride for events fostering resilience and truth. No events now—subscribe for updates on upcoming gatherings that inspire personal growth."
        keywords={["resilience events", "truth gatherings", "personal development", "TrueStride", "resilience", "truth", "progress"]}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e293b' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Poppins']">
                TrueStride Events
              </h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#about" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-['Inter']">
                  About
                </a>
                <a href="#contact" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-['Inter']">
                  Contact
                </a>
                <a href="#blog" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-['Inter']">
                  Blog
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 font-['Poppins'] leading-tight">
              TrueStride Events Hub
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto font-['Inter'] leading-relaxed">
              No events listed yet. Striding forward—new connections and experiences that inspire resilience and truth are on the horizon.
            </p>

            {/* Icon/Graphic */}
            <div className="mb-12 flex justify-center">
              <div className="relative">
                <ArrowRight
                  className="w-24 h-24 text-slate-400 dark:text-slate-500 transform hover:scale-110 transition-transform duration-300 cursor-pointer"
                  strokeWidth={1.5}
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center">
                  <span className="text-white dark:text-slate-900 text-xs font-bold">→</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-['Inter'] font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
                onClick={() => window.open('mailto:subscribe@truestrideresilience.com?subject=Subscribe to TrueStride Events', '_blank')}
              >
                <Mail className="w-4 h-4" />
                Subscribe for Updates
              </Button>
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-3 rounded-full font-['Inter'] font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
                onClick={() => window.open('https://truestrideresilience.com/blog', '_blank')}
              >
                <BookOpen className="w-4 h-4" />
                Explore My Blog
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-slate-600 dark:text-slate-300 text-xl">🌟</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 font-['Poppins']">
                    Resilience
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-['Inter']">
                    Building strength through shared experiences and authentic connections.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-slate-600 dark:text-slate-300 text-xl">🎯</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 font-['Poppins']">
                    Truth
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-['Inter']">
                    Honest conversations that foster genuine understanding and growth.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-slate-600 dark:text-slate-300 text-xl">🚀</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 font-['Poppins']">
                    Progress
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-['Inter']">
                    Moving forward together, one meaningful step at a time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
    </>
  )
}