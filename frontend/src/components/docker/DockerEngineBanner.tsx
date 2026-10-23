import React from 'react';
import { Play, Square, Cpu, HardDrive, Layers, Server } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { Button } from '../common/Button';

export const DockerEngineBanner: React.FC = () => {
  const { engineInfo, containers, startAllContainers, stopAllContainers } = useAppState();

  const stoppedCount = containers.filter((c) => c.state !== 'running').length;
  const runningCount = containers.filter((c) => c.state === 'running').length;

  return (
    <div className="p-4 rounded-xl bg-[#0d1424]/90 border border-slate-800/80 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Docker Engine Spec */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-wide">
              Docker Engine
            </span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/25">
              v{engineInfo.version}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-mono text-slate-400 mt-0.5">
            <span className="text-emerald-400 font-semibold">
              {runningCount}/{containers.length} running
            </span>
            <span>·</span>
            <span>{engineInfo.imagesCount} images</span>
            <span>·</span>
            <span>{engineInfo.architecture}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions matching Image 3 */}
      <div className="flex items-center gap-2.5 w-full md:w-auto">
        <Button
          variant="secondary"
          size="sm"
          onClick={startAllContainers}
          disabled={stoppedCount === 0}
          leftIcon={<Play className="w-3.5 h-3.5 fill-current text-emerald-400" />}
          className="flex-1 md:flex-none text-xs"
        >
          Start All Stopped ({stoppedCount})
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={stopAllContainers}
          disabled={runningCount === 0}
          leftIcon={<Square className="w-3.5 h-3.5 fill-current text-rose-400" />}
          className="flex-1 md:flex-none text-xs text-rose-300 hover:text-rose-200"
        >
          Stop All Running ({runningCount})
        </Button>
      </div>
    </div>
  );
};
