// src/environments/environment.interface.ts
export interface Environment {
  production: boolean;
  apiUrl: string;
  appName: string;
  version: string;
  enableLogging: boolean;
  enableDebugMode: boolean;
  apiTimeout: number;
  retryAttempts: number;
  features: {
    enableNotifications: boolean;
    enableAnalytics: boolean;
    enableOfflineMode: boolean;
    enableRealTimeUpdates: boolean;
  };
  cache: {
    enableCaching: boolean;
    cacheTimeout: number;
  };
  ui: {
    theme: string;
    showDebugInfo: boolean;
    animationDuration: number;
  };
}
