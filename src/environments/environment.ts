// src/environments/environment.ts
import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3001',
  appName: 'EndUser MenuMania',
  version: '1.0.0',
  enableLogging: true,
  enableDebugMode: true,
  apiTimeout: 30000, // 30 seconds
  retryAttempts: 3,
  features: {
    enableNotifications: true,
    enableAnalytics: false,
    enableOfflineMode: true,
    enableRealTimeUpdates: true,
  },
  cache: {
    enableCaching: true,
    cacheTimeout: 300000, // 5 minutes
  },
  ui: {
    theme: 'light',
    showDebugInfo: true,
    animationDuration: 300,
  },
};
