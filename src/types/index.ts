export interface Partner {
  id: string;
  name: string;
  email: string;
  gitRepository: string;
  isActive: boolean;
  created_at: string;
}

export interface ExternalCompany {
  id: string;
  name: string;
  sector: string;
  active: boolean;
  created_at: string;
  numberOfEmployees?: number;
}

export interface User {
  username: string;
  keepConnected: boolean;
}
