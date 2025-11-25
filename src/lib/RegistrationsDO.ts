import { RegistrationEntity } from './RegistrationEntity';

export class RegistrationsDO {
  state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    const ip = request.headers.get('X-IP') || 'unknown';

    if (request.method === 'POST' && url.pathname === '/api/registrations') {
      return this.handleCreateRegistration(request, ip);
    } else if (request.method === 'GET' && url.pathname === '/api/registrations') {
      return this.handleListRegistrations(request);
    }

    return new Response('Not Found', { status: 404 });
  }

  async handleCreateRegistration(request: Request, ip: string) {
    if (!await this.checkRateLimit(ip)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
    }

    const data = await request.json() as any;
    // basic validation
    if (!data.eventId || !data.firstName || !data.lastName || !data.attending) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const id = crypto.randomUUID();
    const entity = new RegistrationEntity(id, data.eventId, data.firstName, data.lastName, data.attending, data.email, data.phone);
    await this.state.storage.put(`registration:${id}`, entity.toJSON());

    // update index
    const index = (await this.state.storage.get('registration_index') as string[]) || [];
    index.push(id);
    await this.state.storage.put('registration_index', index);

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  }

  async handleListRegistrations(request: Request) {
    const url = new URL(request.url);
    const eventId = url.searchParams.get('eventId');

    const index = (await this.state.storage.get('registration_index') as string[]) || [];
    const registrations = [];
    for (const id of index) {
      const data = await this.state.storage.get(`registration:${id}`);
      if (data) {
        const reg = RegistrationEntity.fromJSON(data as any);
        if (!eventId || reg.eventId === eventId) {
          registrations.push(reg);
        }
      }
    }
    return new Response(JSON.stringify(registrations.map(r => r.toJSON())), { status: 200 });
  }

  async checkRateLimit(ip: string): Promise<boolean> {
    const key = `rate_limit:${ip}`;
    const now = Date.now();
    const window = 60 * 1000; // 1 minute
    const maxRequests = 5;
    const records = (await this.state.storage.get(key) as number[]) || [];
    const validRecords = records.filter((timestamp: number) => now - timestamp < window);
    if (validRecords.length >= maxRequests) {
      return false;
    }
    validRecords.push(now);
    await this.state.storage.put(key, validRecords);
    return true;
  }
}