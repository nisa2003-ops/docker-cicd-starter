import React from 'react';
import {
  GitFork,
  Play,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { PipelineVisualizer } from '../components/pipeline/PipelineVisualizer';
import { PipelineRunsTable } from '../components/pipeline/PipelineRunsTable';
import { PipelineRunDrawer } from '../components/pipeline/PipelineRunDrawer';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

export const PipelinePage: React.FC = () => {
  const {
    pipelineRuns,
    pipelineConfigured,
    pipelineMessage,
    apiOnline,
    setIsTriggerModalOpen,
  } = useAppState();

  const successCount = pipelineRuns.filter((r) => r.status === 'success').length;
  const runningCount = pipelineRuns.filter((r) => r.status === 'running').length;
  const failedCount = pipelineRuns.filter((r) => r.status === 'failed').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              CI/CD Pipeline Visualization
            </h1>
            <Badge
              variant={pipelineConfigured ? 'success' : 'neutral'}
              size="sm"
              dot={runningCount > 0}
              pulse={runningCount > 0}
            >
              {pipelineConfigured ? `${runningCount} Active Runner(s)` : 'Runner: Standby'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Golden path orchestration: Build, test matrices, security gating, and zero-downtime deployment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="glow"
            size="sm"
            onClick={() => setIsTriggerModalOpen(true)}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            Dispatch Workflow
          </Button>
        </div>
      </div>

      {/* Backend API Runner Status Notice */}
      <div className="p-3.5 rounded-xl bg-[#090f1d] border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {pipelineConfigured ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          )}
          <span className="text-slate-300">
            <strong className="text-white">Runner Status:</strong> {pipelineMessage}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Backend API: {apiOnline ? 'Connected' : 'Mock Simulator'}
        </span>
      </div>

      {/* KPI Stats Pill Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-[#0d1424] border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Total Runs</span>
          <span className="text-base font-bold text-white">{pipelineRuns.length}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#0d1424] border border-slate-800 flex items-center justify-between">
          <span className="text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Passed
          </span>
          <span className="text-base font-bold text-emerald-400">{successCount}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#0d1424] border border-slate-800 flex items-center justify-between">
          <span className="text-cyan-400 flex items-center gap-1.5">
            <RotateCw className={`w-3.5 h-3.5 ${runningCount > 0 ? 'animate-spin' : ''}`} /> In Progress
          </span>
          <span className="text-base font-bold text-cyan-400">{runningCount}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#0d1424] border border-slate-800 flex items-center justify-between">
          <span className="text-rose-400">Failed</span>
          <span className="text-base font-bold text-rose-400">{failedCount}</span>
        </div>
      </div>

      {/* Path to Production Interactive Pipeline Graph matching Image 2 */}
      <div>
        <PipelineVisualizer />
      </div>

      {/* Pipeline Runs Table or Empty State */}
      <div>
        {pipelineRuns.length > 0 ? (
          <PipelineRunsTable />
        ) : (
          <EmptyState
            icon={<GitFork className="w-8 h-8 text-cyan-400" />}
            title="No Pipeline Runs Recorded"
            description="The CI/CD runner has not executed any builds yet. Click Dispatch Workflow to trigger a test run."
            actionLabel="Dispatch Workflow"
            onAction={() => setIsTriggerModalOpen(true)}
          />
        )}
      </div>

      {/* Inspection Drawer */}
      <PipelineRunDrawer />
    </div>
  );
};
