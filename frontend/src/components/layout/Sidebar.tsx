import React from 'react';
import {
  LayoutDashboard,
  GitFork,
  Boxes,
  Terminal,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { PageId } from '../../types';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    sidebarCollapsed,
    setSidebarCollapsed,
    engineInfo,
    metrics,
  } = useAppState();

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'pipelines',
      label: 'CI/CD Pipelines',
      icon: <GitFork className="w-4 h-4 shrink-0" />,
      badge: 'Active',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    },
    {
      id: 'containers',
      label: 'Docker & Images',
      icon: <Boxes className="w-4 h-4 shrink-0" />,
      badge: `${engineInfo.containersRunning}/${engineInfo.containersTotal}`,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    },
    {
      id: 'logs',
      label: 'Activity & Logs',
      icon: <Terminal className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'settings',
      label: 'Settings & Spec',
      icon: <Settings className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#090e1a] border-r border-slate-800/90 flex flex-col transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-lg shadow-cyan-500/25 shrink-0">
            <Boxes className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300" />
            </span>
          </div>

          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm tracking-tight truncate">
                  Docker CI/CD
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Starter
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">DevOps Platform</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors hidden md:flex items-center justify-center"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {!sidebarCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
            Platform Navigation
          </div>
        )}

        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-sm shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              {item.icon}
              {!sidebarCollapsed && (
                <>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {/* Active bar indicator on left */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-r" />
              )}
            </button>
          );
        })}

        {/* Demo Tag Notice */}
        {!sidebarCollapsed && (
          <div className="pt-6 px-1">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-medium">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Phase 1 Frontend</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Mock prototype mode active. Ready for FastAPI backend & Docker daemon binding in Phase 2.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Uptime & Status Card (as shown in image 1) */}
      <div className="p-3 border-t border-slate-800/80 bg-[#070b14]">
        {!sidebarCollapsed ? (
          <div className="p-3.5 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-950/10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
                System Health
              </span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {metrics.uptimePercentage}%
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Uptime last 30 days
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="System Health: 99.97% Online">
            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
