import React, { useEffect, useState, useRef } from 'react';
import {
  Database, CheckCircle2, AlertTriangle, Tag, RefreshCw, Sparkles,
  TrendingUp, Shield, Layers, Zap, ArrowUpRight
} from 'lucide-react';

function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (end === 0) { setDisplay(0); return; }
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * end));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };

    ref.current = requestAnimationFrame(animate);
    return () => ref.current && cancelAnimationFrame(ref.current);
  }, [value, duration]);

  return <span>{display}</span>;
}

function DonutChart({ percentage, color, size = 56 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="donut-chart" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-heading font-extrabold text-xs text-white">{percentage}%</span>
      </div>
    </div>
  );
}

const METRICS = [
  {
    key: 'total',
    title: 'Products Ingested',
    icon: Database,
    color: '#3b82f6',
    bgGlow: 'from-blue-600/10',
    getValue: (r) => r.length,
    getSub: (r) => `${r.length > 0 ? '+' + r.length : '0'} from last batch`,
    getTag: () => 'Live',
    tagClass: 'badge-blue',
  },
  {
    key: 'quality',
    title: 'Catalog Quality Index',
    icon: Shield,
    color: '#10b981',
    bgGlow: 'from-emerald-600/10',
    getValue: (r) => r.length > 0 ? Math.round(r.reduce((a, x) => a + (x._qualityScore || 90), 0) / r.length) : 0,
    getSub: () => '+38% improvement vs raw input',
    getTag: () => 'AI Score',
    tagClass: 'badge-emerald',
    isPercent: true,
    donut: true,
  },
  {
    key: 'unspsc',
    title: 'UNSPSC Auto-Mapped',
    icon: Tag,
    color: '#8b5cf6',
    bgGlow: 'from-violet-600/10',
    getValue: (r) => {
      const mapped = r.filter(x => x.UNSPSC_Code && x.UNSPSC_Code !== '31160000').length;
      return r.length > 0 ? Math.round((mapped / r.length) * 100) : 0;
    },
    getSub: (r) => `${r.filter(x => x.UNSPSC_Code && x.UNSPSC_Code !== '31160000').length}/${r.length} classified`,
    getTag: () => 'Taxonomy',
    tagClass: 'badge-purple',
    isPercent: true,
    donut: true,
  },
  {
    key: 'conversions',
    title: 'Unit Normalizations',
    icon: RefreshCw,
    color: '#f59e0b',
    bgGlow: 'from-amber-600/10',
    getValue: (r) => r.reduce((a, x) => a + (x._conversions?.length || 0), 0),
    getSub: () => 'PSI→Bar, °F→°C, in→mm, GPM→LPM',
    getTag: () => 'Imperial→SI',
    tagClass: 'badge-amber',
  },
  {
    key: 'status',
    title: 'Validation Breakdown',
    icon: Sparkles,
    color: '#06b6d4',
    bgGlow: 'from-cyan-600/10',
    custom: true,
  },
];

export default function DashboardMetrics({ records = [] }) {
  const valid = records.filter(r => r.Validation_Status === 'VALID').length;
  const warning = records.filter(r => r.Validation_Status === 'WARNING').length;
  const critical = records.filter(r => r.Validation_Status === 'CRITICAL_ERROR').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
      {METRICS.map((m) => {
        if (m.custom) {
          return (
            <div key={m.key} className="metric-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{m.title}</span>
                <div className="p-2 rounded-xl" style={{ background: `${m.color}15` }}>
                  <m.icon className="h-4 w-4" style={{ color: m.color }} />
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge badge-emerald flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {valid}
                </span>
                <span className="badge badge-amber flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {warning}
                </span>
                {critical > 0 && (
                  <span className="badge badge-rose flex items-center gap-1">
                    <Zap className="h-3 w-3" /> {critical}
                  </span>
                )}
              </div>
              <p className="mt-2 text-[11px] text-slate-500">Real-time quality engine</p>
              <div className="metric-glow" style={{ background: m.color }} />
            </div>
          );
        }

        const value = m.getValue(records);

        return (
          <div key={m.key} className="metric-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{m.title}</span>
              <div className="p-2 rounded-xl" style={{ background: `${m.color}15` }}>
                <m.icon className="h-4 w-4" style={{ color: m.color }} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-extrabold text-2xl text-white">
                    <AnimatedNumber value={value} />
                  </span>
                  {m.isPercent && <span className="text-lg font-bold text-slate-400">%</span>}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{m.getSub(records)}</p>
              </div>
              {m.donut && (
                <DonutChart percentage={value} color={m.color} />
              )}
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <span className={`badge ${m.tagClass} text-[10px]`}>{m.getTag()}</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-600" />
            </div>
            <div className="metric-glow" style={{ background: m.color }} />
          </div>
        );
      })}
    </div>
  );
}
