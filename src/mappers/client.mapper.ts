import { IClient } from '../interfaces/client.interface';
import { ClientDocument } from '../models/client.model';

export function toIClient(doc: ClientDocument): IClient {
  return {
    id: doc._id.toString(),
    companyName: doc.companyName,
    contactName: doc.contactName || undefined,
    email: doc.email,
    phone: doc.phone || undefined,
    status: doc.status || 'active',
    notes: doc.notes || undefined,
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date(),
  };
}
