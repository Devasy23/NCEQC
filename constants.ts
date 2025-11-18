import { Credential, ModuleType, Plugin, Template, Tenant } from './types';

export const MODULES: ModuleType[] = ['CLS', 'CTO', 'CTE', 'CRE', 'EDM', 'CFC'];

export const SYSTEM_LOGS = [
  "SYSTEM STATUS: OPTIMAL", "NETSKOPE PROXY: CONNECTED", "THREAT INTEL: UPDATING...", 
  "USER: ADMIN_01", "MEMORY USAGE: 14%", "ENCRYPTION: AES-256", "LAST SYNC: 00:01:04",
  "NODE_ENV: PRODUCTION", "RENDER: REACT_DOM", "STYLE: CYBER_GLASS_BRUTALISM"
];

export const MOCK_PLUGINS: Record<ModuleType, Plugin[]> = {
  CLS: [
    { id: 'cls-1', name: 'Crowdstrike', type: 'third-party' },
    { id: 'cls-2', name: 'SentinelOne', type: 'third-party' },
    { id: 'cls-3', name: 'Netskope CLS', type: 'netskope' },
    { id: 'cls-4', name: 'Carbon Black', type: 'third-party' },
    { id: 'cls-5', name: 'Palo Alto', type: 'third-party' },
    { id: 'cls-6', name: 'McAfee', type: 'third-party' },
  ],
  CTO: [
    { id: 'cto-1', name: 'ServiceNow', type: 'third-party' },
    { id: 'cto-2', name: 'Netskope CTO', type: 'netskope' },
    { id: 'cto-3', name: 'Jira', type: 'third-party' },
    { id: 'cto-4', name: 'PagerDuty', type: 'third-party' },
  ],
  CTE: [
    { id: 'cte-1', name: 'Azure Sentinel', type: 'third-party' },
    { id: 'cte-2', name: 'Splunk SIEM', type: 'third-party' },
  ],
  CRE: [
    { id: 'cre-1', name: 'Splunk', type: 'third-party' },
    { id: 'cre-2', name: 'QRadar', type: 'third-party' },
  ],
  EDM: [
    { id: 'edm-1', name: 'Microsoft EDM', type: 'third-party' },
  ],
  CFC: [
    { id: 'cfc-1', name: 'Custom Function', type: 'third-party' },
  ],
};

export const MOCK_TEMPLATES: Template[] = [
  { id: 't1', name: 'Crowdstrike Template', module: 'CLS', config: { api_key: 'xxx', endpoint: 'https://api.crowdstrike.com' } },
  { id: 't2', name: 'ServiceNow Template', module: 'CTO', config: { instance: 'dev123', username: 'admin' } },
  { id: 't3', name: 'Azure Template', module: 'CTE', config: { workspace_id: 'ws-123' } },
  { id: 't4', name: 'SentinelOne Config', module: 'CLS', config: { console: 'https://console.sentinelone.net' } },
];

export const MOCK_TENANTS: Tenant[] = [
  { id: 'tn1', name: 'Production Tenant', url: 'https://prod.netskope.com', apiKey: 'prod-key-123' },
  { id: 'tn2', name: 'Staging Tenant', url: 'https://staging.netskope.com', apiKey: 'staging-key-456' },
  { id: 'tn3', name: 'Dev Tenant', url: 'https://dev.netskope.com', apiKey: 'dev-key-789' },
];

export const MOCK_CREDENTIALS: Credential[] = [
  { id: 'c1', name: 'AWS Credentials', type: 'API Key', value: 'AKIA...' },
  { id: 'c2', name: 'Azure Service Principal', type: 'Client Secret', value: 'client-secret-...' },
  { id: 'c3', name: 'GCP Service Account', type: 'JSON Key', value: '{...}' },
  { id: 'c4', name: 'Okta API Token', type: 'Bearer Token', value: 'token-...' },
];
