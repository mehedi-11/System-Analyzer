import React from 'react';
import { Activity, Clock, Cpu, HardDrive, Wifi, Zap } from 'lucide-react';

export const PerformanceMonitor: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">PC Performance Monitor</h3>
              <p className="text-xs text-slate-400">Scheduled for Phase 3 Implementation</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded border border-indigo-500/30">
            Phase 3 Ready
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Continuous low-overhead background polling (1-2s interval) collecting CPU utilization, RAM pressure, disk I/O throughput, GPU engine load, and network transmission speeds. Sampled metrics are persisted directly into the SQLite <code className="text-indigo-400">performance_samples</code> table with downsampling retention policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-3">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>CPU Sampling</span>
          </div>
          <div className="text-xl font-bold text-slate-100">Real-time %</div>
          <div className="text-[11px] text-slate-500 mt-1">Multi-core utilization & frequency</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>RAM Pressure</span>
          </div>
          <div className="text-xl font-bold text-slate-100">Used / Available</div>
          <div className="text-[11px] text-slate-500 mt-1">Commit charge & page fault rates</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-3">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Disk I/O</span>
          </div>
          <div className="text-xl font-bold text-slate-100">Read / Write Bps</div>
          <div className="text-[11px] text-slate-500 mt-1">Per-drive queue depth & response time</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-3">
            <Wifi className="w-4 h-4 text-sky-400" />
            <span>Network Speed</span>
          </div>
          <div className="text-xl font-bold text-slate-100">Rx / Tx Throughput</div>
          <div className="text-[11px] text-slate-500 mt-1">Active interfaces and bandwidth</div>
        </div>
      </div>
    </div>
  );
};
