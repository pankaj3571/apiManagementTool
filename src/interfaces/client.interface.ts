export type ClientStatus = 'active' | 'inactive';

export interface ICreateClient {
  companyName: string;
  contactName?: string;
  email: string;
  phone?: string;
  status?: ClientStatus;
  notes?: string;
}

export interface IUpdateClient {
  companyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  status?: ClientStatus;
  notes?: string;
}

export interface IClient {
  id: string;
  companyName: string;
  contactName?: string;
  email: string;
  phone?: string;
  status: ClientStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
