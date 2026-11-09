import React, { useEffect, useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AdminBanner } from './components/AdminBanner';
import { Dashboard } from './pages/Dashboard';
import { SystemInfo } from './pages/SystemInfo';
import { PerformanceMonitor } from './pages/PerformanceMonitor';
import { HardwareAnalysis } from './pages/HardwareAnalysis';
import { BatteryAnalysis } from './pages/BatteryAnalysis';
import { NetworkAnalysis } from './pages/NetworkAnalysis';
import { SystemHealth } from './pages/SystemHealth';
import { Reports } from './pages/Reports';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import type {
  NavPage,
  CollectorResult,
  OperatingSystemInfo,
  AdminStatus,
  DatabaseStatus
} from '@device-analyzer/shared';

export const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [osData, setOsData] = useState<CollectorResult<OperatingSystemInfo> | null>(null);
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [appVersion, setAppVersion] = useState<string>('1.0.0');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (window.deviceAnalyzer) {
        const [ver, admin, db, os] = await Promise.all([
          window.deviceAnalyzer.getAppVersion().catch(() => '1.0.0'),
          window.deviceAnalyzer.getAdminStatus().catch(() => ({ isAdmin: false, username: 'user', userDomain: 'local' })),
          window.deviceAnalyzer.getDbStatus().catch(() => null),
          window.deviceAnalyzer.getOsInfo().catch(err => ({
            data: null,
            available: false,
            error: err?.message || 'Failed to query OS info',
            requiresAdmin: false,
            timestamp: Date.now(),
            durationMs: 0
          }))
        ]);

        setAppVersion(ver);
        setAdminStatus(admin);
        setDbStatus(db);
        setOsData(os);
      }
    } catch (err) {
      console.error('Failed to load system diagnostics data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            osData={osData}
            adminStatus={adminStatus}
            dbStatus={dbStatus}
            onNavigate={setCurrentPage}
            onRunScan={loadData}
            isScanning={isRefreshing}
          />
        );
      case 'system-info':
        return (
          <SystemInfo
            osData={osData}
            onRefresh={loadData}
            isRefreshing={isRefreshing}
          />
        );
      case 'performance':
        return <PerformanceMonitor />;
      case 'hardware':
        return <HardwareAnalysis />;
      case 'battery':
        return <BatteryAnalysis />;
      case 'network':
        return <NetworkAnalysis />;
      case 'health':
        return <SystemHealth />;
      case 'reports':
        return <Reports />;
      case 'history':
        return <History />;
      case 'settings':
        return (
          <Settings
            dbStatus={dbStatus}
            adminStatus={adminStatus}
          />
        );
      default:
        return (
          <Dashboard
            osData={osData}
            adminStatus={adminStatus}
            dbStatus={dbStatus}
            onNavigate={setCurrentPage}
            onRunScan={loadData}
            isScanning={isRefreshing}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Navigation (All 10 Items) */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        appVersion={appVersion}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          currentPage={currentPage}
          adminStatus={adminStatus}
          dbStatus={dbStatus}
          onRefresh={loadData}
          isRefreshing={isRefreshing}
        />

        {/* Administrator Mode Warning Banner */}
        <AdminBanner adminStatus={adminStatus} />

        {/* Dynamic Page Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950/40">
          <div className="max-w-7xl mx-auto">
            {renderActivePage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
