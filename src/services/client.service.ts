import { Types } from 'mongoose';
import { IClient, ICreateClient, IUpdateClient } from '../interfaces/client.interface';
import { toIClient } from '../mappers/client.mapper';
import { Api } from '../models/api.model';
import { Client, ClientDocument } from '../models/client.model';
import { Project } from '../models/project.model';
import { User } from '../models/user.model';

export class ClientService {
  async listClients(): Promise<IClient[]> {
    const clients = await Client.find().sort({ createdAt: -1 });
    return clients.map((c) => toIClient(c as unknown as ClientDocument));
  }

  async getClient(id: string): Promise<IClient> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid client id');
    }

    const client = await Client.findById(id);
    if (!client) {
      throw new Error('Client not found');
    }

    return toIClient(client as unknown as ClientDocument);
  }

  async createClient(input: ICreateClient): Promise<IClient> {
    if (!input?.companyName?.trim() || !input?.email?.trim()) {
      throw new Error('Company name and email are required');
    }

    try {
      const newClient = await Client.create({
        ...input,
        companyName: input.companyName.trim(),
        contactName: input.contactName?.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone?.trim(),
        notes: input.notes?.trim(),
      });

      return toIClient(newClient as unknown as ClientDocument);
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: number }).code === 11000
      ) {
        throw new Error('A client with this email already exists');
      }
      throw error;
    }
  }

  async updateClient(id: string, input: IUpdateClient): Promise<IClient> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid client id');
    }

    const client = await Client.findById(id);
    if (!client) {
      throw new Error('Client not found');
    }

    if (input.companyName !== undefined) {
      if (!input.companyName.trim()) {
        throw new Error('Company name is required');
      }
      client.companyName = input.companyName.trim();
    }
    if (input.contactName !== undefined) {
      client.contactName = input.contactName.trim() || undefined;
    }
    if (input.email !== undefined) {
      if (!input.email.trim()) {
        throw new Error('Email is required');
      }
      client.email = input.email.trim().toLowerCase();
    }
    if (input.phone !== undefined) {
      client.phone = input.phone.trim() || undefined;
    }
    if (input.status !== undefined) {
      client.status = input.status;
    }
    if (input.notes !== undefined) {
      client.notes = input.notes.trim() || undefined;
    }

    try {
      await client.save();
      return toIClient(client as unknown as ClientDocument);
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: number }).code === 11000
      ) {
        throw new Error('A client with this email already exists');
      }
      throw error;
    }
  }

  async deleteClient(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid client id');
    }

    const client = await Client.findById(id);
    if (!client) {
      throw new Error('Client not found');
    }

    const clientObjectId = client._id;
    await Promise.all([
      User.deleteMany({ clientId: clientObjectId }),
      Api.deleteMany({ clientId: clientObjectId }),
      Project.deleteMany({ clientId: clientObjectId }),
    ]);
    await Client.findByIdAndDelete(id);
  }
}
