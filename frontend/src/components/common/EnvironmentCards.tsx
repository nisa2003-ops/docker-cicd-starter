import React from 'react';
import { Server, Copy, Check, Layers, ExternalLink } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { Badge } from './Badge';

export const EnvironmentCards: React.FC = () => {
  const { environments } = useAppState();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          Deployed Environments & Fleet Status
        </h3>
        <span className="text-[11px] font-mono text-cyan-400">Multi-tier runtime</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {environments.map((env) => {
          const isCopied = copiedId === env.id;
          return (
            <div
              key={env.id}
              className={`p-4 rounded-xl border transition-all duration-200 bg-[#0d1424]/90 ${
                env.isProd
                  ? 'border-emerald-500/30 hover:border-emerald-500/50 shadow-lg shadow-emerald-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-sm font-semibold text-white tracking-tight">
                  Environment - {env.envName}
                </span>
                <Badge
                  variant={env.isProd ? 'success' : 'neutral'}
                  size="sm"
                  dot={env.isProd}
                >
                  {env.isProd ? 'Production' : 'Non-Prod'}
                </Badge>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-400 mb-4">
                <div className="text-[11px]">
                  Last deployed by <span className="text-slate-200">{env.lastDeployedBy}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{env.instancesCount} active instances</span>
                </div>
              </div>

              {/* Tag & Copy footer matching Image 4 */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="font-mono text-xs text-cyan-300 font-semibold truncate">
                  {env.tag}
                </span>
                <button
                  onClick={() => handleCopy(env.id, env.tag)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Copy release tag"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
