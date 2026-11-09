import React from 'react';
import {
  LayoutDashboard,
  Info,
  Activity,
  Cpu,
  BatteryCharging,
  Wifi,
  ShieldCheck,
  FileText,
  History,
  Settings,
  Monitor
} from 'lucide-react';
import type { NavPage } from '@device-analyzer/shared';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  appVersion: string;
}

interface MenuItem {
  id: NavPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'system-info', label: 'System Info', icon: Info },
  { id: 'performance', label: 'Performance Monitor', icon: Activity },
  { id: 'hardware', label: 'Hardware Analysis', icon: Cpu },
  { id: 'battery', label: 'Battery Analysis', icon: BatteryCharging },
  { id: 'network', label: 'Network Analysis', icon: Wifi },
  { id: 'health', label: 'System Health', icon: ShieldCheck, badge: 'Smart' },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, appVersion }) => {
  return (
    <aside className="w-64 bg-slate-900/90 dark:bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none backdrop-blur-md">
      {/* Top Branding */}
      <div>
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Monitor className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-100 text-sm tracking-tight">Device Analyzer</h1>
            <p className="text-[11px] text-slate-400 font-mono">v{appVersion}</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1">
          {MENU_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-indigo-700/60 text-white'
                        : 'bg-indigo-950/70 text-indigo-400 border border-indigo-800/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom status footer */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Online</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Windows 10/11</span>
        </div>
      </div>
    </aside>
  );
};
