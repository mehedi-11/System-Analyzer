-- Device Analyzer Initial Schema Migration
-- Version: 1
-- Description: Core tables for devices, scans, hardware, software, performance, health, alerts, reports, and settings.

CREATE TABLE IF NOT EXISTS devices (
  id TEXT PRIMARY KEY,
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL DEFAULT 'desktop',
  os_name TEXT NOT NULL,
  os_version TEXT NOT NULL,
  os_build TEXT,
  arch TEXT NOT NULL,
  serial_number TEXT,
  first_seen DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scans (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  scan_type TEXT NOT NULL DEFAULT 'full',
  health_score INTEGER,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scan_hardware (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scan_id TEXT NOT NULL,
  category TEXT NOT NULL,
  data_json TEXT NOT NULL,
  available INTEGER NOT NULL DEFAULT 1,
  error_message TEXT,
  FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scan_software (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scan_id TEXT NOT NULL,
  category TEXT NOT NULL,
  data_json TEXT NOT NULL,
  available INTEGER NOT NULL DEFAULT 1,
  error_message TEXT,
  FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS performance_samples (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT NOT NULL,
  cpu_usage_pct REAL NOT NULL,
  ram_used_bytes INTEGER NOT NULL,
  ram_total_bytes INTEGER NOT NULL,
  disk_read_bps REAL DEFAULT 0,
  disk_write_bps REAL DEFAULT 0,
  net_rx_bps REAL DEFAULT 0,
  net_tx_bps REAL DEFAULT 0,
  gpu_usage_pct REAL DEFAULT 0,
  cpu_temp_c REAL,
  top_processes_json TEXT,
  sampled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS health_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scan_id TEXT NOT NULL,
  overall_score INTEGER NOT NULL,
  cpu_score INTEGER NOT NULL,
  memory_score INTEGER NOT NULL,
  storage_score INTEGER NOT NULL,
  battery_score INTEGER,
  os_score INTEGER NOT NULL,
  startup_score INTEGER NOT NULL,
  weights_json TEXT NOT NULL,
  calculated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS health_issues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  health_result_id INTEGER NOT NULL,
  rule_id TEXT NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL,
  points_deducted REAL NOT NULL,
  message TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  FOREIGN KEY (health_result_id) REFERENCES health_results(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  threshold_value REAL NOT NULL,
  actual_value REAL NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  acknowledged INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  scan_id TEXT,
  compare_scan_id TEXT,
  file_path TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'full_diagnostic',
  generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE SET NULL,
  FOREIGN KEY (compare_scan_id) REFERENCES scans(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Performance and retrieval indexes
CREATE INDEX IF NOT EXISTS idx_scans_device_created ON scans(device_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_perf_device_time ON performance_samples(device_id, sampled_at DESC);
CREATE INDEX IF NOT EXISTS idx_hardware_scan ON scan_hardware(scan_id, category);
CREATE INDEX IF NOT EXISTS idx_software_scan ON scan_software(scan_id, category);
CREATE INDEX IF NOT EXISTS idx_health_results_scan ON health_results(scan_id);
CREATE INDEX IF NOT EXISTS idx_health_issues_result ON health_issues(health_result_id);
CREATE INDEX IF NOT EXISTS idx_alerts_device_ack ON alerts(device_id, acknowledged, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_generated ON reports(generated_at DESC);

-- Default system settings
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('theme', 'dark'),
  ('health_weights', '{"cpu":20,"memory":20,"storage":25,"battery":10,"os":15,"startup":10}'),
  ('perf_sample_interval_ms', '2000'),
  ('perf_retention_days', '14'),
  ('auto_scan_enabled', '0');
