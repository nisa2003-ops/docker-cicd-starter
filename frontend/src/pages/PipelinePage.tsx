import React, { useState } from 'react';
import {
  GitFork,
  Play,
  Filter,
  RotateCw,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { PipelineVisualizer } from '../components/pipeline/PipelineVisualizer';
import { PipelineRunsTable } from '../components/pipeline/PipelineRunsTable';
import { PipelineRunDrawer } from '../components/pipeline/PipelineRunDrawer';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const PipelinePage: React.FC = () => {
  const { pipelineRuns, setIsTriggerModalOpen } = useAppState();

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
            <Badge variant="running" size="sm" dot pulse={runningCount > 0}>
              {runningCount} Active Runner{runningCount === 1 ? '' : 's'}
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
            <RotateCw className="w-3.5 h-3.5 animate-spin" /> In Progress
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

      {/* Pipeline Runs Table matching Image 4 */}
      <div>
        <PipelineRunsTable />
      </div>

      {/* Inspection Drawer */}
      <PipelineRunDrawer />
    </div>
  );
};
