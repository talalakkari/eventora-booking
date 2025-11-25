import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { RegistrationForm } from './RegistrationForm'
import { Breadcrumb } from './Breadcrumb'

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

export function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return

      try {
        const response = await fetch('/api/events')
        if (response.ok) {
          const events = await response.json() as Event[]
          const foundEvent = events.find(e => e.id === id)
          if (foundEvent) {
            setEvent(foundEvent)
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Return to Events</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Centered width */}
      {event.imageUrl && (
        <div className="relative h-40 md:h-64 lg:h-96 overflow-hidden bg-muted">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="relative h-full rounded-3xl overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb - Centered */}
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <Breadcrumb items={[{ label: event.title }]} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-8 max-w-6xl">
        {/* Event Details and Description in Same Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Description - 3/4 width */}
          <Card className="rounded-3xl glassmorphism lg:col-span-3">
            <CardContent className="p-6">
              <h1 className="text-4xl font-display font-bold text-card-foreground mb-4">
                {event.title}
              </h1>
              <div
                className="text-muted-foreground text-lg leading-relaxed prose prose-lg prose-p:my-4 prose-headings:my-4 max-w-none"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </CardContent>
          </Card>

          {/* Event Details - 1/4 width */}
          <Card className="rounded-3xl glassmorphism lg:col-span-1">
            <CardContent className="p-4">
              <h2 className="text-xl font-display font-semibold text-card-foreground mb-3">
                Event Details:
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-card-foreground block mb-1 text-sm">Start Date:</span>
                  <span className="text-muted-foreground text-sm">{event.startDate}</span>
                </div>
                {event.endDate !== event.startDate && (
                  <div>
                    <span className="font-medium text-card-foreground block mb-1 text-sm">End Date:</span>
                    <span className="text-muted-foreground text-sm">{event.endDate}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-card-foreground block mb-1 text-sm">Start Time:</span>
                  <span className="text-muted-foreground text-sm">{event.startTime}</span>
                </div>
                {event.endTime !== event.startTime && (
                  <div>
                    <span className="font-medium text-card-foreground block mb-1 text-sm">End Time:</span>
                    <span className="text-muted-foreground text-sm">{event.endTime}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-card-foreground block mb-1 text-sm">Location:</span>
                  <span className="text-muted-foreground text-sm">{event.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form - Centered and Wider */}
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-3xl glassmorphism">
            <CardContent className="p-6">
              <RegistrationForm eventId={event.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}