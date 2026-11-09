import React from 'react';
import { Wifi, Globe, Shield, Activity } from 'lucide-react';

export const NetworkAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Network & Adapter Diagnostics</h3>
              <p className="text-xs text-slate-400">Scheduled for Phase 2/3 Implementation</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-sky-500/20 text-sky-300 px-2.5 py-1 rounded border border-sky-500/30">
            Network Domain
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Monitors physical and virtual network adapters (Ethernet, Wi-Fi, VPNs), IPv4/IPv6 address assignments, MAC addresses, DHCP lease times, gateway latency, DNS server response, and active network connections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-sky-400 mb-2">
            <Wifi className="w-4 h-4" />
            <h4 className="text-sm font-semibold text-slate-200">Adapters & Wi-Fi</h4>
          </div>
          <p className="text-xs text-slate-400">
            SSID, signal strength (RSSI), channel width, 802.11 protocol version, and link speed.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Globe className="w-4 h-4" />
            <h4 className="text-sm font-semibold text-slate-200">IP Configuration</h4>
          </div>
          <p className="text-xs text-slate-400">
            Local IP, subnet mask, default gateway, DNS servers, and public IP resolution.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Activity className="w-4 h-4" />
            <h4 className="text-sm font-semibold text-slate-200">Latency & Throughput</h4>
          </div>
          <p className="text-xs text-slate-400">
            Gateway ping, packet loss tests, and real-time transmit/receive bandwidth gauges.
          </p>
        </div>
      </div>
    </div>
  );
};
