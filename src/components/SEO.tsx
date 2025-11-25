import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  keywords?: string[]
  eventData?: {
    name: string
    description: string
    startDate: string
    endDate?: string
    location: string
    image?: string
  }
}

export function SEO({
  title = "TrueStride Events | Upcoming Experiences & Connections",
  description = "Join TrueStride for events fostering resilience and truth. No events now—subscribe for updates on upcoming gatherings that inspire personal growth.",
  image = "/og-image.jpg", // Default OG image
  url,
  type = "website",
  keywords = ["resilience events", "truth gatherings", "personal development", "TrueStride", "resilience", "truth", "progress"],
  eventData
}: SEOProps) {
  useEffect(() => {
    // Set basic meta tags
    document.title = title

    // Remove existing meta tags
    const existingMetaTags = document.querySelectorAll('meta[name], meta[property]')
    existingMetaTags.forEach(tag => tag.remove())

    // Create new meta tags
    const metaTags = [
      // Basic SEO
      { name: 'description', content: description },
      { name: 'keywords', content: keywords.join(', ') },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'TrueStride' },

      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url || window.location.href },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'TrueStride Events' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },

      // Additional
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#1e293b' },
    ]

    // Add meta tags to head
    metaTags.forEach(({ name, property, content }) => {
      const meta = document.createElement('meta')
      if (name) meta.setAttribute('name', name)
      if (property) meta.setAttribute('property', property)
      meta.setAttribute('content', content)
      document.head.appendChild(meta)
    })

    // Add canonical URL
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.remove()

    const canonicalLink = document.createElement('link')
    canonicalLink.rel = 'canonical'
    canonicalLink.href = url || window.location.href
    document.head.appendChild(canonicalLink)

    // Add JSON-LD structured data for events
    if (eventData) {
      const existingJsonLd = document.querySelector('script[type="application/ld+json"]')
      if (existingJsonLd) existingJsonLd.remove()

      const jsonLdScript = document.createElement('script')
      jsonLdScript.type = 'application/ld+json'
      jsonLdScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Event",
        "name": eventData.name,
        "description": eventData.description,
        "startDate": eventData.startDate,
        "endDate": eventData.endDate,
        "location": {
          "@type": "Place",
          "name": eventData.location
        },
        "organizer": {
          "@type": "Person",
          "name": "TrueStride",
          "url": "https://truestrideresilience.com"
        },
        "image": eventData.image || image
      })
      document.head.appendChild(jsonLdScript)
    }

    // Cleanup function
    return () => {
      // Clean up will happen automatically when component unmounts
    }
  }, [title, description, image, url, type, keywords, eventData])

  return null // This component doesn't render anything
}