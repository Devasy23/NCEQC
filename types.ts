export type ModuleType = 'CLS' | 'CTO' | 'CTE' | 'CRE' | 'EDM' | 'CFC';

export interface Plugin {
  id: string;
  name: string;
  type: 'third-party' | 'netskope';
}

export interface Template {
  id: string;
  name: string;
  module: ModuleType;
  config: Record<string, any>;
}

export interface Tenant {
  id: string;
  name: string;
  url: string;
  apiKey: string;
}

export interface Credential {
  id: string;
  name: string;
  type: string;
  value: string;
}

export type ViewState = 'home' | 'templates' | 'tenants' | 'credentials';
