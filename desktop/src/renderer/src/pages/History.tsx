import React from 'react';
import { History as HistoryIcon, Clock, GitCompare, Trash2 } from 'lucide-react';

export const History: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <HistoryIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Scan History & Delta Tracking</h3>
              <p className="text-xs text-slate-400">Scheduled for Phase 6 Implementation</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded border border-indigo-500/30">
            Phase 6 Target
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Queries historical system scans and performance samples persisted in SQLite. Supports search filtering, deletion, audit inspection, and automated delta diffing between baseline and current state.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Clock className="w-4 h-4" />
            <h4 className="text-sm font-semibold text-slate-200">Scan Archive</h4>
          </div>
          <p className="text-xs text-slate-400">
            Filter historical scans by date, scan type, health score thresholds, and device.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-sky-400 mb-2">
            <GitCompare className="w-4 h-4" />
            <h4 className="text-sm font-semibold text-slate-200">Delta Diff Engine</h4>
          </div>
          <p className="text-xs text-slate-400">
            Inspect exact hardware, software, and driver changes between any two selected scans.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-rose-400 mb-2">
            <Trash2 className="w-4 h-4" />
            <h4 className="text-sm font-semibold text-slate-200">Retention & Purge</h4>
          </div>
          <p className="text-xs text-slate-400">
            Automated database cleanup and retention policies for high-frequency performance samples.
          </p>
        </div>
      </div>
    </div>
  );
};
