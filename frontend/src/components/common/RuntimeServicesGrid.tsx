import React from 'react';
import { Database, Server, Cpu, Layers } from 'lucide-react';
import { INITIAL_SERVICES } from '../../services/mockData';
import { Sparkline } from '../charts/Sparkline';
import { Badge } from './Badge';

export const RuntimeServicesGrid: React.FC = () => {
  const services = INITIAL_SERVICES;

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'mysql':
        return <Database className="w-4 h-4 text-cyan-400" />;
      case 'node':
        return <Server className="w-4 h-4 text-emerald-400" />;
      case 'python':
        return <Cpu className="w-4 h-4 text-amber-400" />;
      default:
        return <Layers className="w-4 h-4 text-purple-400" />;
    }
  };

  const getServiceBorder = (idx: number) => {
    const borders = [
      'border-cyan-500/20 hover:border-cyan-500/40',
      'border-purple-500/20 hover:border-purple-500/40',
      'border-emerald-500/20 hover:border-emerald-500/40',
      'border-amber-500/20 hover:border-amber-500/40',
    ];
    return borders[idx % borders.length];
  };

  const getSparklineColor = (idx: number) => {
    const colors = ['#06b6d4', '#a855f7', '#10b981', '#f59e0b'];
    return colors[idx % colors.length];
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          Runtime & Service Instances
        </h3>
        <span className="text-[11px] font-mono text-emerald-400">All 4 nodes active</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((srv, idx) => (
          <div
            key={srv.id}
            className={`p-4 rounded-xl border bg-[#0d1424]/90 backdrop-blur-md shadow-lg transition-all duration-200 ${getServiceBorder(
              idx
            )} flex flex-col justify-between`}
          >
            {/* Header: Icon, Name, Version, Active Badge */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  {getServiceIcon(srv.type)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-tight">{srv.name}</h4>
                  <span className="text-[11px] font-mono text-slate-400">{srv.version}</span>
                </div>
              </div>

              <Badge variant="success" size="sm" dot>
                Active
              </Badge>
            </div>

            {/* Metrics 2x2 grid matching Image 1 */}
            <div className="grid grid-cols-2 gap-2 my-2 py-2 border-y border-slate-800/80 font-mono text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">
                  {srv.metricLabel1}
                </span>
                <span className="text-white font-semibold text-xs mt-0.5 block truncate">
                  {srv.metricValue1}
                </span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase block">
                  {srv.metricLabel2}
                </span>
                <span className="text-white font-semibold text-xs mt-0.5 block truncate">
                  {srv.metricValue2}
                </span>
              </div>

              <div className="mt-1">
                <span className="text-slate-400 text-[10px] uppercase block">
                  {srv.metricLabel3}
                </span>
                <span className="text-amber-300 font-semibold text-xs mt-0.5 block truncate">
                  {srv.metricValue3}
                </span>
              </div>

              <div className="mt-1">
                <span className="text-slate-400 text-[10px] uppercase block">
                  {srv.metricLabel4}
                </span>
                <span className="text-slate-200 font-semibold text-xs mt-0.5 block truncate">
                  {srv.metricValue4}
                </span>
              </div>
            </div>

            {/* Sparkline curve at bottom matching Image 1 */}
            <div className="pt-2">
              <Sparkline data={srv.sparkline} color={getSparklineColor(idx)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
