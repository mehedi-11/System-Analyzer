import { contextBridge, ipcRenderer } from 'electron';
import type { DeviceAnalyzerApi, AppTheme } from '@device-analyzer/shared';

const api: DeviceAnalyzerApi = {
  getAppVersion: () => ipcRenderer.invoke('analyzer:get-app-version'),
  getAdminStatus: () => ipcRenderer.invoke('analyzer:get-admin-status'),
  getDbStatus: () => ipcRenderer.invoke('analyzer:get-db-status'),
  getOsInfo: () => ipcRenderer.invoke('analyzer:get-os-info'),
  getTheme: () => ipcRenderer.invoke('analyzer:get-theme'),
  setTheme: (theme: AppTheme) => ipcRenderer.invoke('analyzer:set-theme', theme),
  minimizeWindow: () => ipcRenderer.invoke('analyzer:minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('analyzer:maximize-window'),
  closeWindow: () => ipcRenderer.invoke('analyzer:close-window')
};

// Safely expose strictly typed API under context isolation
contextBridge.exposeInMainWorld('deviceAnalyzer', api);
