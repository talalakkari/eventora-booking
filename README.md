# Eventora - Edge-Native Event Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

Live Demo: https://events.talalakkari.com

A modern, lightweight event registration and management platform built entirely on Cloudflare's edge network. Eventora combines a beautiful, responsive frontend with a serverless backend architecture for optimal performance and scalability.

## Features

### User Experience
- Responsive Design: Mobile-first approach with perfect scaling across all devices
- Glassmorphism UI: Modern design with backdrop blur effects and smooth animations
- Dark/Light Theme: Automatic theme switching with persistent user preferences
- Accessibility: WCAG-compliant with keyboard navigation and screen reader support

### Content Management
- Rich Text Editor: TipTap-powered editor with full formatting (bold, italic, lists, blockquotes)
- Image Uploads: Drag-and-drop image uploads with Cloudflare R2 storage
- SEO Optimization: Dynamic meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
- Event Metadata: Comprehensive event details with date/time/location management

### Security & Performance
- JWT Authentication: Clerk-powered secure admin access
- Rate Limiting: IP-based request throttling for abuse prevention
- Edge Computing: Global deployment with sub-500ms response times
- Input Validation: Client and server-side validation with Zod schemas

### Admin Dashboard
- Full CRUD Operations: Create, read, update, delete events with live preview
- Registration Tracking: View and filter attendee registrations with CSV export
- Search & Filtering: Advanced filtering options for efficient data management
- Publishing Workflow: Draft/published states for content management

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Cloudflare account
- Clerk account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eventora.git
   cd eventora
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Configure your environment variables:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. **Cloudflare Setup**
   - Install Wrangler CLI: `npm install -g wrangler`
   - Login to Cloudflare: `wrangler login`
   - Configure your Cloudflare account and R2 bucket

5. **Development**
   ```bash
   npm run dev
   ```

6. **Production Deployment**
   ```bash
   npm run deploy
   ```

## Architecture

### Frontend Layer
- React 18 with TypeScript for type-safe component development
- Vite for lightning-fast development and optimized production builds
- Tailwind CSS with Typography plugin for consistent rich text styling
- ShadCN/UI for accessible, customizable component library

### Backend Layer
- Cloudflare Workers for serverless, edge-native API execution
- Hono.js lightweight web framework optimized for Workers
- Durable Objects for transactional, consistent data storage
- IndexedEntity Pattern for efficient querying and data management

### Storage & Integrations
- Cloudflare R2 for high-performance image storage and CDN
- Clerk Authentication for secure user management and JWT verification
- Rate Limiting implemented at the edge for abuse prevention

## Usage

### Creating Events
1. Access the admin dashboard at `/registrations`
2. Authenticate with your Clerk account
3. Click "Create Event" to open the event form
4. Fill in event details and use the rich text editor for descriptions
5. Upload hero images via drag-and-drop
6. Set publishing status and save

### Managing Registrations
1. Navigate to an event's detail page from the admin dashboard
2. View attendee registrations in a sortable table
3. Use search and filtering to find specific registrations
4. Export data to CSV for external analysis

### Public Event Browsing
1. Visit the landing page to see featured events
2. Browse upcoming and past events in organized grids
3. Click any event to view details and register
4. Responsive design works perfectly on all devices

## API Reference

### Events Endpoints

#### GET `/api/events`
**Public endpoint** - Retrieve all published events
```json
[
  {
    "id": "uuid",
    "title": "Event Title",
    "description": "<p>Rich text description</p>",
    "startDate": "2025-01-15",
    "endDate": "2025-01-15",
    "startTime": "10:00",
    "endTime": "16:00",
    "location": "Event Venue",
    "published": true,
    "imageUrl": "https://...",
    "status": "active",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

#### POST `/api/events`
**Protected endpoint** - Create new event
```json
{
  "title": "Event Title",
  "description": "<p>Event description</p>",
  "startDate": "2025-01-15",
  "endDate": "2025-01-15",
  "startTime": "10:00",
  "endTime": "16:00",
  "location": "Event Venue",
  "published": false,
  "imageUrl": "https://..."
}
```

### Registrations Endpoints

#### POST `/api/registrations`
**Public endpoint** - Submit event registration
```json
{
  "eventId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "attending": "Yes",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

#### GET `/api/registrations?eventId=uuid`
**Protected endpoint** - Retrieve event registrations

### Images Endpoints

#### POST `/api/upload-image`
**Protected endpoint** - Upload image to R2 storage
- Content-Type: `multipart/form-data`
- Field: `image` (File, max 1MB)

#### GET `/api/images/:key`
**Public endpoint** - Serve image from R2 storage

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure responsive design works on all devices

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Cloudflare for the incredible edge computing platform
- Clerk for seamless authentication
- TipTap for the excellent rich text editor
- Tailwind CSS for the utility-first styling framework
- ShadCN/UI for the beautiful component library


---

**Built with modern web technologies and edge computing principles.**