import { IndexedEntity } from './IndexedEntity';

export class EventEntity extends IndexedEntity {
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string;
  published: boolean;
  imageUrl?: string;
  status?: 'active' | 'past' | 'archived';
  createdAt: Date;

  constructor(id: string, title: string, description: string, startDate: string, endDate: string, startTime: string, endTime: string, location: string, published: boolean = false, imageUrl?: string, status?: 'active' | 'past' | 'archived') {
    super(id);
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.location = location;
    this.published = published;
    this.imageUrl = imageUrl;
    this.status = status;
    this.createdAt = new Date();
  }

  // Backward compatibility: if old format data is passed
  static createFromLegacy(id: string, title: string, description: string, date: string, time: string, location: string, published: boolean = false, imageUrl?: string, status?: 'active' | 'past' | 'archived') {
    return new EventEntity(id, title, description, date, date, time, time, location, published, imageUrl, status);
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate,
      startTime: this.startTime,
      endTime: this.endTime,
      location: this.location,
      published: this.published,
      imageUrl: this.imageUrl,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
    };
  }

  static fromJSON(data: any): EventEntity {
    // Handle backward compatibility for old date/time format
    const startDate = data.startDate || data.date;
    const endDate = data.endDate || data.date;
    const startTime = data.startTime || data.time;
    const endTime = data.endTime || data.time;

    const entity = new EventEntity(data.id, data.title, data.description, startDate, endDate, startTime, endTime, data.location, data.published, data.imageUrl, data.status);
    entity.createdAt = new Date(data.createdAt);
    return entity;
  }
}