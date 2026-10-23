import React from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  GitBranch,
  GitCommit,
  User,
  Terminal,
  Layers,
  ArrowRight,
  RotateCw,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const PipelineRunDrawer: React.FC = () => {
  const { selectedPipelineRun, setSelectedPipelineRun, triggerNewRun } = useAppState();

  if (!selectedPipelineRun) return null;

  const run = selectedPipelineRun;

  return (
    <Modal
      isOpen={!!selectedPipelineRun}
      onClose={() => setSelectedPipelineRun(null)}
      title={`${run.pipelineName} #${run.runNumber}`}
      subtitle={`Triggered on branch ${run.branch} (${run.commitHash})`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Run Metadata Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#090f1d] border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Status</span>
            <div className="mt-1">
              <Badge
                variant={
                  run.status === 'success'
                    ? 'success'
                    : run.status === 'running'
                    ? 'running'
                    : 'error'
                }
                size="sm"
                dot
              >
                {run.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Duration</span>
            <span className="text-white font-semibold text-sm mt-1 block">{run.duration}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Trigger</span>
            <span className="text-cyan-400 font-semibold text-sm mt-1 block">
              {run.triggerType}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Committer</span>
            <span className="text-slate-200 font-semibold text-xs mt-1 block truncate">
              {run.author.name}
            </span>
          </div>
        </div>

        {/* Commit message description */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <GitCommit className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-white font-semibold">{run.commitHash}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300 truncate">{run.commitMessage}</span>
          </div>
        </div>

        {/* Stages Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Pipeline Execution Stages & Step Log Output
          </h4>

          {run.stages.length > 0 ? (
            <div className="space-y-3">
              {run.stages.map((stage) => (
                <div
                  key={stage.id}
                  className="rounded-xl border border-slate-800 bg-[#090f1d] overflow-hidden"
                >
                  <div className="flex items-center justify-between p-3 bg-slate-900/80 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2.5">
                      {stage.status === 'success' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                      {stage.status === 'running' && (
                        <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" />
                      )}
                      {stage.status === 'failed' && (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      )}
                      {stage.status === 'queued' && <Clock className="w-4 h-4 text-slate-400" />}

                      <span className="font-semibold text-white font-mono">{stage.name}</span>
                      <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                        {stage.group}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">
                      {stage.durationSeconds > 0 ? `${stage.durationSeconds}s` : 'queued'}
                    </span>
                  </div>

                  {/* Steps */}
                  {stage.steps.length > 0 && (
                    <div className="p-3 space-y-1.5 font-mono text-xs">
                      {stage.steps.map((step) => (
                        <div
                          key={step.id}
                          className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-850 text-slate-300"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span className="text-[11px]">{step.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{step.durationSeconds}s</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 font-mono bg-slate-900/40 rounded-xl border border-slate-800">
              No detailed stage breakdown recorded for this quick job run.
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerNewRun(run.pipelineName, run.branch)}
            leftIcon={<RotateCw className="w-3.5 h-3.5" />}
          >
            Re-run Workflow
          </Button>

          <Button variant="secondary" size="sm" onClick={() => setSelectedPipelineRun(null)}>
            Close Inspector
          </Button>
        </div>
      </div>
    </Modal>
  );
};
