import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import { runMigrations, getAppliedMigrationVersions } from './schema';
import type { DatabaseStatus } from '@device-analyzer/shared';

let dbInstance: Database.Database | null = null;
let dbPath: string = '';

export function getDatabasePath(): string {
  if (dbPath) return dbPath;

  try {
    // Dynamic require so this file can be unit tested without electron
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { app } = require('electron');
    if (app && typeof app.getPath === 'function') {
      const userDataDir = app.getPath('userData');
      if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir, { recursive: true });
      }
      dbPath = path.join(userDataDir, 'device_analyzer.db');
      return dbPath;
    }
  } catch {
    // Non-electron environment (e.g. CLI or tests)
  }

  const localDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }
  dbPath = path.join(localDir, 'device_analyzer.db');
  return dbPath;
}

export function initDatabase(customPath?: string): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  const targetPath = customPath || getDatabasePath();
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  dbInstance = new Database(targetPath);
  dbPath = targetPath;

  // Recommended SQLite performance pragmas
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('foreign_keys = ON');
  dbInstance.pragma('synchronous = NORMAL');

  // Execute migrations
  runMigrations(dbInstance);

  return dbInstance;
}

export function getDatabase(): Database.Database {
  if (!dbInstance) {
    return initDatabase();
  }
  return dbInstance;
}

export function closeDatabase(): void {
  if (dbInstance) {
    try {
      dbInstance.close();
    } finally {
      dbInstance = null;
    }
  }
}

export function getDatabaseStatus(): DatabaseStatus {
  try {
    const db = getDatabase();
    const applied = getAppliedMigrationVersions(db);
    const maxVersion = applied.size > 0 ? Math.max(...Array.from(applied)) : 0;

    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name ASC")
      .all() as Array<{ name: string }>;

    return {
      connected: true,
      filePath: dbPath,
      currentVersion: maxVersion,
      tables: tables.map(t => t.name),
      appliedMigrations: applied.size
    };
  } catch (err: unknown) {
    return {
      connected: false,
      filePath: dbPath,
      currentVersion: 0,
      tables: [],
      appliedMigrations: 0
    };
  }
}
