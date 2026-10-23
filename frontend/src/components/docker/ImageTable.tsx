import React, { useState } from 'react';
import { Layers, ShieldCheck, AlertTriangle, Trash2, Download, Search } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const ImageTable: React.FC = () => {
  const { images } = useAppState();
  const [search, setSearch] = useState('');

  const filtered = images.filter((img) =>
    img.repository.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d1424]/90 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">Images</h3>
          <p className="text-xs text-slate-400">Cached Docker images & vulnerability scan status</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images..."
              className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <Button
            variant="outline"
            size="xs"
            leftIcon={<Trash2 className="w-3 h-3 text-amber-400" />}
            onClick={() => alert('Pruning unused images simulated in Prototype Mode.')}
          >
            Prune Unused
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#090f1d] text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Repository</th>
              <th className="py-3 px-4">Tag</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Vulnerability Scan</th>
              <th className="py-3 px-4 text-right">Size</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {filtered.map((img) => (
              <tr key={img.id} className="hover:bg-slate-850/60 transition-colors">
                {/* Repository */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white block">{img.repository}</span>
                      <span className="text-[10px] text-slate-400">{img.id}</span>
                    </div>
                  </div>
                </td>

                {/* Tag */}
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-xs">
                    {img.tag}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <Badge
                    variant={img.status === 'In Use' ? 'success' : 'neutral'}
                    size="sm"
                    dot={img.status === 'In Use'}
                  >
                    {img.status}
                  </Badge>
                </td>

                {/* Vulnerability Scan */}
                <td className="py-3.5 px-4">
                  {img.vulnerabilityCount.high > 0 || img.vulnerabilityCount.medium > 0 ? (
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{img.vulnerabilityCount.medium} Med, {img.vulnerabilityCount.low} Low</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>0 Vulnerabilities (Clean)</span>
                    </div>
                  )}
                </td>

                {/* Size */}
                <td className="py-3.5 px-4 text-right text-slate-300 font-semibold">
                  {img.sizeFormatted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
