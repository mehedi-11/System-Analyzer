import React from 'react';
import {
  Monitor,
  HardDrive,
  Cpu,
  Database,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import type {
  CollectorResult,
  OperatingSystemInfo,
  AdminStatus,
  DatabaseStatus,
  NavPage
} from '@device-analyzer/shared';

interface DashboardProps {
  osData: CollectorResult<OperatingSystemInfo> | null;
  adminStatus: AdminStatus | null;
  dbStatus: DatabaseStatus | null;
  onNavigate: (page: NavPage) => void;
  onRunScan: () => void;
  isScanning: boolean;
}

function formatUptime(seconds?: number): string {
  if (!seconds || seconds <= 0) return 'Just started';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(' ');
}

export const Dashboard: React.FC<DashboardProps> = ({
  osData,
  adminStatus,
  dbStatus,
  onNavigate,
  onRunScan,
  isScanning
}) => {
  const os = osData?.data;

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900/80 to-slate-900 border border-indigo-500/20 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 1 Architecture Proof of Concept</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {os ? os.caption : 'Analyzing System...'}
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              End-to-end IPC communication verified between Electron main process, secure preload contextBridge, SQLite database, and React renderer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRunScan}
              disabled={isScanning}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isScanning ? 'Running Scan...' : 'Run Quick Diagnostic'}</span>
            </button>
            <button
              onClick={() => onNavigate('system-info')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all border border-slate-700/60 flex items-center gap-1.5"
            >
              <span>Full Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Operating System */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Operating System</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Monitor className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg font-semibold text-slate-100 truncate" title={os?.caption}>
              {os?.caption || 'Loading...'}
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">
              Build {os?.buildNumber || '...'} ({os?.architecture || 'x64'})
            </div>
          </div>
        </div>

        {/* Card 2: System Uptime */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">System Uptime</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg font-semibold text-slate-100">
              {formatUptime(os?.uptimeSeconds)}
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">
              Boot: {os?.lastBootUpTime ? new Date(os.lastBootUpTime).toLocaleTimeString() : '...'}
            </div>
          </div>
        </div>

        {/* Card 3: Memory Available */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total / Free RAM</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg font-semibold text-slate-100">
              {os ? `${Math.round(os.totalVisibleMemoryMB / 1024)} GB Total` : 'Loading...'}
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">
              {os ? `${Math.round(os.freePhysicalMemoryMB / 1024 * 10) / 10} GB Free (${Math.round((os.freePhysicalMemoryMB / os.totalVisibleMemoryMB) * 100)}%)` : '...'}
            </div>
          </div>
        </div>

        {/* Card 4: SQLite Database */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">SQLite Storage</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg font-semibold text-slate-100 flex items-center gap-1.5">
              <span>{dbStatus?.tables.length || 0} Tables Active</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">
              Schema v{dbStatus?.currentVersion || 1} • WAL Mode
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Live IPC Proof Card + Health Gauge Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Collector IPC Pipeline Proof */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100">PowerShell CIM OS Collector (Live IPC)</h3>
              <p className="text-xs text-slate-400">
                Data queried via PowerShell CIM Win32_OperatingSystem through typed IPC contextBridge
              </p>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 font-mono">
              {osData?.durationMs ? `${osData.durationMs}ms latency` : 'Active'}
            </span>
          </div>

          {os ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 block mb-1">Edition</span>
                <span className="font-semibold text-slate-200">{os.caption}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 block mb-1">Version</span>
                <span className="font-mono text-slate-200">{os.version}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 block mb-1">Build Number</span>
                <span className="font-mono text-slate-200">{os.buildNumber}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 block mb-1">Architecture</span>
                <span className="font-semibold text-slate-200">{os.architecture}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 block mb-1">Registered User</span>
                <span className="text-slate-200 truncate block">{os.registeredUser}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 block mb-1">Windows Directory</span>
                <span className="font-mono text-slate-200 truncate block" title={os.windowsDirectory}>{os.windowsDirectory}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 text-slate-500 text-xs">
              Waiting for OS collector response...
            </div>
          )}
        </div>

        {/* Right 1 Col: Health Score Preview Gauge */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-slate-100">Smart Health Score</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                Phase 4
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Rule-based explainable score (0-100) calculated from CPU, RAM, Disk, Battery, OS, and Startup impact.
            </p>

            {/* Circular Gauge Representation */}
            <div className="flex flex-col items-center justify-center my-2">
              <div className="relative w-36 h-36 rounded-full border-8 border-slate-800 flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 rounded-full border-8 border-indigo-500 border-t-transparent border-l-transparent -rotate-45"></div>
                <div className="text-center">
                  <span className="text-3xl font-extrabold text-white">92</span>
                  <span className="text-xs text-slate-400 block font-medium">Excellent</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>6 Categories Weighted</span>
            <button
              onClick={() => onNavigate('health')}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>View Rules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
