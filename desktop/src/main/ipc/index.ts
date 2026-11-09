import { ipcMain, BrowserWindow } from 'electron';
import { checkAdminPrivileges } from '../utils/admin';
import { getDatabaseStatus, getDatabase } from '../db/database';
import { OperatingSystemCollector } from '../collectors/os';
import type { AppTheme } from '@device-analyzer/shared';

const osCollector = new OperatingSystemCollector();

export function registerIpcHandlers(): void {
  // Application version
  ipcMain.handle('analyzer:get-app-version', () => {
    return '1.0.0';
  });

  // Admin status
  ipcMain.handle('analyzer:get-admin-status', async () => {
    return await checkAdminPrivileges();
  });

  // Database status & migrations
  ipcMain.handle('analyzer:get-db-status', () => {
    return getDatabaseStatus();
  });

  // OS Info sample collector
  ipcMain.handle('analyzer:get-os-info', async () => {
    return await osCollector.collect();
  });

  // Theme settings (persisted in SQLite)
  ipcMain.handle('analyzer:get-theme', () => {
    try {
      const db = getDatabase();
      const row = db.prepare("SELECT value FROM settings WHERE key = 'theme'").get() as { value?: string } | undefined;
      return (row?.value as AppTheme) || 'dark';
    } catch {
      return 'dark';
    }
  });

  ipcMain.handle('analyzer:set-theme', (_event, theme: AppTheme) => {
    try {
      const db = getDatabase();
      db.prepare(`
        INSERT INTO settings (key, value, updated_at)
        VALUES ('theme', ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `).run(theme);
      return true;
    } catch {
      return false;
    }
  });

  // Window control actions
  ipcMain.handle('analyzer:minimize-window', event => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.minimize();
  });

  ipcMain.handle('analyzer:maximize-window', event => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  });

  ipcMain.handle('analyzer:close-window', event => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.close();
  });
}

