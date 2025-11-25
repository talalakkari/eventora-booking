import { IndexedEntity } from './IndexedEntity';

export class RegistrationEntity extends IndexedEntity {
  eventId: string;
  firstName: string;
  lastName: string;
  attending: 'Yes' | 'No';
  email?: string;
  phone?: string;
  createdAt: Date;

  constructor(id: string, eventId: string, firstName: string, lastName: string, attending: 'Yes' | 'No', email?: string, phone?: string) {
    super(id);
    this.eventId = eventId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.attending = attending;
    this.email = email;
    this.phone = phone;
    this.createdAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      eventId: this.eventId,
      firstName: this.firstName,
      lastName: this.lastName,
      attending: this.attending,
      email: this.email,
      phone: this.phone,
      createdAt: this.createdAt.toISOString(),
    };
  }

  static fromJSON(data: any): RegistrationEntity {
    const entity = new RegistrationEntity(data.id, data.eventId, data.firstName, data.lastName, data.attending, data.email, data.phone);
    entity.createdAt = new Date(data.createdAt);
    return entity;
  }
}