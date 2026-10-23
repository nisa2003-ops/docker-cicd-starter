import React, { useState } from 'react';
import {
  Search,
  LayoutDashboard,
  GitFork,
  Boxes,
  Terminal,
  Settings,
  Play,
  Square,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActivePage,
    containers,
    pipelineRuns,
    setSelectedPipelineRun,
    setSelectedContainer,
    setIsTriggerModalOpen,
    toggleContainer,
  } = useAppState();

  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const handleClose = () => {
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  const navActions = [
    {
      label: 'Go to Overview Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setActivePage('overview');
        handleClose();
      },
    },
    {
      label: 'Go to CI/CD Pipelines & Visualizer',
      icon: <GitFork className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setActivePage('pipelines');
        handleClose();
      },
    },
    {
      label: 'Go to Docker Containers & Images',
      icon: <Boxes className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setActivePage('containers');
        handleClose();
      },
    },
    {
      label: 'Go to Activity Logs & Real-Time Stream',
      icon: <Terminal className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setActivePage('logs');
        handleClose();
      },
    },
    {
      label: 'Go to Settings & Architecture Spec',
      icon: <Settings className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setActivePage('settings');
        handleClose();
      },
    },
    {
      label: 'Trigger New CI/CD Pipeline Run',
      icon: <Play className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setIsTriggerModalOpen(true);
        handleClose();
      },
    },
  ];

  const filteredNav = navActions.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredContainers = containers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.image.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPipelines = pipelineRuns.filter(
    (p) =>
      p.pipelineName.toLowerCase().includes(query.toLowerCase()) ||
      p.commitHash.toLowerCase().includes(query.toLowerCase()) ||
      p.commitMessage.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Palette Card */}
      <div className="relative w-full max-w-xl bg-[#0d1424] border border-slate-700 rounded-2xl shadow-2xl shadow-cyan-950/40 z-10 overflow-hidden">
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-[#080d19]">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search containers, pipelines..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
          />
          <kbd
            onClick={handleClose}
            className="cursor-pointer text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700"
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-4">
          {/* Navigation & Commands */}
          {filteredNav.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                Quick Actions
              </div>
              <div className="space-y-1">
                {filteredNav.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors text-left"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Containers section */}
          {filteredContainers.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                Containers ({filteredContainers.length})
              </div>
              <div className="space-y-1">
                {filteredContainers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActivePage('containers');
                      setSelectedContainer(c);
                      handleClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Boxes className="w-4 h-4 text-cyan-400" />
                      <span className="font-mono text-cyan-300">{c.name}</span>
                      <span className="text-[10px] text-slate-400">({c.image})</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        c.state === 'running'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {c.state}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pipelines section */}
          {filteredPipelines.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                Pipeline Runs ({filteredPipelines.length})
              </div>
              <div className="space-y-1">
                {filteredPipelines.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePage('pipelines');
                      setSelectedPipelineRun(p);
                      handleClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <GitFork className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-white">{p.pipelineName}</span>
                      <span className="text-[11px] font-mono text-slate-400">#{p.runNumber}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                      {p.commitMessage}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
