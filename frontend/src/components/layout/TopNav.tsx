import React, { useState } from 'react';
import {
  Search,
  RefreshCw,
  Bell,
  Play,
  Server,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { Button } from '../common/Button';

export const TopNav: React.FC = () => {
  const {
    sidebarCollapsed,
    setIsTriggerModalOpen,
    setIsCommandPaletteOpen,
    refreshAllData,
    isRefreshing,
    apiOnline,
    activities,
  } = useAppState();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState<'dev' | 'staging' | 'prod'>('prod');
  const [timeRange, setTimeRange] = useState('Last 24 hours');

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-[#080d19]/90 backdrop-blur-md border-b border-slate-800/80 transition-all duration-300 ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Host Breadcrumbs & Backend Health Indicator */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-white">srv-docker-prod-01</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-400 hidden sm:inline">us-east-1</span>
            <span className="text-slate-400 hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>online</span>
            </div>
          </div>

          {/* Backend Status Badge - clearly labeled per instructions */}
          {apiOnline ? (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>FastAPI Connected</span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Phase 2: Prototype Mode</span>
            </div>
          )}
        </div>

        {/* Center: Search Bar Trigger (Ctrl+K) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-2">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 bg-slate-900/90 hover:bg-slate-850 hover:text-slate-300 rounded-lg border border-slate-800/90 transition-all focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search services, pipelines, containers...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Refresh, Trigger, Notifications, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Environment Selector Dropdown */}
          <div className="relative hidden xl:block">
            <select
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value as any)}
              className="bg-slate-900 text-slate-300 text-xs font-mono rounded-lg px-2.5 py-1.5 border border-slate-800 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="prod">ENV: Production</option>
              <option value="staging">ENV: Staging</option>
              <option value="dev">ENV: Development</option>
            </select>
          </div>

          {/* Time range selector */}
          <div className="relative hidden sm:block">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-900 text-slate-300 text-xs font-mono rounded-lg px-2.5 py-1.5 border border-slate-800 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="Last 1 hour">Last 1 hour</option>
              <option value="Last 24 hours">Last 24 hours</option>
              <option value="Last 7 days">Last 7 days</option>
            </select>
          </div>

          {/* Refresh button */}
          <button
            onClick={refreshAllData}
            disabled={isRefreshing}
            className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-center"
            title="Refresh metrics & status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Trigger Pipeline Action Button */}
          <Button
            variant="glow"
            size="sm"
            onClick={() => setIsTriggerModalOpen(true)}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            className="hidden sm:inline-flex"
          >
            Run Pipeline
          </Button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Platform Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#080d19]" />
            </button>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0d1527] border border-slate-700/80 rounded-xl shadow-2xl shadow-cyan-950/40 z-50 p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      Recent Activity Alerts
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      {activities.length} new
                    </span>
                  </div>
                  <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto mt-2">
                    {activities.slice(0, 5).map((act) => (
                      <div key={act.id} className="py-2.5 flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {act.status === 'success' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          )}
                          {act.status === 'warning' && (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          )}
                          {act.status === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <div className="flex-1 truncate">
                          <p className="text-xs font-medium text-slate-200 truncate">{act.title}</p>
                          <p className="text-[11px] text-slate-400 truncate">{act.description}</p>
                          <span className="text-[10px] font-mono text-slate-400">{act.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-inner">
              A
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-white leading-tight">admin</span>
              <span className="text-[10px] text-slate-400 font-mono">DevOps Intern</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
