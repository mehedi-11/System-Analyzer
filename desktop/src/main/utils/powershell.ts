import { spawn } from 'child_process';

export interface PowerShellRunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

/**
 * Execute a PowerShell script safely using -EncodedCommand (UTF-16LE Base64).
 * Completely eliminates command injection and quoting/escaping issues.
 */
export function runPowerShell(
  script: string,
  timeoutMs = 15000
): Promise<PowerShellRunResult> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const fullScript = `
      [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
      $ProgressPreference = 'SilentlyContinue';
      ${script}
    `.trim();

    // PowerShell -EncodedCommand accepts UTF-16LE (Unicode) base64-encoded strings
    const base64Script = Buffer.from(fullScript, 'utf16le').toString('base64');

    const args = [
      '-NoProfile',
      '-NonInteractive',
      '-ExecutionPolicy',
      'Bypass',
      '-EncodedCommand',
      base64Script
    ];

    const child = spawn('powershell.exe', args, {
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';
    let isTimedOut = false;

    const timer = setTimeout(() => {
      isTimedOut = true;
      try {
        child.kill();
      } catch {
        // ignore kill error
      }
      reject(new Error(`PowerShell script timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', chunk => {
      stdout += chunk;
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', chunk => {
      stderr += chunk;
    });

    child.on('error', err => {
      clearTimeout(timer);
      reject(new Error(`Failed to spawn PowerShell process: ${err.message}`));
    });

    child.on('close', code => {
      clearTimeout(timer);
      if (isTimedOut) return;

      const durationMs = Date.now() - startTime;
      resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: code ?? 0,
        durationMs
      });
    });
  });
}

/**
 * Executes a PowerShell script that produces JSON, parses the output, and returns typed data.
 */
export async function runPowerShellJson<T = unknown>(
  script: string,
  timeoutMs = 15000
): Promise<{ data: T; durationMs: number }> {
  const result = await runPowerShell(script, timeoutMs);

  if (result.exitCode !== 0 && !result.stdout) {
    throw new Error(
      `PowerShell command failed with exit code ${result.exitCode}: ${result.stderr || 'Unknown error'}`
    );
  }

  const cleaned = result.stdout.trim();
  if (!cleaned) {
    throw new Error('PowerShell command returned empty output');
  }

  try {
    const data = JSON.parse(cleaned) as T;
    return { data, durationMs: result.durationMs };
  } catch (parseError: unknown) {
    const err = parseError as Error;
    throw new Error(`Failed to parse PowerShell JSON response: ${err.message}. Raw output: ${cleaned.slice(0, 300)}`);
  }
}
