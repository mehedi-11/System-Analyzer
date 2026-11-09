import React from 'react';
import { ShieldAlert } from 'lucide-react';
import type { AdminStatus } from '@device-analyzer/shared';

interface AdminBannerProps {
  adminStatus: AdminStatus | null;
}

export const AdminBanner: React.FC<AdminBannerProps> = ({ adminStatus }) => {
  if (!adminStatus || adminStatus.isAdmin) {
    return null;
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-amber-200">
      <div className="flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong className="font-semibold text-amber-300">Standard User Mode:</strong> Some deep hardware telemetry (CPU/GPU temperature sensors, SSD SMART vendor logs, and protected drivers) require elevated privileges.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
          Run as Administrator for full telemetry
        </span>
      </div>
    </div>
  );
};

