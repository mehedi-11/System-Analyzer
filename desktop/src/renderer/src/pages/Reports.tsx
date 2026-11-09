import React from 'react';
import { FileText, Download, Printer, ArrowRight } from 'lucide-react';

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Diagnostic Report Generator</h3>
              <p className="text-xs text-slate-400">Scheduled for Phase 5 Implementation (PDFKit)</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded border border-indigo-500/30">
            Phase 5 Target
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Generates comprehensive standalone PDF diagnostic reports formatted for technical audits, IT helpdesk submissions, and system compliance reviews. Includes vector charts rendered directly into PDFKit, device summary, hardware specifications, software audit, health score breakdown, and delta comparisons.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Download className="w-4 h-4" />
            <h4 className="text-sm font-semibold text-slate-200">Full Diagnostic PDF</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-page document containing complete hardware specs, software versions, temperature graphs, and the traceable health score deduction summary.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Printer className="w-4 h-4" />
            <h4 className="text-sm font-semibold text-slate-200">Historical Delta Comparison</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Side-by-side delta report highlighting newly installed programs, degraded drive health, memory leaks, and performance fluctuations between two scans.
          </p>
        </div>
      </div>
    </div>
  );
};
