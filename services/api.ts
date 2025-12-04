// API Service Layer
// Base URL is configurable via environment variable

const getBaseUrl = (): string => {
  // Check for environment variable, fallback to localhost
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
};

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.detail || `API Error: ${response.statusText}`,
      errorData
    );
  }

  return response.json();
}

// Custom API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============ Connection API ============
export interface ConnectionRequest {
  vm_ip: string;
  admin_password: string;
  use_https?: boolean;
}

export interface ConnectionResponse {
  connection_id: string;
  message?: string;
}

export const connectionApi = {
  connect: (data: ConnectionRequest): Promise<ConnectionResponse> =>
    fetchApi('/api/connect', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============ Tenants API ============
export interface TenantCreateRequest {
  name: string;
  url: string;
  token: string;
}

export interface Tenant {
  id: string;
  name: string;
  url: string;
  token?: string;
}

export const tenantsApi = {
  getAll: (connectionId: string): Promise<Tenant[]> =>
    fetchApi(`/api/tenants/${connectionId}`),
  
  create: (connectionId: string, data: TenantCreateRequest): Promise<Tenant> =>
    fetchApi(`/api/tenants/${connectionId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============ Plugin Configuration API ============
export interface PluginConfigRequest {
  name: string;
  plugin_data: Record<string, any>;
  tenant?: string | null;
}

export interface PluginConfigResponse {
  success: boolean;
  message?: string;
}

export const pluginsApi = {
  configure: (connectionId: string, data: PluginConfigRequest): Promise<PluginConfigResponse> =>
    fetchApi(`/api/plugins/${connectionId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Module-specific endpoints
  configureCls: (data: Record<string, any>): Promise<any> =>
    fetchApi('/api/cls/configurations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  configureCto: (data: Record<string, any>): Promise<any> =>
    fetchApi('/api/cto/configurations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  configureCte: (data: Record<string, any>): Promise<any> =>
    fetchApi('/api/cte/configurations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  configureCre: (data: Record<string, any>): Promise<any> =>
    fetchApi('/api/cre/configurations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  configureEdm: (data: Record<string, any>): Promise<any> =>
    fetchApi('/api/edm/configurations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  configureCfc: (data: Record<string, any>): Promise<any> =>
    fetchApi('/api/cfc/configurations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============ Templates API ============
// Individual plugin template as stored in the backend
export interface PluginTemplateData {
  icon?: string;
  description: string;
  color?: string;
  template: Record<string, any>;
}

// Plugin template with name (for frontend use)
export interface PluginTemplate {
  plugin_name: string;
  icon?: string;
  description: string;
  color?: string;
  template: Record<string, any>;
}

export interface PluginTemplateRequest {
  module: string;
  plugin_name: string;
  icon?: string;
  description: string;
  color?: string;
  template: Record<string, any>;
}

// Actual API response format from GET /api/templates
export interface TemplatesResponse {
  plugin_templates: Record<string, Record<string, PluginTemplateData>>;
  credential_templates: Record<string, any>;
}

export const templatesApi = {
  getAll: (): Promise<TemplatesResponse> =>
    fetchApi('/api/templates'),
  
  addPlugin: (data: PluginTemplateRequest): Promise<any> =>
    fetchApi('/api/templates/plugins', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updatePlugin: (module: string, pluginName: string, data: PluginTemplateRequest): Promise<any> =>
    fetchApi(`/api/templates/plugins/${module}/${encodeURIComponent(pluginName)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deletePlugin: (module: string, pluginName: string): Promise<any> =>
    fetchApi(`/api/templates/plugins/${module}/${encodeURIComponent(pluginName)}`, {
      method: 'DELETE',
    }),
};

// ============ Credentials API ============
export interface CredentialTemplate {
  credentials: Record<string, any>;
}

export interface CredentialTemplateRequest {
  credential_key: string;
  credentials: Record<string, any>;
}

// Actual response from GET /api/credentials
export interface CredentialsResponse {
  plugin_credentials: Record<string, Record<string, any>>;
  metadata?: Record<string, any>;
}

export const credentialsApi = {
  getAll: (): Promise<CredentialsResponse> =>
    fetchApi('/api/credentials'),
  
  add: (data: CredentialTemplateRequest): Promise<any> =>
    fetchApi('/api/credentials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (credentialKey: string, data: CredentialTemplateRequest): Promise<any> =>
    fetchApi(`/api/credentials/${encodeURIComponent(credentialKey)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (credentialKey: string): Promise<any> =>
    fetchApi(`/api/credentials/${encodeURIComponent(credentialKey)}`, {
      method: 'DELETE',
    }),
};

// ============ Tenant Templates API ============
export interface TenantTemplate {
  name: string;
  url: string;
  token: string;
  description?: string;
}

export interface TenantTemplateRequest {
  tenant_key: string;
  name: string;
  url: string;
  token: string;
  description?: string;
}

// Actual response from GET /api/tenant-templates
export interface TenantTemplatesResponse {
  tenants: Record<string, TenantTemplate>;
  metadata?: Record<string, any>;
}

export const tenantTemplatesApi = {
  getAll: (): Promise<TenantTemplatesResponse> =>
    fetchApi('/api/tenant-templates'),
  
  add: (data: TenantTemplateRequest): Promise<any> =>
    fetchApi('/api/tenant-templates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (tenantKey: string, data: TenantTemplateRequest): Promise<any> =>
    fetchApi(`/api/tenant-templates/${encodeURIComponent(tenantKey)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (tenantKey: string): Promise<any> =>
    fetchApi(`/api/tenant-templates/${encodeURIComponent(tenantKey)}`, {
      method: 'DELETE',
    }),
};

// ============ Dashboard API ============
export const dashboardApi = {
  getData: (connectionId: string): Promise<any> =>
    fetchApi(`/api/dashboard/${connectionId}`),
};
