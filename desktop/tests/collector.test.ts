import { test, describe } from 'node:test';
import assert from 'node:assert';
import { OperatingSystemCollector } from '../src/main/collectors/os';
import { runPowerShell, runPowerShellJson } from '../src/main/utils/powershell';
import { checkAdminPrivileges } from '../src/main/utils/admin';

describe('PowerShell Runner & OS Collector Unit Tests', () => {
  test('runPowerShell should execute basic arithmetic safely without injection', async () => {
    const result = await runPowerShell('$a = 21; $b = 2; $a * $b');
    assert.strictEqual(result.exitCode, 0, 'Exit code should be 0');
    assert.strictEqual(result.stdout.trim(), '42');
  });

  test('runPowerShellJson should parse JSON output into typed JavaScript object', async () => {
    const result = await runPowerShellJson<{ message: string; code: number }>(
      '@{ message = "SystemAnalyzer"; code = 200 } | ConvertTo-Json'
    );
    assert.strictEqual(result.data.message, 'SystemAnalyzer');
    assert.strictEqual(result.data.code, 200);
    assert.ok(result.durationMs >= 0);
  });

  test('checkAdminPrivileges should return valid admin status structure', async () => {
    const status = await checkAdminPrivileges(true);
    assert.strictEqual(typeof status.isAdmin, 'boolean');
    assert.ok(typeof status.username === 'string' && status.username.length > 0);
  });

  test('OperatingSystemCollector should collect valid OS info without throwing', async () => {
    const collector = new OperatingSystemCollector();
    const result = await collector.collect();

    assert.strictEqual(result.available, true, 'OS info should be available');
    assert.strictEqual(result.requiresAdmin, false, 'OS info should not require admin');
    assert.ok(result.data !== null, 'OS data must not be null');

    const os = result.data!;
    assert.ok(os.caption.length > 0, 'Caption must be populated');
    assert.ok(os.version.length > 0, 'Version must be populated');
    assert.ok(os.architecture.length > 0, 'Architecture must be populated');
    assert.ok(os.totalVisibleMemoryMB > 0, 'Total memory must be > 0');
    assert.ok(os.freePhysicalMemoryMB > 0, 'Free memory must be > 0');
    assert.ok(os.uptimeSeconds >= 0, 'Uptime must be >= 0');
  });
});
