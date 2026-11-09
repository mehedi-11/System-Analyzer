import React from 'react';
import { Cpu, HardDrive, Layers, Server, ShieldAlert } from 'lucide-react';

export const HardwareAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Hardware Component Inventory</h3>
              <p className="text-xs text-slate-400">Scheduled for Phase 2 Implementation</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded border border-indigo-500/30">
            Phase 2 Target
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Comprehensive extraction of device processors, RAM sticks (manufacturer, clock speed, part numbers), GPU controllers, Motherboard & BIOS firmware revisions, storage volumes, and physical drive SMART health diagnostics via WMI/CIM.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Cpu className="w-4 h-4" />
            <h4 className="text-sm font-semibold text-slate-200">CPU & Processors</h4>
          </div>
          <p className="text-xs text-slate-400">
            Cores, logical threads, L1/L2/L3 cache, base/boost clock, temperature sensor queries.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-sky-400 mb-2">
            <Layers className="w-4 h-4" />
            <h4 className="text-sm font-semibold text-slate-200">Physical Memory</h4>
          </div>
          <p className="text-xs text-slate-400">
            DIMM slots, memory type (DDR4/DDR5), speed in MHz, form factor, and module serial numbers.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <HardDrive className="w-4 h-4" />
            <h4 className="text-sm font-semibold text-slate-200">Storage & SMART</h4>
          </div>
          <p className="text-xs text-slate-400">
            NVMe / SATA drives, partition tables, health status, temperature, and wear indicators.
          </p>
        </div>
      </div>
    </div>
  );
};
