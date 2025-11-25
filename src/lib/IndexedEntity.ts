export abstract class IndexedEntity {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  abstract toJSON(): any;

  static fromJSON(data: any): IndexedEntity {
    throw new Error('fromJSON must be implemented by subclass');
  }
}