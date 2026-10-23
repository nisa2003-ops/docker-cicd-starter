import React, { useState } from 'react';
import { INITIAL_METRICS_TIMELINE } from '../../services/mockData';

export const ResourceAreaChart: React.FC = () => {
  const [activeSeries, setActiveSeries] = useState<'all' | 'http' | 'https' | 'api'>('all');
  const data = INITIAL_METRICS_TIMELINE;

  const width = 640;
  const height = 180;
  const paddingBottom = 25;
  const chartHeight = height - paddingBottom;

  // Normalize CPU & Memory & Network to 0..100
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - 40) + 20;
    // Layer 1: HTTPS (Cyan)
    const yHttps = chartHeight - (d.networkTx / 2500) * (chartHeight - 20) - 10;
    // Layer 2: HTTP (Purple)
    const yHttp = chartHeight - (d.networkRx / 1600) * (chartHeight - 35) - 15;
    // Layer 3: API (Blue)
    const yApi = chartHeight - (d.cpu / 100) * (chartHeight - 40) - 20;
    return { ...d, x, yHttps, yHttp, yApi };
  });

  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = arr[i - 1];
      const cx1 = prev.x + (point.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (point.x - prev.x) / 2;
      const cy2 = point.y;
      return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${point.x},${point.y}`;
    }, '');
  };

  const httpsCurve = generateSmoothPath(points.map((p) => ({ x: p.x, y: p.yHttps })));
  const httpCurve = generateSmoothPath(points.map((p) => ({ x: p.x, y: p.yHttp })));

  const httpsArea = `${httpsCurve} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`;
  const httpArea = `${httpCurve} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`;

  return (
    <div className="p-5 rounded-xl bg-[#0d1424]/90 border border-slate-800/80">
      {/* Header with Title and Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">Traffic Overview</h3>
          <p className="text-xs text-slate-400">Requests per hour · Last 24h</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            onClick={() => setActiveSeries(activeSeries === 'https' ? 'all' : 'https')}
            className={`flex items-center gap-1.5 transition-opacity ${
              activeSeries === 'https' || activeSeries === 'all' ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">HTTPS</span>
          </button>

          <button
            onClick={() => setActiveSeries(activeSeries === 'http' ? 'all' : 'http')}
            className={`flex items-center gap-1.5 transition-opacity ${
              activeSeries === 'http' || activeSeries === 'all' ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span className="text-slate-300">HTTP</span>
          </button>

          <button
            onClick={() => setActiveSeries(activeSeries === 'api' ? 'all' : 'api')}
            className={`flex items-center gap-1.5 transition-opacity ${
              activeSeries === 'api' || activeSeries === 'all' ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <span className="text-slate-300">API</span>
          </button>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 select-none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1="20"
            y1={chartHeight * 0.25}
            x2={width - 20}
            y2={chartHeight * 0.25}
            stroke="#1e293b"
            strokeDasharray="4 4"
          />
          <line
            x1="20"
            y1={chartHeight * 0.5}
            x2={width - 20}
            y2={chartHeight * 0.5}
            stroke="#1e293b"
            strokeDasharray="4 4"
          />
          <line
            x1="20"
            y1={chartHeight * 0.75}
            x2={width - 20}
            y2={chartHeight * 0.75}
            stroke="#1e293b"
            strokeDasharray="4 4"
          />

          {/* Y Axis Labels */}
          <text x="22" y={chartHeight * 0.25 - 4} fill="#64748b" fontSize="10" fontFamily="monospace">
            50k
          </text>
          <text x="22" y={chartHeight * 0.5 - 4} fill="#64748b" fontSize="10" fontFamily="monospace">
            25k
          </text>
          <text x="22" y={chartHeight - 4} fill="#64748b" fontSize="10" fontFamily="monospace">
            0
          </text>

          {/* HTTP Area & Curve */}
          {(activeSeries === 'all' || activeSeries === 'http') && (
            <>
              <path d={httpArea} fill="url(#purpleGrad)" />
              <path
                d={httpCurve}
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </>
          )}

          {/* HTTPS Area & Curve */}
          {(activeSeries === 'all' || activeSeries === 'https') && (
            <>
              <path d={httpsArea} fill="url(#cyanGrad)" />
              <path
                d={httpsCurve}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Highlight points on curve */}
              {points
                .filter((_, idx) => idx % 3 === 0 || idx === points.length - 1)
                .map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.yHttps}
                    r="3.5"
                    fill="#080c14"
                    stroke="#22d3ee"
                    strokeWidth="2"
                  />
                ))}
            </>
          )}

          {/* X Axis Timeline Labels */}
          {points
            .filter((_, idx) => idx % 2 === 0 || idx === points.length - 1)
            .map((p, idx) => (
              <text
                key={idx}
                x={p.x}
                y={height - 6}
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {p.timestamp}
              </text>
            ))}
        </svg>
      </div>
    </div>
  );
};
