import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Calendar,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface StageNodeProps {
  title: string;
  version?: string;
  date?: string;
  cronExpr?: string;
  status: 'Passed' | 'Running' | 'Queued' | 'Failed';
  type?: 'job' | 'gate' | 'cron';
  githubLink?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

const StageNode: React.FC<StageNodeProps> = ({
  title,
  version,
  date,
  cronExpr,
  status,
  type = 'job',
  githubLink = true,
  onClick,
  isSelected = false,
}) => {
  const isGate = type === 'gate';
  const isCron = type === 'cron';

  const borderColor = isSelected
    ? 'border-cyan-400 ring-2 ring-cyan-500/30'
    : isGate
    ? 'border-blue-500/50 hover:border-blue-400'
    : status === 'Passed'
    ? 'border-emerald-500/50 hover:border-emerald-400'
    : status === 'Running'
    ? 'border-cyan-500/50 hover:border-cyan-400'
    : 'border-slate-700 hover:border-slate-500';

  const headerBg = isGate
    ? 'bg-blue-950/40 text-blue-300'
    : status === 'Passed'
    ? 'bg-emerald-950/40 text-emerald-300'
    : status === 'Running'
    ? 'bg-cyan-950/40 text-cyan-300'
    : 'bg-slate-800/40 text-slate-300';

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border ${borderColor} bg-[#0b1120] overflow-hidden shadow-lg transition-all duration-200 cursor-pointer min-w-[170px] max-w-[210px] shrink-0 text-left`}
    >
      {/* Node Header */}
      <div className={`flex items-center justify-between px-3 py-1.5 ${headerBg} border-b border-slate-800/80`}>
        <span className="text-xs font-semibold truncate">{title}</span>
        <Info className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
      </div>

      {/* Node Body */}
      <div className="p-2.5 text-xs font-mono space-y-1.5">
        {version && (
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px]">Version:</span>
            <span className="text-white font-semibold text-[11px]">{version}</span>
          </div>
        )}

        {date && (
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{date}</span>
          </div>
        )}

        {cronExpr && (
          <div className="flex items-center justify-between text-[11px] text-purple-300 bg-purple-950/30 px-2 py-0.5 rounded border border-purple-500/20">
            <span>Cron:</span>
            <span className="font-bold">{cronExpr}</span>
          </div>
        )}

        {!isGate && !isCron && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400 text-[11px]">Status:</span>
            <Badge
              variant={
                status === 'Passed'
                  ? 'success'
                  : status === 'Running'
                  ? 'running'
                  : status === 'Failed'
                  ? 'error'
                  : 'neutral'
              }
              size="sm"
              dot={status === 'Running'}
              pulse={status === 'Running'}
            >
              {status}
            </Badge>
          </div>
        )}

        {githubLink && !isGate && !isCron && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-slate-400 text-[10px]">
            <span>Links:</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-300 hover:text-white fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <ExternalLink className="w-3.5 h-3.5 text-slate-300 hover:text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PipelineVisualizer: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<string>('Functional');

  return (
    <div className="p-6 rounded-2xl bg-[#0d1527]/90 border border-slate-800/90 shadow-xl space-y-6 overflow-x-auto">
      {/* Top Application Header matching Image 2 */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Application Name</div>
            <div className="font-semibold text-white text-sm">docker-cicd-starter-platform</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Team / Project</div>
            <div className="text-cyan-400 font-semibold text-sm">core-infrastructure</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Target Branch</div>
            <div className="text-purple-400 font-semibold text-sm">main (master)</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" dot>
            Path to Production: Active
          </Badge>
        </div>
      </div>

      {/* Path to Production Title Banner */}
      <div className="flex items-center justify-center">
        <div className="px-6 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold uppercase tracking-wider text-slate-300 shadow-inner">
          Path to Production (Golden Path)
        </div>
      </div>

      {/* Graph Stages Container */}
      <div className="space-y-6 min-w-[850px]">
        {/* Stage Group 1: Fast Feedback */}
        <div className="p-4 rounded-xl border border-slate-800/80 bg-[#090f1d]/70 relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-white tracking-wide">
              Fast Feedback Stage Group
            </span>
            <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              v0.1.16
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto py-2">
            <StageNode
              title="Build Stage"
              status="Passed"
              isSelected={selectedStage === 'Build'}
              onClick={() => setSelectedStage('Build')}
            />

            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

            <StageNode
              title="Deploy Test Ready"
              version="0.1.16"
              date="May 1, 10:31 UTC"
              type="gate"
              status="Passed"
              githubLink={false}
              isSelected={selectedStage === 'Deploy Test Ready'}
              onClick={() => setSelectedStage('Deploy Test Ready')}
            />

            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

            {/* Parallel tests column */}
            <div className="flex flex-col gap-2 shrink-0">
              <StageNode
                title="Functional Tests"
                status="Passed"
                isSelected={selectedStage === 'Functional'}
                onClick={() => setSelectedStage('Functional')}
              />
              <StageNode
                title="Non Functional Scan"
                status="Passed"
                isSelected={selectedStage === 'Non Functional Scan'}
                onClick={() => setSelectedStage('Non Functional Scan')}
              />
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

            <StageNode
              title="Integration Suite"
              status="Running"
              isSelected={selectedStage === 'Integration Suite'}
              onClick={() => setSelectedStage('Integration Suite')}
            />

            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

            <StageNode
              title="Extended Test Ready"
              version="0.1.16"
              date="May 1, 10:31 UTC"
              type="gate"
              status="Passed"
              githubLink={false}
              isSelected={selectedStage === 'Extended Test Ready'}
              onClick={() => setSelectedStage('Extended Test Ready')}
            />
          </div>
        </div>

        {/* Lower Row: Extended Test and Production */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Extended Test Group */}
          <div className="p-4 rounded-xl border border-slate-800/80 bg-[#090f1d]/70">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-white tracking-wide">
                Extended Test Stage Group
              </span>
              <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10">
                v0.1.16
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto py-2">
              <StageNode
                title="Nightly Cron Job"
                cronExpr="0 22 * * *"
                type="cron"
                status="Passed"
                githubLink={false}
              />
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <StageNode
                title="Extended Stress Test"
                status="Passed"
                isSelected={selectedStage === 'Extended Stress Test'}
                onClick={() => setSelectedStage('Extended Stress Test')}
              />
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <StageNode
                title="Production Ready"
                version="0.1.16"
                type="gate"
                status="Passed"
                githubLink={false}
              />
            </div>
          </div>

          {/* Production Group */}
          <div className="p-4 rounded-xl border border-slate-800/80 bg-[#090f1d]/70">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-white tracking-wide">
                Production Release Gate
              </span>
              <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10">
                v0.1.16
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto py-2">
              <StageNode
                title="Release Window Cron"
                cronExpr="30 5 * * 1-5"
                type="cron"
                status="Passed"
                githubLink={false}
              />
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <StageNode
                title="Deploy Production"
                status="Passed"
                isSelected={selectedStage === 'Deploy Production'}
                onClick={() => setSelectedStage('Deploy Production')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Stage Detail Panel */}
      <div className="p-4 rounded-xl bg-[#080d19] border border-cyan-500/20 text-xs font-mono space-y-2">
        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold uppercase tracking-wider">
              Selected Stage Inspector:
            </span>
            <span className="text-white font-semibold">{selectedStage}</span>
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Stage gates passed
          </span>
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          Runs inside ephemeral isolated container runner (overlay2). Multi-stage cache layer verification is enabled for minimal latency.
        </p>
      </div>
    </div>
  );
};
