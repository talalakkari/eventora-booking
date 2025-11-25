import { EventEntity } from './EventEntity';

export class EventsDO {
  state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/api/events') {
      return this.handleCreateEvent(request);
    } else if (request.method === 'PUT' && url.pathname.startsWith('/api/events/')) {
      return this.handleUpdateEvent(request, url.pathname.split('/').pop()!);
    } else if (request.method === 'DELETE' && url.pathname.startsWith('/api/events/')) {
      return this.handleDeleteEvent(request, url.pathname.split('/').pop()!);
    } else if (request.method === 'GET' && url.pathname === '/api/events') {
      return this.handleListEvents(request);
    }

    return new Response('Not Found', { status: 404 });
  }

  async handleCreateEvent(request: Request) {
    const data = await request.json() as any;
    // basic validation
    if (!data.title || !data.description || !data.location) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Ensure we have date/time - use new fields or fallback to old
    const startDate = data.startDate || data.date;
    const startTime = data.startTime || data.time;
    if (!startDate || !startTime) {
      return new Response(JSON.stringify({ error: 'Missing date/time fields' }), { status: 400 });
    }

    const id = crypto.randomUUID();
    const entity = new EventEntity(id, data.title, data.description, startDate, data.endDate || startDate, startTime, data.endTime || startTime, data.location, data.published || false, data.imageUrl, data.status);
    await this.state.storage.put(`event:${id}`, entity.toJSON());

    // update index
    const index = (await this.state.storage.get('event_index') as string[]) || [];
    index.push(id);
    await this.state.storage.put('event_index', index);

    return new Response(JSON.stringify({ success: true, id }), { status: 201 });
  }

  async handleUpdateEvent(request: Request, id: string) {
    const data = await request.json() as any;

    // Get existing event
    const existingData = await this.state.storage.get(`event:${id}`);
    if (!existingData) {
      return new Response(JSON.stringify({ error: 'Event not found' }), { status: 404 });
    }

    const existingEvent = EventEntity.fromJSON(existingData as any);

    // Update fields
    const updatedEvent = new EventEntity(
      id,
      data.title || existingEvent.title,
      data.description || existingEvent.description,
      data.startDate || existingEvent.startDate,
      data.endDate || existingEvent.endDate,
      data.startTime || existingEvent.startTime,
      data.endTime || existingEvent.endTime,
      data.location || existingEvent.location,
      data.published !== undefined ? data.published : existingEvent.published,
      data.imageUrl !== undefined ? data.imageUrl : existingEvent.imageUrl,
      data.status || existingEvent.status
    );

    await this.state.storage.put(`event:${id}`, updatedEvent.toJSON());

    return new Response(JSON.stringify({ success: true, id }), { status: 200 });
  }

  async handleDeleteEvent(request: Request, id: string) {
    // Check if event exists
    const existingData = await this.state.storage.get(`event:${id}`);
    if (!existingData) {
      return new Response(JSON.stringify({ error: 'Event not found' }), { status: 404 });
    }

    // Remove from storage
    await this.state.storage.delete(`event:${id}`);

    // Update index
    const index = (await this.state.storage.get('event_index') as string[]) || [];
    const updatedIndex = index.filter(eventId => eventId !== id);
    await this.state.storage.put('event_index', updatedIndex);

    return new Response(JSON.stringify({ success: true, id }), { status: 200 });
  }

  async handleListEvents(request: Request) {
    const url = new URL(request.url);
    const isAdmin = url.searchParams.get('admin') === 'true';

    const index = (await this.state.storage.get('event_index') as string[]) || [];
    const events = [];
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format

    for (const id of index) {
      const data = await this.state.storage.get(`event:${id}`);
      if (data) {
        const event = EventEntity.fromJSON(data as any);

        // Determine if event is past based on end date
        const isPastByDate = event.endDate < today;

        // Apply status logic
        let effectiveStatus = event.status;
        if (!effectiveStatus) {
          effectiveStatus = isPastByDate ? 'past' : 'active';
        }

        // Update the event with computed status
        event.status = effectiveStatus;

        // For public API, only show published events that are not archived
        if (!isAdmin) {
          if (!event.published || effectiveStatus === 'archived') {
            continue;
          }
        }

        events.push(event);
      }
    }

    // Sort events: active first, then past
    events.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      // Within same status, sort by start date
      return a.startDate.localeCompare(b.startDate);
    });

    return new Response(JSON.stringify(events.map(e => e.toJSON())), { status: 200 });
  }
}