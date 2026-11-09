/**
 * Shared Type Definitions for Device Analyzer
 * Cross-platform data schemas, collector contracts, and scoring types.
 */

export interface CollectorResult<T = unknown> {
  data: T | null;
  available: boolean;
  error?: string;
  requiresAdmin: boolean;
  timestamp: number;
  durationMs: number;
}

export interface OperatingSystemInfo {
  caption: string;
  version: string;
  buildNumber: string;
  architecture: string;
  installDate: string;
  lastBootUpTime: string;
  uptimeSeconds: number;
  serialNumber: string;
  registeredUser: string;
  organization: string;
  windowsDirectory: string;
  systemDirectory: string;
  totalVisibleMemoryMB: number;
  freePhysicalMemoryMB: number;
  status: string;
}

export interface AdminStatus {
  isAdmin: boolean;
  username: string;
  userDomain: string;
}

export interface DatabaseStatus {
  connected: boolean;
  filePath: string;
  currentVersion: number;
  tables: string[];
  appliedMigrations: number;
}

export type NavPage =
  | 'dashboard'
  | 'system-info'
  | 'performance'
  | 'hardware'
  | 'battery'
  | 'network'
  | 'health'
  | 'reports'
  | 'history'
  | 'settings';

export type AppTheme = 'dark' | 'light' | 'system';

export interface DeviceAnalyzerApi {
  getAppVersion: () => Promise<string>;
  getAdminStatus: () => Promise<AdminStatus>;
  getDbStatus: () => Promise<DatabaseStatus>;
  getOsInfo: () => Promise<CollectorResult<OperatingSystemInfo>>;
  getTheme: () => Promise<AppTheme>;
  setTheme: (theme: AppTheme) => Promise<boolean>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
}

