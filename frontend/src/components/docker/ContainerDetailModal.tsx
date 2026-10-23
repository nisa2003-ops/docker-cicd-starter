import React from 'react';
import {
  Boxes,
  Cpu,
  HardDrive,
  Network,
  Clock,
  Terminal,
  Play,
  Square,
  RotateCw,
  Copy,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const ContainerDetailModal: React.FC = () => {
  const { selectedContainer, setSelectedContainer, toggleContainer } = useAppState();

  if (!selectedContainer) return null;
  const c = selectedContainer;
  const isRunning = c.state === 'running';

  return (
    <Modal
      isOpen={!!selectedContainer}
      onClose={() => setSelectedContainer(null)}
      title={c.name}
      subtitle={`Container ID: ${c.id} · Image: ${c.image}:${c.tag}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#090f1d] border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">State</span>
            <div className="mt-1">
              <Badge variant={isRunning ? 'success' : 'neutral'} size="sm" dot={isRunning}>
                {c.state.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase">CPU Load</span>
            <span className="text-cyan-400 font-semibold text-sm mt-1 block">
              {c.cpuPercent}%
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Memory Allocated</span>
            <span className="text-purple-400 font-semibold text-sm mt-1 block">
              {c.memoryUsageMb} MB
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase">IP Address</span>
            <span className="text-slate-200 font-semibold text-xs mt-1 block">
              {c.ipAddress}
            </span>
          </div>
        </div>

        {/* Command & Entrypoint */}
        <div>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono block mb-1.5">
            Command / Entrypoint
          </span>
          <div className="p-3 rounded-lg bg-black/60 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center justify-between">
            <span className="truncate">{c.command}</span>
            <button
              onClick={() => navigator.clipboard?.writeText(c.command)}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Copy Command"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Port Mappings */}
        <div>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono block mb-1.5">
            Port Bindings
          </span>
          <div className="flex flex-wrap gap-2">
            {c.ports.length > 0 ? (
              c.ports.map((p, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-[#090f1d] border border-cyan-500/30 text-cyan-300 text-xs font-mono"
                >
                  {p}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 font-mono">No host port bindings</span>
            )}
          </div>
        </div>

        {/* Environment Variables */}
        <div>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono block mb-1.5">
            Environment Variables ({Object.keys(c.env).length})
          </span>
          <div className="bg-[#090f1d] border border-slate-800 rounded-xl divide-y divide-slate-850 max-h-40 overflow-y-auto font-mono text-xs">
            {Object.entries(c.env).map(([key, val]) => (
              <div key={key} className="p-2.5 flex items-center justify-between gap-4">
                <span className="text-cyan-400 font-semibold">{key}</span>
                <span className="text-slate-300 truncate max-w-xs">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mounted Volumes */}
        <div>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono block mb-1.5">
            Volume Mounts
          </span>
          <div className="space-y-1">
            {c.volumes.map((v, idx) => (
              <div
                key={idx}
                className="p-2 rounded bg-[#090f1d] border border-slate-800 text-xs font-mono text-slate-300 truncate"
              >
                {v}
              </div>
            ))}
          </div>
        </div>

        {/* Lifecycle Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {isRunning ? (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => toggleContainer(c.id, 'stop')}
                  leftIcon={<Square className="w-3.5 h-3.5 fill-current" />}
                >
                  Stop Container
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleContainer(c.id, 'restart')}
                  leftIcon={<RotateCw className="w-3.5 h-3.5" />}
                >
                  Restart
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => toggleContainer(c.id, 'start')}
                leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
              >
                Start Container
              </Button>
            )}
          </div>

          <Button variant="secondary" size="sm" onClick={() => setSelectedContainer(null)}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
