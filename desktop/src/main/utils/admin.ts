import os from 'os';
import { runPowerShell } from './powershell';
import type { AdminStatus } from '@device-analyzer/shared';

let cachedStatus: AdminStatus | null = null;

export async function checkAdminPrivileges(forceRefresh = false): Promise<AdminStatus> {
  if (cachedStatus && !forceRefresh) {
    return cachedStatus;
  }

  const username = os.userInfo().username || process.env.USERNAME || 'Unknown';
  const userDomain = process.env.USERDOMAIN || 'Local';

  try {
    const cmd = `([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)`;
    const result = await runPowerShell(cmd, 5000);
    const isAdmin = result.stdout.trim().toLowerCase() === 'true';

    cachedStatus = {
      isAdmin,
      username,
      userDomain
    };

    return cachedStatus;
  } catch (err) {
    // If check fails, default to false (safe)
    return {
      isAdmin: false,
      username,
      userDomain
    };
  }
}

