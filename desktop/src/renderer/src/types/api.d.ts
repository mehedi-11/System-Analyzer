import type { DeviceAnalyzerApi } from '@device-analyzer/shared';

declare global {
  interface Window {
    deviceAnalyzer: DeviceAnalyzerApi;
  }
}

export {};
