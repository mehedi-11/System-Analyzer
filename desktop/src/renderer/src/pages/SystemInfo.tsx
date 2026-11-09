import React from 'react';
import {
  Monitor,
  Copy,
  Check,
  RefreshCw,
  Folder,
  Calendar,
  Clock,
  Key,
  Shield,
  Layers,
  Cpu
} from 'lucide-react';
import type { CollectorResult, OperatingSystemInfo } from '@device-analyzer/shared';

interface SystemInfoProps {
  osData: CollectorResult<OperatingSystemInfo> | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const SystemInfo: React.FC<SystemInfoProps> = ({ osData, onRefresh, isRefreshing }) => {
  const [copied, setCopied] = React.useState(false);
  const os = osData?.data;

  const handleCopyJson = () => {
    if (!os) return;
    navigator.clipboard.writeText(JSON.stringify(os, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fields = [
    { label: 'OS Caption / Edition', value: os?.caption, icon: Monitor },
    { label: 'Version String', value: os?.version, icon: Layers },
    { label: 'Build Number', value: os?.buildNumber, icon: Shield },
    { label: 'Architecture', value: os?.architecture, icon: Cpu },
    {
      label: 'Installed Date',
      value: os?.installDate ? new Date(os.installDate).toLocaleString() : 'Unavailable',
      icon: Calendar
    },
    {
      label: 'Last Boot Time',
      value: os?.lastBootUpTime ? new Date(os.lastBootUpTime).toLocaleString() : 'Unavailable',
      icon: Clock
    },
    {
      label: 'System Uptime',
      value: os?.uptimeSeconds ? `${Math.floor(os.uptimeSeconds / 3600)} hours, ${Math.floor((os.uptimeSeconds % 3600) / 60)} minutes` : 'Unavailable',
      icon: Clock
    },
    { label: 'Serial Number', value: os?.serialNumber, icon: Key },
    { label: 'Registered User', value: os?.registeredUser, icon: Shield },
    { label: 'Organization', value: os?.organization || 'None', icon: Shield },
    { label: 'Windows Directory', value: os?.windowsDirectory, icon: Folder },
    { label: 'System Directory', value: os?.systemDirectory, icon: Folder },
    {
      label: 'Total Visible Memory',
      value: os?.totalVisibleMemoryMB ? `${os.totalVisibleMemoryMB.toLocaleString()} MB (~${Math.round(os.totalVisibleMemoryMB / 1024)} GB)` : 'Unavailable',
      icon: Cpu
    },
    {
      label: 'Free Physical Memory',
      value: os?.freePhysicalMemoryMB ? `${os.freePhysicalMemoryMB.toLocaleString()} MB (~${Math.round(os.freePhysicalMemoryMB / 1024 * 10) / 10} GB)` : 'Unavailable',
      icon: Cpu
    },
    { label: 'Subsystem Status', value: os?.status, icon: Shield }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-indigo-400" />
            <span>Windows Operating System Telemetry</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Retrieved directly via WMI/CIM class <code className="text-indigo-300 font-mono">Win32_OperatingSystem</code>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyJson}
            disabled={!os}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700 flex items-center gap-1.5 disabled:opacity-50"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Grid of properties */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl divide-y divide-slate-800 overflow-hidden">
        {fields.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-slate-800/80 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-xs font-medium text-slate-400">{f.label}</span>
              </div>
              <span className="text-xs font-mono text-slate-200 sm:text-right select-all">
                {f.value || '...'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

