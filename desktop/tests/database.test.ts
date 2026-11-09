import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { runMigrations, getAppliedMigrationVersions } from '../src/main/db/schema';

describe('SQLite Database & Migration Engine', () => {
  let db: Database.Database;

  before(() => {
    // In-memory test database
    db = new Database(':memory:');
    db.pragma('foreign_keys = ON');
  });

  after(() => {
    if (db) db.close();
  });

  test('should initialize schema_migrations and apply 001_initial_schema', () => {
    const migrationFile = path.resolve(process.cwd(), 'src/main/db/migrations/001_initial_schema.sql');
    assert.ok(fs.existsSync(migrationFile), `001_initial_schema.sql must exist at ${migrationFile}`);

    const sql = fs.readFileSync(migrationFile, 'utf-8');
    const customMigrations = [{ version: 1, name: 'initial_schema', sql }];

    const appliedCount = runMigrations(db, customMigrations);
    assert.strictEqual(appliedCount, 1, 'Should apply exactly 1 initial migration');

    const versions = getAppliedMigrationVersions(db);
    assert.ok(versions.has(1), 'Version 1 should be recorded as applied');
  });

  test('should not re-apply already applied migrations (idempotent)', () => {
    const customMigrations = [{ version: 1, name: 'initial_schema', sql: 'SELECT 1;' }];
    const count = runMigrations(db, customMigrations);
    assert.strictEqual(count, 0, 'Should not re-apply existing version 1');
  });

  test('should create all required tables', () => {
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
      .all() as Array<{ name: string }>;
    const tableNames = new Set(tables.map(t => t.name));

    const requiredTables = [
      'schema_migrations',
      'devices',
      'scans',
      'scan_hardware',
      'scan_software',
      'performance_samples',
      'health_results',
      'health_issues',
      'alerts',
      'reports',
      'settings'
    ];

    for (const req of requiredTables) {
      assert.ok(tableNames.has(req), `Expected table '${req}' to exist in database`);
    }
  });

  test('should contain default settings seeds', () => {
    const theme = db.prepare("SELECT value FROM settings WHERE key = 'theme'").get() as { value: string };
    assert.strictEqual(theme?.value, 'dark', 'Default theme setting should be dark');

    const weightsRow = db.prepare("SELECT value FROM settings WHERE key = 'health_weights'").get() as { value: string };
    assert.ok(weightsRow?.value, 'Health weights setting should exist');
    const weights = JSON.parse(weightsRow.value);
    assert.strictEqual(weights.cpu, 20);
    assert.strictEqual(weights.memory, 20);
    assert.strictEqual(weights.storage, 25);
    assert.strictEqual(weights.battery, 10);
    assert.strictEqual(weights.os, 15);
    assert.strictEqual(weights.startup, 10);
  });
});
