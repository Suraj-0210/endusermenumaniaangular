// src/environments/environment.prod.ts
import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://endusermenumania.onrender.com',
  appName: 'EndUser MenuMania',
  version: '1.0.0',
  enableLogging: false,
  enableDebugMode: false,
  apiTimeout: 60000, // 60 seconds for production
  retryAttempts: 5,
  features: {
    enableNotifications: true,
    enableAnalytics: true,
    enableOfflineMode: true,
    enableRealTimeUpdates: true,
  },
  cache: {
    enableCaching: true,
    cacheTimeout: 600000, // 10 minutes for production
  },
  ui: {
    theme: 'light',
    showDebugInfo: false,
    animationDuration: 200,
  },
};
