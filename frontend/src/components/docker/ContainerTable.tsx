import React, { useState } from 'react';
import {
  Boxes,
  Play,
  Square,
  RotateCw,
  ExternalLink,
  Search,
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { DockerContainer } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const ContainerTable: React.FC = () => {
  const { containers, toggleContainer, setSelectedContainer, setActivePage } = useAppState();
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState<'all' | 'running' | 'stopped'>('all');

  const filtered = containers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.image.toLowerCase().includes(search.toLowerCase());
    const matchesState =
      stateFilter === 'all'
        ? true
        : stateFilter === 'running'
        ? c.state === 'running'
        : c.state !== 'running';
    return matchesSearch && matchesState;
  });

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d1424]/90 overflow-hidden shadow-xl">
      {/* Header & Filter Controls */}
      <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">Containers</h3>
          <p className="text-xs text-slate-400">Manage running instances, port bindings, and lifecycle</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search containers..."
              className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* State filter buttons */}
          <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-mono">
            <button
              onClick={() => setStateFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                stateFilter === 'all' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStateFilter('running')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                stateFilter === 'running'
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              Running
            </button>
            <button
              onClick={() => setStateFilter('stopped')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                stateFilter === 'stopped'
                  ? 'bg-slate-800 text-rose-400 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              Stopped
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#090f1d] text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">State</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Ports</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {filtered.map((c) => {
              const isRunning = c.state === 'running';
              return (
                <tr
                  key={c.id}
                  onClick={() => setSelectedContainer(c)}
                  className="hover:bg-slate-850/60 transition-colors cursor-pointer group"
                >
                  {/* Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {c.name}
                      </span>
                    </div>
                  </td>

                  {/* Image */}
                  <td className="py-3.5 px-4 text-slate-400 truncate max-w-[160px]">
                    {c.image}
                  </td>

                  {/* State */}
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={isRunning ? 'success' : 'neutral'}
                      size="sm"
                      dot={isRunning}
                      pulse={isRunning}
                    >
                      {c.state.toUpperCase()}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      {c.health === 'healthy' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      {c.health === 'unhealthy' && (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span className="text-slate-300 text-[11px]">{c.uptime}</span>
                    </div>
                  </td>

                  {/* Ports */}
                  <td className="py-3.5 px-4">
                    {c.ports.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {c.ports.map((p, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-400 font-mono border border-slate-700"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isRunning ? (
                        <>
                          <button
                            onClick={() => toggleContainer(c.id, 'stop')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Stop Container"
                          >
                            <Square className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <button
                            onClick={() => toggleContainer(c.id, 'restart')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                            title="Restart Container"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => toggleContainer(c.id, 'start')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          title="Start Container"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedContainer(c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Inspect Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
