import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { verifyToken } from '@clerk/backend'

type Bindings = {
  REGISTRATIONS_DO: DurableObjectNamespace
  EVENTS_DO: DurableObjectNamespace
  EVENT_IMAGES: R2Bucket
  CLERK_SECRET_KEY: string
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

app.post('/api/registrations', async (c) => {
  // Get DO instance
  const id = c.env.REGISTRATIONS_DO.idFromName('global')
  const stub = c.env.REGISTRATIONS_DO.get(id)

  const response = await stub.fetch(c.req.raw)
  return response
})

app.get('/api/registrations', async (c) => {
  // Verify JWT
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.substring(7)
  try {
    await verifyToken(token, { secretKey: c.env.CLERK_SECRET_KEY })
  } catch {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const id = c.env.REGISTRATIONS_DO.idFromName('global')
  const stub = c.env.REGISTRATIONS_DO.get(id)

  const response = await stub.fetch(c.req.raw)
  return response
})

app.post('/api/events', async (c) => {
  // Verify JWT for admin
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.substring(7)
  try {
    await verifyToken(token, { secretKey: c.env.CLERK_SECRET_KEY })
  } catch {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const id = c.env.EVENTS_DO.idFromName('global')
  const stub = c.env.EVENTS_DO.get(id)

  const response = await stub.fetch(c.req.raw)
  return response
})

app.put('/api/events/:id', async (c) => {
  // Verify JWT for admin
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.substring(7)
  try {
    await verifyToken(token, { secretKey: c.env.CLERK_SECRET_KEY })
  } catch {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const eventId = c.req.param('id')
  const url = new URL(c.req.url)
  url.pathname = `/api/events/${eventId}`

  const request = new Request(url.toString(), {
    method: c.req.method,
    headers: c.req.raw.headers,
    body: c.req.raw.body,
  })

  const id = c.env.EVENTS_DO.idFromName('global')
  const stub = c.env.EVENTS_DO.get(id)

  const response = await stub.fetch(request)
  return response
})

app.delete('/api/events/:id', async (c) => {
  // Verify JWT for admin
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.substring(7)
  try {
    await verifyToken(token, { secretKey: c.env.CLERK_SECRET_KEY })
  } catch {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const eventId = c.req.param('id')
  const url = new URL(c.req.url)
  url.pathname = `/api/events/${eventId}`

  const request = new Request(url.toString(), {
    method: c.req.method,
    headers: c.req.raw.headers,
    body: c.req.raw.body,
  })

  const id = c.env.EVENTS_DO.idFromName('global')
  const stub = c.env.EVENTS_DO.get(id)

  const response = await stub.fetch(request)
  return response
})

app.get('/api/events', async (c) => {
  // Check if this is an admin request (has auth header)
  const authHeader = c.req.header('Authorization')
  const isAdmin = authHeader && authHeader.startsWith('Bearer ')

  const url = new URL(c.req.url)
  if (isAdmin) {
    url.searchParams.set('admin', 'true')
  }

  const id = c.env.EVENTS_DO.idFromName('global')
  const stub = c.env.EVENTS_DO.get(id)

  const request = new Request(url.toString(), {
    method: c.req.method,
    headers: c.req.raw.headers,
    body: c.req.raw.body,
  })

  const response = await stub.fetch(request)
  return response
})

app.post('/api/upload-image', async (c) => {
  // Verify JWT for admin
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.substring(7)
  try {
    await verifyToken(token, { secretKey: c.env.CLERK_SECRET_KEY })
  } catch {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const formData = await c.req.formData()
  const file = formData.get('image') as File

  if (!file) {
    return c.json({ error: 'No image file provided' }, 400)
  }

  // Check file size (1MB limit)
  if (file.size > 1024 * 1024) {
    return c.json({ error: 'File size must be less than 1MB' }, 400)
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    return c.json({ error: 'File must be an image' }, 400)
  }

  // Generate unique filename
  const fileExtension = file.name.split('.').pop()
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`

  try {
    // Upload to R2
    await c.env.EVENT_IMAGES.put(uniqueName, file, {
      httpMetadata: {
        contentType: file.type,
      },
    })

    // Return the public URL using our image serving endpoint
    const publicUrl = `${new URL(c.req.url).origin}/api/images/${uniqueName}`
    return c.json({ url: publicUrl, key: uniqueName })
  } catch (error) {
    console.error('Upload error:', error)
    return c.json({ error: 'Upload failed' }, 500)
  }
})

app.get('/api/images/:key', async (c) => {
  const key = c.req.param('key')

  if (!key) {
    return c.json({ error: 'Image key required' }, 400)
  }

  try {
    // Get the image from R2
    const object = await c.env.EVENT_IMAGES.get(key)

    if (!object) {
      return c.json({ error: 'Image not found' }, 404)
    }

    // Return the image with proper headers
    const headers = new Headers()
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg')
    headers.set('Cache-Control', 'public, max-age=31536000') // Cache for 1 year
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Methods', 'GET')
    headers.set('Access-Control-Allow-Headers', '*')

    return new Response(object.body, {
      headers,
      status: 200,
    })
  } catch (error) {
    console.error('Image serving error:', error)
    return c.json({ error: 'Failed to serve image' }, 500)
  }
})

// Catch-all route to serve index.html for SPA
app.get('*', async (c) => {
  const url = new URL(c.req.url)
  if (url.pathname.startsWith('/api')) {
    return c.notFound()
  }
  const assetUrl = new URL(c.req.url)
  assetUrl.pathname = '/index.html'
  const response = await c.env.ASSETS.fetch(new Request(assetUrl))
  return response
})

export default app
export { RegistrationsDO } from '../lib/RegistrationsDO'
export { EventsDO } from '../lib/EventsDO'