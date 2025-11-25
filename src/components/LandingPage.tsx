import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NoEventsLanding } from "./NoEventsLanding"

interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: string
  published: boolean
  imageUrl?: string
  status?: string
  createdAt: string
}

export function LandingPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [currentEvents, setCurrentEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [heroEvent, setHeroEvent] = useState<Event | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (response.ok) {
          const data = await response.json() as Event[]
          setEvents(data)

          // Separate current and past events
          const current = data.filter(event => event.status === 'active')
          const past = data.filter(event => event.status === 'past')

          setCurrentEvents(current)
          setPastEvents(past)

          // Set hero event as the most recent current event
          if (current.length > 0) {
            const sortedCurrent = current.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            setHeroEvent(sortedCurrent[0])
          }
        } else {
          console.error('Failed to fetch events')
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }
    fetchEvents()
  }, [])

  // No events at all - show TrueStride branded landing page
  if (events.length === 0) {
    return <NoEventsLanding />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        {heroEvent && (
          <div className="py-8 md:py-10 lg:py-12">
            <Card className="glassmorphism rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                {heroEvent.imageUrl && (
                  <div className="relative h-40 md:h-64 lg:h-96">
                    <img
                      src={heroEvent.imageUrl}
                      alt={heroEvent.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                )}
                <div className="relative p-6 md:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Title and Description - Left Side */}
                    <div className="lg:col-span-2">
                      <h1 className="text-4xl md:text-6xl font-display font-bold text-card-foreground mb-4">
                        {heroEvent.title}
                      </h1>
                      <div
                        className="text-lg md:text-xl text-muted-foreground mb-6 prose prose-xl prose-p:my-4 prose-headings:my-4 max-w-none"
                        dangerouslySetInnerHTML={{ __html: heroEvent.description }}
                      />
                      <Link
                        to={`/event/${heroEvent.id}`}
                        className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-3xl font-medium hover:scale-105 transition-transform"
                      >
                        Register Now
                      </Link>
                    </div>

                    {/* Event Details - Right Side */}
                    <div className="lg:col-span-1">
                      <Card className="glassmorphism rounded-2xl">
                        <CardContent className="p-4">
                          <h3 className="text-lg font-display font-semibold text-card-foreground mb-3">
                            Event Details
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-card-foreground">Start Date:</span>
                              <div className="text-muted-foreground">{heroEvent.startDate}</div>
                            </div>
                            {heroEvent.endDate !== heroEvent.startDate && (
                              <div>
                                <span className="font-medium text-card-foreground">End Date:</span>
                                <div className="text-muted-foreground">{heroEvent.endDate}</div>
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-card-foreground">Start Time:</span>
                              <div className="text-muted-foreground">{heroEvent.startTime}</div>
                            </div>
                            {heroEvent.endTime !== heroEvent.startTime && (
                              <div>
                                <span className="font-medium text-card-foreground">End Time:</span>
                                <div className="text-muted-foreground">{heroEvent.endTime}</div>
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-card-foreground">Location:</span>
                              <div className="text-muted-foreground">{heroEvent.location}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Events Grid */}
        {currentEvents.length > (heroEvent ? 1 : 0) && (
          <div className="py-8">
            <h2 className="text-3xl font-display font-bold text-card-foreground mb-8 text-center">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents
                .filter(event => event.id !== heroEvent?.id)
                .map((event) => (
                  <Link key={event.id} to={`/event/${event.id}`}>
                    <Card className="cursor-pointer glassmorphism rounded-3xl hover:scale-105 hover:shadow-xl transition-all duration-300 h-full">
                      {event.imageUrl && (
                        <div className="h-48 overflow-hidden rounded-t-3xl">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="font-display line-clamp-2">{event.title}</CardTitle>
                        <CardDescription className="line-clamp-3">{event.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Date:</strong> {event.startDate}</p>
                          <p><strong>Location:</strong> {event.location}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <div className="py-8">
            <h2 className="text-3xl font-display font-bold text-card-foreground mb-8 text-center">
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pastEvents.map((event) => (
                <Link key={event.id} to={`/event/${event.id}`}>
                  <Card className="cursor-pointer glassmorphism rounded-3xl hover:scale-105 transition-all duration-300">
                    {event.imageUrl ? (
                      <div className="h-32 overflow-hidden rounded-t-3xl">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-32 bg-muted rounded-t-3xl flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-display font-medium text-sm line-clamp-2 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {event.startDate}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}