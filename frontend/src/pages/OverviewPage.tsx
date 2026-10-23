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
    engineInfo,
    apiOnline,
    checkBackendHealth,
    setActivePage,
    setIsTriggerModalOpen,
  } = useAppState();

  const memoryPercent = Math.round((metrics.memoryUsedGb / metrics.memoryTotalGb) * 100);
  const diskPercent = Math.round((metrics.diskUsedGb / metrics.diskTotalGb) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Overview Dashboard</h1>
            <Badge variant="info" size="sm">
              Portfolio Edition
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time infrastructure health, telemetry metrics, and continuous deployment observability
          </p>
        </div>

        {/* Prototype Transparency Notice */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>FastAPI Backend:</span>
            {apiOnline ? (
              <span className="text-emerald-400 font-bold">Connected</span>
            ) : (
              <span className="text-amber-400 font-medium">Standby (Phase 1 Mock)</span>
            )}
            <button
              onClick={checkBackendHealth}
              className="text-[10px] text-cyan-400 hover:underline ml-1"
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

      {/* Clearly labeled Sample Data Banner per instructions */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/20 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <p className="text-slate-300">
            <strong className="text-cyan-300">Phase 1 Visual Prototype:</strong> This interface displays clearly labeled sample DevOps telemetry for frontend internship evaluation. Ready for seamless binding with the FastAPI backend in Phase 2.
          </p>
        </div>
        <button
          onClick={() => setActivePage('settings')}
          className="text-cyan-400 hover:text-cyan-300 font-semibold font-mono whitespace-nowrap flex items-center gap-1 text-[11px]"
        >
          View Architecture Spec <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* 4 Stat Cards Row matching Image 1 & 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Usage Card */}
        <StatCard
          title="CPU Usage"
          value={metrics.cpuUsagePercent}
          unit="%"
          subtitle={`${metrics.cpuCores} cores · 3.2GHz`}
          accentColor="cyan"
          progressPercent={metrics.cpuUsagePercent}
          progressBarColor="bg-cyan-400"
          icon={<Cpu className="w-4 h-4" />}
          borderStyle="dashed"
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
        />

        {/* Disk I/O Card */}
        <StatCard
          title="Disk I/O"
          value="247"
          unit="MB/s"
          subtitle={`${metrics.diskUsedGb} / ${metrics.diskTotalGb} GB SSD`}
          accentColor="amber"
          progressPercent={diskPercent}
          progressBarColor="bg-amber-500"
          icon={<HardDrive className="w-4 h-4" />}
          borderStyle="dashed"
        />

        {/* Network Throughput Card */}
        <StatCard
          title="Network Bandwidth"
          value="1.8"
          unit="Gbps"
          subtitle={`↑ ${metrics.networkRxMbps} MB · ↓ ${(metrics.networkTxMbps / 1000).toFixed(1)} GB`}
          accentColor="emerald"
          progressPercent={72}
          progressBarColor="bg-emerald-400"
          icon={<Network className="w-4 h-4" />}
          borderStyle="dashed"
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
