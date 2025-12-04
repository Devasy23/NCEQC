export type ModuleType = 'CLS' | 'CTO' | 'CTE' | 'CRE' | 'EDM' | 'CFC';

export interface Plugin {
  id: string;
  name: string;
  type: 'third-party' | 'netskope';
  description?: string;
  icon?: string;
  color?: string;
  template?: Record<string, any>;
}

export interface Template {
  id: string;
  name: string;
  module: ModuleType;
  config: Record<string, any>;
  description?: string;
  icon?: string;
  color?: string;
}

export interface Tenant {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  description?: string;
}

export interface Credential {
  id: string;
  name: string;
  type: string;
  value: string;
  credentials?: Record<string, any>;
}

export type ViewState = 'home' | 'templates' | 'tenants' | 'credentials';

// API Response types
export interface PluginTemplateData {
  module: string;
  plugin_name: string;
  icon?: string;
  description: string;
  color?: string;
  template: Record<string, any>;
}

export interface TenantTemplateData {
  tenant_key: string;
  name: string;
  url: string;
  token: string;
  description?: string;
}

export interface CredentialTemplateData {
  credential_key: string;
  credentials: Record<string, any>;
}
