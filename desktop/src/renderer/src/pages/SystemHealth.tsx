import React from 'react';
import { ShieldCheck, Cpu, HardDrive, BatteryCharging, ShieldAlert, Zap, Layers } from 'lucide-react';

export const SystemHealth: React.FC = () => {
  const categories = [
    { name: 'Storage Health', weight: 25, icon: HardDrive, color: 'text-emerald-400', desc: 'Free disk space (<10%), SSD SMART status, drive degradation' },
    { name: 'CPU Health', weight: 20, icon: Cpu, color: 'text-indigo-400', desc: 'Thermal throttling (>85°C), sustained high usage, clock speed anomalies' },
    { name: 'Memory Health', weight: 20, icon: Layers, color: 'text-sky-400', desc: 'High RAM usage sustained (>85%), paging file bottlenecks' },
    { name: 'OS & Updates', weight: 15, icon: ShieldAlert, color: 'text-purple-400', desc: 'Pending Windows updates, security patch staleness, driver warnings' },
    { name: 'Battery Health', weight: 10, icon: BatteryCharging, color: 'text-amber-400', desc: 'Wear level (>40%), cycle count rating (auto-redistributed if desktop)' },
    { name: 'Startup Impact', weight: 10, icon: Zap, color: 'text-rose-400', desc: 'High-impact boot applications (>15 items), startup boot time impact' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Smart System Health Scoring Engine</h3>
              <p className="text-xs text-slate-400">Scheduled for Phase 4 Implementation</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded border border-indigo-500/30">
            Rule-Based & Traceable
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Every point deduction is 100% explainable and traceable. The engine evaluates each domain against explicit heuristic rules, producing an itemized list of <code className="text-indigo-300">{'{ ruleId, category, severity, pointsDeducted, message, recommendation }'}</code> with bottleneck detection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${c.color}`} />
                  <span className="text-sm font-semibold text-slate-200">{c.name}</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {c.weight}% Weight
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {c.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

