import React from 'react';
import { BatteryCharging, Battery, Zap, ShieldCheck } from 'lucide-react';

export const BatteryAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <BatteryCharging className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Battery Diagnostics & Health</h3>
              <p className="text-xs text-slate-400">Scheduled for Phase 2/3 Implementation</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded border border-amber-500/30">
            Hardware Domain
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Queries battery state via Windows Battery API and WMI CIM (<code className="text-amber-400">BatteryFullChargedCapacity</code> vs <code className="text-amber-400">BatteryDesignCapacity</code>). On desktop PCs lacking a battery subsystem, the collector gracefully reports "Not Available" and redistributes category weights proportionally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium mb-1">Wear Level Calculation</div>
          <div className="text-lg font-bold text-slate-100">Design vs Full Capacity</div>
          <p className="text-xs text-slate-500 mt-2">Identifies cell degradation over charging cycles.</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium mb-1">Cycle Count & Health</div>
          <div className="text-lg font-bold text-slate-100">Cycle Life Rating</div>
          <p className="text-xs text-slate-500 mt-2">Tracks total discharge cycles against rated manufacturer limits.</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium mb-1">Graceful Desktop Fallback</div>
          <div className="text-lg font-bold text-slate-100">Auto-Redistribution</div>
          <p className="text-xs text-slate-500 mt-2">10% battery weight redistributed proportionally across other domains.</p>
        </div>
      </div>
    </div>
  );
};

