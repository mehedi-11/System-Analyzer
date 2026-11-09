import React from 'react';
import { Settings as SettingsIcon, Database, Moon, Sun, Sliders, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { DatabaseStatus, AdminStatus } from '@device-analyzer/shared';

interface SettingsProps {
  dbStatus: DatabaseStatus | null;
  adminStatus: AdminStatus | null;
}

export const Settings: React.FC<SettingsProps> = ({ dbStatus, adminStatus }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Application Settings</h3>
            <p className="text-xs text-slate-400">Configure theme, local SQLite storage, and diagnostics parameters</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Appearance */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sun className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-semibold text-slate-200">Appearance & Theme</h4>
          </div>

          <div className="space-y-3">
            <label className="text-xs text-slate-400 block">Theme Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-xs font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-300" />
                <span>Dark Theme</span>
              </button>

              <button
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-xs font-medium transition-all ${
                  theme === 'light'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-300" />
                <span>Light Theme</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Theme preference is persisted to the local SQLite settings table.
            </p>
          </div>
        </div>

        {/* Card 2: SQLite Storage Info */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Database className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-slate-200">SQLite Storage & Schema</h4>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Database File Path</span>
              <span className="font-mono text-slate-300 bg-slate-950/70 p-2 rounded block truncate select-all border border-slate-800" title={dbStatus?.filePath}>
                {dbStatus?.filePath || 'Unavailable'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-950/70 p-3 rounded border border-slate-800">
                <span className="text-slate-500 block mb-1">Active Tables</span>
                <span className="text-base font-bold text-slate-100 font-mono">
                  {dbStatus?.tables.length || 0} tables
                </span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded border border-slate-800">
                <span className="text-slate-500 block mb-1">Migrations Applied</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  v{dbStatus?.currentVersion || 1}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Health Score Weights */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-semibold text-slate-200">Configurable Health Scoring Weights</h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Storage', weight: 25 },
              { label: 'CPU', weight: 20 },
              { label: 'Memory', weight: 20 },
              { label: 'OS / Updates', weight: 15 },
              { label: 'Battery', weight: 10 },
              { label: 'Startup Apps', weight: 10 }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">{item.label}</span>
                <span className="text-lg font-bold text-indigo-400 font-mono">{item.weight}%</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">
            Total weights sum to 100%. If a category is unavailable on this device (e.g. Battery on desktop workstations), its weight is automatically redistributed proportionally across active categories.
          </p>
        </div>
      </div>
    </div>
  );
};
