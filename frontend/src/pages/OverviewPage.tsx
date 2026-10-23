import React from 'react';
import {
  Cpu,
  HardDrive,
  Network,
  Activity,
  Layers,
  GitFork,
  Radio,
  Server,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { StatCard } from '../components/common/StatCard';
import { ResourceAreaChart } from '../components/charts/ResourceAreaChart';
import { RequestDonutChart } from '../components/charts/RequestDonutChart';
import { RuntimeServicesGrid } from '../components/common/RuntimeServicesGrid';
import { EnvironmentCards } from '../components/common/EnvironmentCards';
import { PipelineRunsTable } from '../components/pipeline/PipelineRunsTable';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const OverviewPage: React.FC = () => {
  const {
    metrics,
    isLiveMetrics,
    metricsLoading,
    metricsError,
    loadLiveMetrics,
    apiOnline,
    backendLatencyMs,
    backendVersion,
    checkBackendHealth,
    setActivePage,
    setIsTriggerModalOpen,
  } = useAppState();

  const memoryPercent = metrics.memoryTotalGb > 0
    ? Math.round((metrics.memoryUsedGb / metrics.memoryTotalGb) * 100)
    : 0;

  const diskPercent = metrics.diskTotalGb > 0
    ? Math.round((metrics.diskUsedGb / metrics.diskTotalGb) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Overview Dashboard</h1>
            <Badge variant={isLiveMetrics ? 'success' : 'info'} size="sm" dot={isLiveMetrics} pulse={isLiveMetrics}>
              {isLiveMetrics ? 'Live API Telemetry' : 'Phase 2 Integrated'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time infrastructure health, telemetry metrics, and continuous deployment observability
          </p>
        </div>

        {/* Backend Availability Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Radio className={`w-3.5 h-3.5 ${apiOnline ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span>FastAPI:</span>
            {apiOnline ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                Online ({backendLatencyMs}ms)
              </span>
            ) : (
              <span className="text-amber-400 font-medium">Standby / Mock Fallback</span>
            )}
            <button
              onClick={checkBackendHealth}
              disabled={metricsLoading}
              className="text-[10px] text-cyan-400 hover:underline ml-1 cursor-pointer"
              title="Ping backend"
            >
              Test
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsTriggerModalOpen(true)}
            leftIcon={<GitFork className="w-3.5 h-3.5" />}
          >
            Dispatch Build
          </Button>
        </div>
      </div>

      {/* Dynamic Data Source Banner: Live Host Telemetry vs Labeled Prototype Mode */}
      {isLiveMetrics ? (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-cyan-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-slate-200">
              <strong className="text-emerald-300">Live Host Telemetry Connected:</strong> Displaying genuine hardware metrics collected via <code className="text-cyan-300 font-mono">FastAPI</code> and <code className="text-cyan-300 font-mono">psutil</code> (v{backendVersion}).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">Uptime: {metrics.uptimeFormatted}</span>
            <button
              onClick={loadLiveMetrics}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Refresh live metrics"
            >
              <RefreshCw className={`w-3 h-3 ${metricsLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/20 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <p className="text-slate-300">
              <strong className="text-cyan-300">Phase 2 Backend Integration:</strong> FastAPI endpoints are ready on <code className="text-cyan-300 font-mono">/api/metrics</code>. Currently showing labeled prototype telemetry. Run backend server to stream genuine metrics.
            </p>
          </div>
          <button
            onClick={() => setActivePage('settings')}
            className="text-cyan-400 hover:text-cyan-300 font-semibold font-mono whitespace-nowrap flex items-center gap-1 text-[11px]"
          >
            Backend Setup Instructions <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Error state if metrics collection failed */}
      {metricsError && (
        <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{metricsError}</span>
          </div>
          <button
            onClick={loadLiveMetrics}
            className="text-[11px] underline text-rose-200 hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* 4 Stat Cards Row matching Image 1 & 3 with Live / Prototype Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Usage Card */}
        <StatCard
          title="CPU Usage"
          value={metrics.cpuUsagePercent}
          unit="%"
          subtitle={`${metrics.cpuCores} cores · ${isLiveMetrics ? 'Host System' : '3.2GHz'}`}
          accentColor="cyan"
          progressPercent={metrics.cpuUsagePercent}
          progressBarColor="bg-cyan-400"
          icon={<Cpu className="w-4 h-4" />}
          borderStyle="dashed"
          badge={
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
              isLiveMetrics ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {isLiveMetrics ? 'LIVE' : 'SAMPLE'}
            </span>
          }
        />

        {/* Memory Card */}
        <StatCard
          title="Memory"
          value={metrics.memoryUsedGb}
          unit="GB"
          subtitle={`${metrics.memoryUsedGb} / ${metrics.memoryTotalGb} GB RAM`}
          accentColor="purple"
          progressPercent={memoryPercent}
          progressBarColor="bg-purple-500"
          icon={<Activity className="w-4 h-4" />}
          borderStyle="dashed"
          badge={
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
              isLiveMetrics ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {isLiveMetrics ? 'LIVE' : 'SAMPLE'}
            </span>
          }
        />

        {/* Disk I/O Card */}
        <StatCard
          title="Disk Storage"
          value={metrics.diskUsedGb}
          unit="GB"
          subtitle={`${metrics.diskUsedGb} / ${metrics.diskTotalGb} GB Root`}
          accentColor="amber"
          progressPercent={diskPercent}
          progressBarColor="bg-amber-500"
          icon={<HardDrive className="w-4 h-4" />}
          borderStyle="dashed"
          badge={
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
              isLiveMetrics ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {isLiveMetrics ? 'LIVE' : 'SAMPLE'}
            </span>
          }
        />

        {/* Network Throughput Card */}
        <StatCard
          title="Network Bandwidth"
          value={metrics.networkTxMbps > 1000 ? (metrics.networkTxMbps / 1000).toFixed(1) : metrics.networkTxMbps}
          unit={metrics.networkTxMbps > 1000 ? "Gbps" : "Mbps"}
          subtitle={`↑ ${metrics.networkRxMbps} MB · ↓ ${(metrics.networkTxMbps / 1000).toFixed(1)} GB`}
          accentColor="emerald"
          progressPercent={Math.min(100, Math.round(metrics.networkRxMbps / 15))}
          progressBarColor="bg-emerald-400"
          icon={<Network className="w-4 h-4" />}
          borderStyle="dashed"
          badge={
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
              isLiveMetrics ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {isLiveMetrics ? 'LIVE' : 'SAMPLE'}
            </span>
          }
        />
      </div>

      {/* Charts Section: Traffic Area Chart & Request Donut Chart matching Image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ResourceAreaChart />
        </div>
        <div>
          <RequestDonutChart />
        </div>
      </div>

      {/* Environment Fleet Cards matching Image 4 */}
      <EnvironmentCards />

      {/* Runtime Services Grid matching Image 1 */}
      <RuntimeServicesGrid />

      {/* Recent Pipeline Runs Table matching Image 4 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Latest Pipeline Executions
          </h3>
          <button
            onClick={() => setActivePage('pipelines')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
          >
            View Full Pipeline Graph <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <PipelineRunsTable />
      </div>
    </div>
  );
};
