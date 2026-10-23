import React from 'react';
import {
  GitCommit,
  GitBranch,
  Clock,
  User,
  MoreVertical,
  ChevronRight,
  Play,
  RotateCw,
  ExternalLink,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { PipelineRun } from '../../types';
import { Badge } from '../common/Badge';

export const PipelineRunsTable: React.FC = () => {
  const { pipelineRuns, setSelectedPipelineRun, triggerNewRun } = useAppState();

  const getStatusBadge = (status: PipelineRun['status']) => {
    switch (status) {
      case 'running':
        return (
          <Badge variant="running" size="sm" dot pulse>
            RUNNING
          </Badge>
        );
      case 'success':
        return (
          <Badge variant="success" size="sm" dot>
            SUCCESS
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="error" size="sm" dot>
            FAILED
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm">
            {status.toUpperCase()}
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d1424]/90 overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">Recent Pipeline Runs</h3>
          <p className="text-xs text-slate-400">Execution history with commit SHAs and stage durations</p>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
          {pipelineRuns.length} Total Runs
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#090f1d] text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Pipeline Name</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Trigger Info</th>
              <th className="py-3 px-4">Executed By</th>
              <th className="py-3 px-4 text-right">Duration</th>
              <th className="py-3 px-4 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {pipelineRuns.map((run) => (
              <tr
                key={run.id}
                onClick={() => setSelectedPipelineRun(run)}
                className="hover:bg-slate-850/60 transition-colors cursor-pointer group"
              >
                {/* Pipeline Name */}
                <td className="py-3.5 px-4 font-sans">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                    <div>
                      <span className="font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors block">
                        {run.pipelineName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Run #{run.runNumber}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">{getStatusBadge(run.status)}</td>

                {/* Trigger Info matching Image 4 */}
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-slate-300 text-xs">
                      <span className="flex items-center gap-1 font-semibold text-slate-200">
                        <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                        {run.branch}
                      </span>
                      <span className="text-slate-400">|</span>
                      <span className="flex items-center gap-1 text-cyan-300 font-mono bg-cyan-950/40 px-1.5 py-0.2 rounded border border-cyan-800/40">
                        <GitCommit className="w-3 h-3" />
                        {run.commitHash}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs font-sans">
                      {run.commitMessage}
                    </div>
                  </div>
                </td>

                {/* Executed By matching Image 4 */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-300 shrink-0">
                      {run.author.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs text-slate-200 font-medium font-sans">
                        {run.author.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {run.triggerType} · {run.startedAt}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Duration */}
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center gap-1 text-slate-300 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {run.duration}
                  </span>
                </td>

                {/* Inspect Action */}
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPipelineRun(run);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="View Stage Timeline & Logs"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
