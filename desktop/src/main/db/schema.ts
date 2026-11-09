import fs from 'fs';
import path from 'path';
import type Database from 'better-sqlite3';

export interface Migration {
  version: number;
  name: string;
  sql: string;
}

export function initializeMigrationTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export function getAppliedMigrationVersions(db: Database.Database): Set<number> {
  initializeMigrationTable(db);
  const rows = db.prepare('SELECT version FROM schema_migrations ORDER BY version ASC').all() as Array<{ version: number }>;
  return new Set(rows.map(r => r.version));
}

export function loadMigrations(): Migration[] {
  const migrationsDir = path.resolve(__dirname, 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    // In dev or bundle context, check alternative paths
    const fallbackDir = path.resolve(process.cwd(), 'src/main/db/migrations');
    if (fs.existsSync(fallbackDir)) {
      return readMigrationsFromDir(fallbackDir);
    }
    return [];
  }

  return readMigrationsFromDir(migrationsDir);
}

function readMigrationsFromDir(dir: string): Migration[] {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  const migrations: Migration[] = [];

  for (const file of files) {
    const match = file.match(/^(\d+)_(.+)\.sql$/);
    if (!match) continue;

    const version = parseInt(match[1], 10);
    const name = match[2];
    const fullPath = path.join(dir, file);
    const sql = fs.readFileSync(fullPath, 'utf-8');

    migrations.push({ version, name, sql });
  }

  return migrations;
}

export function runMigrations(db: Database.Database, customMigrations?: Migration[]): number {
  initializeMigrationTable(db);
  const applied = getAppliedMigrationVersions(db);
  const migrations = customMigrations ?? loadMigrations();
  let appliedCount = 0;

  const insertRecord = db.prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)');

  for (const migration of migrations) {
    if (applied.has(migration.version)) {
      continue;
    }

    const runTx = db.transaction(() => {
      db.exec(migration.sql);
      insertRecord.run(migration.version, migration.name);
    });

    runTx();
    appliedCount++;
  }

  return appliedCount;
}
