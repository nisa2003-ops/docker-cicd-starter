import React, { useState } from 'react';
import { Terminal, Activity, FileText, Filter, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { LogViewer } from '../components/logs/LogViewer';
import { ActivityTimeline } from '../components/logs/ActivityTimeline';
import { Badge } from '../components/common/Badge';

export const LogsPage: React.FC = () => {
  const { logs, activities } = useAppState();
  const [activeTab, setActiveTab] = useState<'terminal' | 'audit'>('terminal');

  const errorCount = logs.filter((l) => l.level === 'ERROR').length;
  const warnCount = logs.filter((l) => l.level === 'WARN').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Activity & Live Logs
            </h1>
            <Badge variant="info" size="sm">
              Telemetry Stream
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stdout/stderr aggregation, container health events, and system audit trail
          </p>
        </div>

        {/* Tab switch between Live Terminal and Audit Feed */}
        <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'terminal'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Live Terminal Stream</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'audit'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Audit Trail ({activities.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-[#0d1424] border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Total Log Entries</span>
          <span className="text-base font-bold text-white">{logs.length}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#0d1424] border border-slate-800 flex items-center justify-between">
          <span className="text-emerald-400">Stream Status</span>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#0d1424] border border-slate-800 flex items-center justify-between">
          <span className="text-amber-400">Warnings</span>
          <span className="text-base font-bold text-amber-400">{warnCount}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#0d1424] border border-slate-800 flex items-center justify-between">
          <span className="text-rose-400">Errors</span>
          <span className="text-base font-bold text-rose-400">{errorCount}</span>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'terminal' ? (
        <div className="space-y-4">
          <LogViewer />
        </div>
      ) : (
        <div className="space-y-4">
          <ActivityTimeline />
        </div>
      )}
    </div>
  );
};
