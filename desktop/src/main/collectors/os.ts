import os from 'os';
import { runPowerShellJson } from '../utils/powershell';
import { executeCollector, type Collector } from './base';
import type { CollectorResult, OperatingSystemInfo } from '@device-analyzer/shared';

interface RawCimOs {
  Caption?: string;
  Version?: string;
  BuildNumber?: string;
  OSArchitecture?: string;
  InstallDate?: string;
  LastBootUpTime?: string;
  SerialNumber?: string;
  RegisteredUser?: string;
  Organization?: string;
  WindowsDirectory?: string;
  SystemDirectory?: string;
  TotalVisibleMemorySize?: number;
  FreePhysicalMemory?: number;
  Status?: string;
}

function parseWmiDate(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString();

  // Format: /Date(1793702013612)/
  const msMatch = dateStr.match(/\/Date\((\d+)\)\//);
  if (msMatch) {
    const ms = parseInt(msMatch[1], 10);
    return new Date(ms).toISOString();
  }

  // WMI DMTF format: yyyymmddHHMMSS.mmmmmm+UUU
  const dmtfMatch = dateStr.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
  if (dmtfMatch) {
    const [, year, month, day, hour, min, sec] = dmtfMatch;
    return new Date(Date.UTC(+year, +month - 1, +day, +hour, +min, +sec)).toISOString();
  }

  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export class OperatingSystemCollector implements Collector<OperatingSystemInfo> {
  public readonly name = 'Operating System';
  public readonly category = 'software';
  public readonly requiresAdmin = false;

  public async collect(): Promise<CollectorResult<OperatingSystemInfo>> {
    return executeCollector(this.name, this.requiresAdmin, async () => {
      const script = `
        Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, BuildNumber, OSArchitecture, InstallDate, LastBootUpTime, SerialNumber, RegisteredUser, Organization, WindowsDirectory, SystemDirectory, TotalVisibleMemorySize, FreePhysicalMemory, Status | ConvertTo-Json
      `;

      try {
        const { data: raw } = await runPowerShellJson<RawCimOs>(script, 10000);

        const bootIso = parseWmiDate(raw.LastBootUpTime);
        const bootTimeMs = new Date(bootIso).getTime();
        const nowMs = Date.now();
        const uptimeSeconds = bootTimeMs > 0 && bootTimeMs <= nowMs ? Math.floor((nowMs - bootTimeMs) / 1000) : Math.floor(os.uptime());

        const totalMemMB = raw.TotalVisibleMemorySize ? Math.round(raw.TotalVisibleMemorySize / 1024) : Math.round(os.totalmem() / (1024 * 1024));
        const freeMemMB = raw.FreePhysicalMemory ? Math.round(raw.FreePhysicalMemory / 1024) : Math.round(os.freemem() / (1024 * 1024));

        const info: OperatingSystemInfo = {
          caption: raw.Caption || `Windows ${os.release()}`,
          version: raw.Version || os.release(),
          buildNumber: raw.BuildNumber || os.release().split('.')[2] || '',
          architecture: raw.OSArchitecture || os.arch(),
          installDate: parseWmiDate(raw.InstallDate),
          lastBootUpTime: bootIso,
          uptimeSeconds,
          serialNumber: raw.SerialNumber || 'Unavailable',
          registeredUser: raw.RegisteredUser || os.userInfo().username || 'Default User',
          organization: raw.Organization || 'Workgroup',
          windowsDirectory: raw.WindowsDirectory || process.env.SystemRoot || 'C:\\Windows',
          systemDirectory: raw.SystemDirectory || process.env.windir ? `${process.env.windir}\\system32` : 'C:\\Windows\\system32',
          totalVisibleMemoryMB: totalMemMB,
          freePhysicalMemoryMB: freeMemMB,
          status: raw.Status || 'OK'
        };

        return info;
      } catch (err: unknown) {
        // Fallback using Node's os module so we still provide valid data if WMI is degraded
        const info: OperatingSystemInfo = {
          caption: `Windows (${os.type()} ${os.release()})`,
          version: os.release(),
          buildNumber: os.release(),
          architecture: os.arch(),
          installDate: new Date().toISOString(),
          lastBootUpTime: new Date(Date.now() - os.uptime() * 1000).toISOString(),
          uptimeSeconds: Math.floor(os.uptime()),
          serialNumber: 'Unavailable (WMI fallback)',
          registeredUser: os.userInfo().username,
          organization: 'Unknown',
          windowsDirectory: process.env.SystemRoot || 'C:\\Windows',
          systemDirectory: 'C:\\Windows\\system32',
          totalVisibleMemoryMB: Math.round(os.totalmem() / (1024 * 1024)),
          freePhysicalMemoryMB: Math.round(os.freemem() / (1024 * 1024)),
          status: 'Degraded'
        };

        return info;
      }
    });
  }
}
