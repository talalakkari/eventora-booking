import { useState, useEffect } from "react"
import { useAuth } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, AlertTriangle } from "lucide-react"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

interface Registration {
  id: string
  eventId: string
  firstName: string
  lastName: string
  attending: "Yes" | "No"
  email?: string
  phone?: string
  createdAt: string
}

function CreateEventForm({ onSubmit, getToken, editingEvent, onCancel }: {
  onSubmit: (data: Omit<Event, 'id' | 'createdAt'>) => void,
  getToken: () => Promise<string | null>,
  editingEvent?: Event | null,
  onCancel?: () => void
}) {
  const [formData, setFormData] = useState(() => ({
    title: editingEvent?.title || '',
    description: editingEvent?.description || '',
    startDate: editingEvent?.startDate || '',
    endDate: editingEvent?.endDate || '',
    startTime: editingEvent?.startTime || '',
    endTime: editingEvent?.endTime || '',
    location: editingEvent?.location || '',
    published: editingEvent?.published || false,
    imageUrl: editingEvent?.imageUrl || '',
    status: editingEvent?.status || undefined,
  }))
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Update form data when editing event changes
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || '',
        description: editingEvent.description || '',
        startDate: editingEvent.startDate || '',
        endDate: editingEvent.endDate || '',
        startTime: editingEvent.startTime || '',
        endTime: editingEvent.endTime || '',
        location: editingEvent.location || '',
        published: editingEvent.published || false,
        imageUrl: editingEvent.imageUrl || '',
        status: editingEvent.status || undefined,
      })
      setPreviewUrl(null) // Clear any existing preview
    }
  }, [editingEvent])

  const handleImageUpload = async (file: File) => {
    if (file.size > 1024 * 1024) {
      setUploadStatus('error')
      return
    }

    // Create immediate preview using File object
    const previewUrl = URL.createObjectURL(file)
    setPreviewUrl(previewUrl)

    setUploading(true)
    setUploadStatus('uploading')
    const formDataUpload = new FormData()
    formDataUpload.append('image', file)

    try {
      const token = await getToken()
      if (!token) {
        setUploadStatus('error')
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        return
      }

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json() as { url: string }
        setFormData({ ...formData, imageUrl: data.url })
        setUploadStatus('success')
        // Clean up the preview URL since we now have the real URL
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      } else {
        setUploadStatus('error')
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('error')
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="space-y-8">
      {/* Form */}
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Event Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <RichTextEditor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Enter event description..."
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date *</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time *</label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>
          <Input
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Hero Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleImageUpload(file)
                }
              }}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {uploadStatus === 'uploading' && <p className="text-sm text-blue-600 mt-1">Uploading image...</p>}
            {uploadStatus === 'success' && <p className="text-sm text-green-600 mt-1">Image uploaded successfully</p>}
            {uploadStatus === 'error' && <p className="text-sm text-red-600 mt-1">Upload failed. Please try again.</p>}
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            />
            Published
          </label>
          <div className="flex gap-4">
            <Button type="submit">{editingEvent ? 'Update Event' : 'Create Event'}</Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Live Preview */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
        <div className="border rounded-lg overflow-hidden bg-muted/50">
          {/* Hero Image Section */}
          {(formData.imageUrl || previewUrl) ? (
            <div className="relative h-48 overflow-hidden">
              <img
                src={previewUrl || formData.imageUrl}
                alt="Event preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          ) : (
            <div className="h-48 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image uploaded</span>
            </div>
          )}

          {/* Content Section */}
          <div className="p-6 space-y-4">
            {/* Title */}
            <div className="border-b pb-2">
              <h4 className="text-2xl font-display font-bold text-card-foreground">
                {formData.title || 'Event Title'}
              </h4>
            </div>

            {/* Description */}
            <div className="border-b pb-2">
              <div
                className="text-muted-foreground prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: formData.description || 'Event description'
                }}
              />
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <p><strong>Start Date:</strong> {formData.startDate || 'Not set'}</p>
              {formData.endDate && formData.endDate !== formData.startDate && (
                <p><strong>End Date:</strong> {formData.endDate}</p>
              )}
              <p><strong>Start Time:</strong> {formData.startTime || 'Not set'}</p>
              {formData.endTime && formData.endTime !== formData.startTime && (
                <p><strong>End Time:</strong> {formData.endTime}</p>
              )}
              <p><strong>Location:</strong> {formData.location || 'Not set'}</p>
              <p><strong>Status:</strong> {formData.published ? 'Published' : 'Draft'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminDashboard() {
  const { getToken } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [currentEvents, setCurrentEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "Yes" | "No">("all")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)
  const [deleteAllMode, setDeleteAllMode] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await getToken()
        const response = await fetch('/api/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json() as Event[]
          setEvents(data)

          // Separate current and past events based on status set by API
          const current = data.filter(event => event.status === 'active')
          const past = data.filter(event => event.status === 'past')

          setCurrentEvents(current)
          setPastEvents(past)
        } else {
          console.error('Failed to fetch events')
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }
    fetchEvents()
  }, [getToken])

  useEffect(() => {
    if (selectedEvent) {
      const fetchRegistrations = async () => {
        try {
          const token = await getToken()
          const response = await fetch(`/api/registrations?eventId=${selectedEvent.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            const data = await response.json()
            setRegistrations(data as Registration[])
            setFilteredRegistrations(data as Registration[])
          } else {
            console.error('Failed to fetch registrations')
          }
        } catch (error) {
          console.error('Error fetching registrations:', error)
        }
      }
      fetchRegistrations()
    }
  }, [getToken, selectedEvent])

  useEffect(() => {
    let filtered = registrations

    if (search) {
      filtered = filtered.filter(reg =>
        reg.firstName.toLowerCase().includes(search.toLowerCase()) ||
        reg.lastName.toLowerCase().includes(search.toLowerCase()) ||
        reg.email?.toLowerCase().includes(search.toLowerCase()) ||
        reg.phone?.includes(search)
      )
    }

    if (filter !== "all") {
      filtered = filtered.filter(reg => reg.attending === filter)
    }

    setFilteredRegistrations(filtered)
  }, [registrations, search, filter])

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
  }

  const handleBackToEvents = () => {
    setSelectedEvent(null)
    setRegistrations([])
    setFilteredRegistrations([])
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setShowCreateForm(true)
  }

  const handleCancelEdit = () => {
    setEditingEvent(null)
    setShowCreateForm(false)
  }

  const handleUpdateEvent = async (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    if (!editingEvent) return

    try {
      const token = await getToken()
      const response = await fetch(`/api/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      })

      if (response.ok) {
        // Refresh events
        const eventsResponse = await fetch('/api/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (eventsResponse.ok) {
          const data = await eventsResponse.json() as Event[]
          setEvents(data)

          // Update current/past events based on status set by API
          const current = data.filter(event => event.status === 'active')
          const past = data.filter(event => event.status === 'past')
          setCurrentEvents(current)
          setPastEvents(past)
        }
        setEditingEvent(null)
        setShowCreateForm(false)
      } else {
        console.error('Failed to update event')
      }
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    try {
      const token = await getToken()
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      })
      if (response.ok) {
        // Refresh events
        const eventsResponse = await fetch('/api/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (eventsResponse.ok) {
          const data = await eventsResponse.json() as Event[]
          setEvents(data)
          // Update current/past events based on status set by API
          const current = data.filter(event => event.status === 'active')
          const past = data.filter(event => event.status === 'past')
          setCurrentEvents(current)
          setPastEvents(past)
        }
        setShowCreateForm(false)
      } else {
        console.error('Failed to create event')
      }
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  const handleDeleteEvent = (eventId: string) => {
    setEventToDelete(eventId)
    setDeleteAllMode(false)
    setShowDeleteDialog(true)
  }

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return

    setIsDeleting(true)
    setDeleteError(null)

    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Authentication failed')
      }

      const response = await fetch(`/api/events/${eventToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as any
        throw new Error(errorData.error || `Delete failed with status ${response.status}`)
      }

      // Refresh events
      const eventsResponse = await fetch('/api/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!eventsResponse.ok) {
        throw new Error('Failed to refresh events list')
      }

      const data = await eventsResponse.json() as Event[]
      setEvents(data)
      // Update current/past events based on status set by API
      const current = data.filter(event => event.status === 'active')
      const past = data.filter(event => event.status === 'past')
      setCurrentEvents(current)
      setPastEvents(past)

    } catch (error) {
      console.error('Error deleting event:', error)
      setDeleteError(error instanceof Error ? error.message : 'Unknown error occurred')
      return // Don't close dialog on error
    } finally {
      setIsDeleting(false)
    }

    // Only close dialog if successful
    if (!deleteError) {
      setShowDeleteDialog(false)
      setEventToDelete(null)
    }
  }

  const handleClearAllEvents = () => {
    setDeleteAllMode(true)
    setShowDeleteDialog(true)
  }

  const confirmClearAllEvents = async () => {
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Authentication failed')
      }

      // Get all events first
      const eventsResponse = await fetch('/api/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!eventsResponse.ok) {
        throw new Error('Failed to fetch events for deletion')
      }

      const events = await eventsResponse.json() as Event[]

      if (events.length === 0) {
        throw new Error('No events found to delete')
      }

      // Delete each event
      let deletedCount = 0
      for (const event of events) {
        const deleteResponse = await fetch(`/api/events/${event.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (deleteResponse.ok) {
          deletedCount++
        } else {
          console.warn(`Failed to delete event ${event.id}`)
        }
      }

      if (deletedCount === 0) {
        throw new Error('Failed to delete any events')
      }

      // Clear local state
      setEvents([])
      setCurrentEvents([])
      setPastEvents([])

    } catch (error) {
      console.error('Error clearing events:', error)
      setDeleteError(error instanceof Error ? error.message : 'Unknown error occurred')
      return // Don't close dialog on error
    } finally {
      setIsDeleting(false)
    }

    // Only close dialog if successful
    if (!deleteError) {
      setShowDeleteDialog(false)
      setDeleteAllMode(false)
    }
  }

  const exportToCSV = () => {
    const csv = [
      ["First Name", "Last Name", "Attending", "Email", "Phone", "Created At"],
      ...filteredRegistrations.map(reg => [
        reg.firstName,
        reg.lastName,
        reg.attending,
        reg.email || "",
        reg.phone || "",
        new Date(reg.createdAt).toLocaleDateString(),
      ])
    ]

    const csvContent = csv.map(row => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "registrations.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <Button onClick={handleBackToEvents} className="mb-4 hover:scale-105 transition-transform">Back to Events</Button>
            <h1 className="text-5xl font-display font-bold mb-8 animate-fade-in text-card-foreground">{selectedEvent.title}</h1>
            <div className="mb-8">
              <p><strong>Description:</strong> {selectedEvent.description}</p>
              <p><strong>Start Date:</strong> {selectedEvent.startDate}</p>
              {selectedEvent.endDate !== selectedEvent.startDate && (
                <p><strong>End Date:</strong> {selectedEvent.endDate}</p>
              )}
              <p><strong>Start Time:</strong> {selectedEvent.startTime}</p>
              {selectedEvent.endTime !== selectedEvent.startTime && (
                <p><strong>End Time:</strong> {selectedEvent.endTime}</p>
              )}
              <p><strong>Location:</strong> {selectedEvent.location}</p>
              <p><strong>Published:</strong> {selectedEvent.published ? 'Yes' : 'No'}</p>
            </div>

            <div className="flex gap-4 mb-6">
              <Input
                placeholder="Search by name, email, or phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
              <Select value={filter} onValueChange={(value: "all" | "Yes" | "No") => setFilter(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Attendees</SelectItem>
                  <SelectItem value="Yes">Attending</SelectItem>
                  <SelectItem value="No">Not Attending</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportToCSV}>Export CSV</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Attending</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell>{reg.id}</TableCell>
                    <TableCell>{reg.firstName}</TableCell>
                    <TableCell>{reg.lastName}</TableCell>
                    <TableCell>{reg.attending}</TableCell>
                    <TableCell>{reg.email || ""}</TableCell>
                    <TableCell>{reg.phone || ""}</TableCell>
                    <TableCell>{new Date(reg.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRegistrations.length === 0 && (
              <p className="text-center text-muted-foreground mt-8">No registrations found.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="glassmorphism rounded-3xl max-w-md mx-4">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                {deleteAllMode ? 'Delete All Events' : 'Delete Event'}
              </CardTitle>
              <CardDescription>
                {deleteAllMode
                  ? 'Are you sure you want to delete ALL events? This action cannot be undone and will remove all event data permanently.'
                  : 'Are you sure you want to delete this event? This action cannot be undone.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deleteError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{deleteError}</p>
                </div>
              )}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false)
                    setEventToDelete(null)
                    setDeleteAllMode(false)
                    setDeleteError(null)
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={deleteAllMode ? confirmClearAllEvents : confirmDeleteEvent}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    deleteAllMode ? 'Delete All' : 'Delete'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <h1 className="text-5xl font-display font-bold mb-8 animate-fade-in text-card-foreground">Admin Dashboard</h1>
          <div className="flex gap-4 mb-8">
            <Button onClick={() => setShowCreateForm(!showCreateForm)} className="hover:scale-105 transition-transform">
              {showCreateForm ? 'Cancel' : 'Create Event'}
            </Button>
            <Button
              variant="outline"
              onClick={handleClearAllEvents}
              className="hover:scale-105 transition-transform"
            >
              Clear All Events
            </Button>
          </div>

          {showCreateForm && (
            <Card className="mb-8 glassmorphism rounded-3xl">
              <CardHeader>
                <CardTitle className="font-display">{editingEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
              </CardHeader>
              <CardContent>
                <CreateEventForm
                  onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
                  getToken={getToken}
                  editingEvent={editingEvent}
                  onCancel={handleCancelEdit}
                />
              </CardContent>
            </Card>
          )}

          {/* Current Events */}
          {currentEvents.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold mb-4 text-card-foreground">Current Events</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentEvents.map((event) => (
                  <Card key={event.id} className="glassmorphism rounded-3xl hover:scale-105 transition-transform cursor-pointer" onClick={() => handleEventClick(event)}>
                    <CardContent className="p-6">
                      {event.imageUrl && (
                        <div className="relative h-32 mb-4 overflow-hidden rounded-lg">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          <div className="absolute bottom-2 left-2 text-white">
                            <h3 className="text-lg font-bold">{event.title}</h3>
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <div className="text-sm">
                          <p><strong>Date:</strong> {event.startDate}</p>
                          {event.endDate && event.endDate !== event.startDate && (
                            <p><strong>End Date:</strong> {event.endDate}</p>
                          )}
                          <p><strong>Time:</strong> {event.startTime}</p>
                          {event.endTime && event.endTime !== event.startTime && (
                            <p><strong>End Time:</strong> {event.endTime}</p>
                          )}
                          <p><strong>Location:</strong> {event.location}</p>
                          <p><strong>Status:</strong> {event.published ? 'Published' : 'Draft'}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleEditEvent(event); }}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold mb-4 text-card-foreground">Past Events</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="glassmorphism rounded-3xl hover:scale-105 transition-transform cursor-pointer opacity-75" onClick={() => handleEventClick(event)}>
                    <CardContent className="p-6">
                      {event.imageUrl && (
                        <div className="relative h-32 mb-4 overflow-hidden rounded-lg">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          <div className="absolute bottom-2 left-2 text-white">
                            <h3 className="text-lg font-bold">{event.title}</h3>
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <div className="text-sm">
                          <p><strong>Date:</strong> {event.startDate}</p>
                          {event.endDate && event.endDate !== event.startDate && (
                            <p><strong>End Date:</strong> {event.endDate}</p>
                          )}
                          <p><strong>Time:</strong> {event.startTime}</p>
                          {event.endTime && event.endTime !== event.startTime && (
                            <p><strong>End Time:</strong> {event.endTime}</p>
                          )}
                          <p><strong>Location:</strong> {event.location}</p>
                          <p><strong>Status:</strong> {event.published ? 'Published' : 'Draft'}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleEditEvent(event); }}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentEvents.length === 0 && pastEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No events found. Create your first event to get started.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}