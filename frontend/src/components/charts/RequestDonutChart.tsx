import React from 'react';
import { REQUEST_DISTRIBUTION } from '../../services/mockData';

export const RequestDonutChart: React.FC = () => {
  const data = REQUEST_DISTRIBUTION;
  const radius = 54;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDashoffset for each segment
  let cumulativePercent = 0;
  const segments = data.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += item.percentage;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="p-5 rounded-xl bg-[#0d1424]/90 border border-slate-800/80 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-white tracking-wide">Request Distribution</h3>
        <p className="text-xs text-slate-400">By response status code</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto pt-3">
        {/* Circular Donut Ring */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 140 140">
            {/* Background ring track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Segments */}
            {segments.map((seg, idx) => (
              <circle
                key={idx}
                cx="70"
                cy="70"
                r={radius}
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 hover:opacity-80"
              />
            ))}
          </svg>

          {/* Center text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold font-mono text-white leading-none">1.2M</span>
            <span className="text-[11px] font-mono text-slate-400 mt-1">total reqs</span>
          </div>
        </div>

        {/* Legend list */}
        <div className="space-y-2 w-full sm:w-auto">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="text-white font-semibold">{item.percentage}%</span>
                <span className="text-slate-400 text-[11px] w-10">({item.count})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
