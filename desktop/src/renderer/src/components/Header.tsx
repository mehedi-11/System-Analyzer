import React from 'react';
import { RefreshCw, Database as DbIcon, ShieldCheck, ShieldAlert } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import type { NavPage, AdminStatus, DatabaseStatus } from '@device-analyzer/shared';

interface HeaderProps {
  currentPage: NavPage;
  adminStatus: AdminStatus | null;
  dbStatus: DatabaseStatus | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const PAGE_TITLES: Record<NavPage, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of system telemetry, device health & quick diagnostics' },
  'system-info': { title: 'System Information', subtitle: 'Windows operating system, build version, hardware & directories' },
  performance: { title: 'Performance Monitor', subtitle: 'Real-time CPU, RAM, Disk, GPU and Network throughput' },
  hardware: { title: 'Hardware Analysis', subtitle: 'Detailed component inventory, cores, clock speeds, and SMART health' },
  battery: { title: 'Battery Analysis', subtitle: 'Capacity wear, cycle counts, health estimate, and discharge history' },
  network: { title: 'Network Analysis', subtitle: 'Network adapters, IP configuration, gateway ping and speed monitoring' },
  health: { title: 'Smart System Health', subtitle: 'Rule-based explainable health score (0-100) & optimization recommendations' },
  reports: { title: 'Diagnostic Reports', subtitle: 'Export full PDF reports and historical delta comparisons' },
  history: { title: 'Scan History', subtitle: 'Browse historical system scans, trends, and performance audits' },
  settings: { title: 'Settings', subtitle: 'Application preferences, scoring weights, and SQLite database storage' }
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  adminStatus,
  dbStatus,
  onRefresh,
  isRefreshing
}) => {
  const meta = PAGE_TITLES[currentPage] || { title: 'Device Analyzer', subtitle: '' };

  return (
    <header className="h-16 px-8 border-b border-slate-800 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-base font-semibold text-slate-100">{meta.title}</h2>
        <p className="text-xs text-slate-400">{meta.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* DB Status indicator */}
        <div
          title={
            dbStatus?.connected
              ? `SQLite connected: ${dbStatus.appliedMigrations} migrations applied (${dbStatus.tables.length} tables)`
              : 'Database disconnected'
          }
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs text-slate-300"
        >
          <DbIcon className={`w-3.5 h-3.5 ${dbStatus?.connected ? 'text-emerald-400' : 'text-rose-400'}`} />
          <span className="font-mono text-[11px]">SQLite</span>
          <span className={`w-1.5 h-1.5 rounded-full ${dbStatus?.connected ? 'bg-emerald-400' : 'bg-rose-400'}`} />
        </div>

        {/* Admin Badge */}
        <div
          title={
            adminStatus?.isAdmin
              ? `Elevated administrator privileges active (${adminStatus.username})`
              : `Standard user mode (${adminStatus?.username || 'user'})`
          }
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs text-slate-300"
        >
          {adminStatus?.isAdmin ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium text-emerald-300">Admin</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-medium text-amber-300">User</span>
            </>
          )}
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh system diagnostics"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors border border-slate-700/60 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
        </button>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
};
