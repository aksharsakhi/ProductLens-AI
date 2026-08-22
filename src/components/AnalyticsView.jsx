import React, { useState, useMemo } from 'react';
import {
  BarChart3, PieChart, ShieldCheck, Tag, RefreshCw, CheckCircle2,
  AlertTriangle, Cpu, TrendingUp, Activity, Layers, ArrowUpRight,
  ArrowDownRight, Info
} from 'lucide-react';

/* ─── SVG Bar Chart Component ─── */
function BarChart({ data, barColor = '#6366f1', height = 160 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const barWidth = Math.min(36, Math.floor(280 / data.length) - 8);

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${data.length * (barWidth + 10) + 20} ${height}`}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(pct => (
        <line
          key={pct}
          x1="0" y1={height - 24 - (height - 40) * pct}
          x2={data.length * (barWidth + 10) + 20} y2={height - 24 - (height - 40) * pct}
          stroke="rgba(255,255,255,0.03)" strokeWidth="1"
        />
      ))}

      {data.map((d, i) => {
        const barH = (d.value / max) * (height - 40);
        const x = i * (barWidth + 10) + 10;
        const y = height - 24 - barH;
        return (
          <g key={i}>
            <rect
              x={x} y={y} width={barWidth} height={barH}
              rx="4" fill={barColor} opacity="0.8"
              className="transition-all duration-500"
            >
              <animate attributeName="height" from="0" to={barH} dur="0.6s" fill="freeze" />
              <animate attributeName="y" from={height - 24} to={y} dur="0.6s" fill="freeze" />
            </rect>
            {/* Value label */}
            <text
              x={x + barWidth / 2} y={y - 6}
              textAnchor="middle" fontSize="10" fontWeight="700"
              fill="rgba(255,255,255,0.7)" fontFamily="JetBrains Mono, monospace"
            >
              {d.value}
            </text>
            {/* Category label */}
            <text
              x={x + barWidth / 2} y={height - 6}
              textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.35)"
              fontFamily="Inter, sans-serif"
            >
              {d.label.length > 8 ? d.label.slice(0, 7) + '…' : d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── SVG Donut Chart ─── */
function DonutWithLegend({ segments, size = 140 }) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} className="shrink-0" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
        {segments.map((seg, i) => {
          const pct = total > 0 ? seg.value / total : 0;
          const dashLen = circumference * pct;
          const offset = circumference * accumulatedOffset;
          accumulatedOffset += pct;
          return (
            <circle
              key={i}
              cx={size/2} cy={size/2} r={radius}
              fill="none" stroke={seg.color} strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={-offset}
              className="transition-all duration-700"
            />
          );
        })}
        {/* Center text */}
        <text
          x={size/2} y={size/2 - 4} textAnchor="middle" dominantBaseline="central"
          fontSize="22" fontWeight="800" fill="white" fontFamily="Outfit, sans-serif"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
        >
          {total}
        </text>
        <text
          x={size/2} y={size/2 + 14} textAnchor="middle" dominantBaseline="central"
          fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="Inter, sans-serif"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
        >
          Total SKUs
        </text>
      </svg>

      <div className="space-y-2 flex-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-sm" style={{ background: seg.color }} />
              <span className="text-slate-300">{seg.label}</span>
            </div>
            <span className="font-mono text-slate-400 font-bold">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Horizontal Bar ─── */
function HBarChart({ items, maxVal }) {
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const pct = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
        return (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 truncate max-w-[65%]">{item.label}</span>
              <span className="font-mono text-slate-400 font-bold">{item.value} SKUs</span>
            </div>
            <div className="pipeline-bar" style={{ height: '6px' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: item.color || 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  boxShadow: `0 0 8px ${item.color || '#6366f1'}40`
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsView({ records = [] }) {
  const total = records.length;

  const stats = useMemo(() => {
    const valid = records.filter(r => r.Validation_Status === 'VALID').length;
    const warning = records.filter(r => r.Validation_Status === 'WARNING').length;
    const critical = records.filter(r => r.Validation_Status === 'CRITICAL_ERROR').length;
    const avgScore = total > 0 ? Math.round(records.reduce((a, r) => a + (r._qualityScore || 90), 0) / total) : 0;
    const conversions = records.reduce((a, r) => a + (r._conversions?.length || 0), 0);
    const unspscMapped = records.filter(r => r.UNSPSC_Code && r.UNSPSC_Code !== '31160000').length;

    // UNSPSC distribution
    const catMap = {};
    records.forEach(r => {
      const cat = r.Category_Path?.split('>').pop()?.trim() || 'Uncategorized';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });

    // Brand distribution
    const brandMap = {};
    records.forEach(r => {
      const b = r.Brand_Name || 'Generic';
      brandMap[b] = (brandMap[b] || 0) + 1;
    });

    // Conversion type distribution
    const convTypeMap = {};
    records.forEach(r => {
      (r._conversions || []).forEach(c => {
        convTypeMap[c.type] = (convTypeMap[c.type] || 0) + 1;
      });
    });

    // Score distribution buckets
    const scoreBuckets = { '90-100': 0, '80-89': 0, '70-79': 0, '<70': 0 };
    records.forEach(r => {
      const s = r._qualityScore || 90;
      if (s >= 90) scoreBuckets['90-100']++;
      else if (s >= 80) scoreBuckets['80-89']++;
      else if (s >= 70) scoreBuckets['70-79']++;
      else scoreBuckets['<70']++;
    });

    return { valid, warning, critical, avgScore, conversions, unspscMapped, catMap, brandMap, convTypeMap, scoreBuckets };
  }, [records]);

  const catColors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#6d28d9'];
  const brandColors = ['#3b82f6', '#06b6d4', '#0ea5e9', '#38bdf8', '#7dd3fc'];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Analytics Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-400" />
              Business Intelligence & Catalog Quality Analytics
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Comprehensive analysis across {total} products with real-time scoring and distribution insights.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-emerald flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats.avgScore}% Avg Score
            </span>
            <span className="badge badge-blue">
              {stats.conversions} Conversions
            </span>
          </div>
        </div>
      </div>

      {/* Top Row: Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-children">
        {[
          { label: 'Avg Quality', value: `${stats.avgScore}%`, icon: ShieldCheck, color: '#10b981', delta: '+38%', up: true },
          { label: 'UNSPSC Mapped', value: `${total > 0 ? Math.round((stats.unspscMapped / total) * 100) : 0}%`, icon: Tag, color: '#8b5cf6', delta: `${stats.unspscMapped}/${total}`, up: true },
          { label: 'Unit Conversions', value: stats.conversions, icon: RefreshCw, color: '#f59e0b', delta: 'Imperial→SI', up: true },
          { label: 'Error Rate', value: `${total > 0 ? Math.round((stats.critical / total) * 100) : 0}%`, icon: AlertTriangle, color: '#f43f5e', delta: `${stats.critical} flagged`, up: false },
        ].map((m, i) => (
          <div key={i} className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-400 font-medium">{m.label}</span>
              <m.icon className="h-4 w-4" style={{ color: m.color }} />
            </div>
            <span className="font-heading font-extrabold text-2xl text-white block">{m.value}</span>
            <div className="flex items-center gap-1 mt-1">
              {m.up ? (
                <ArrowUpRight className="h-3 w-3 text-emerald-400" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-rose-400" />
              )}
              <span className={`text-[10px] font-medium ${m.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {m.delta}
              </span>
            </div>
            <div className="metric-glow" style={{ background: m.color }} />
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Validation Health Donut */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2 mb-5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Validation Health Distribution
          </h3>
          <DonutWithLegend
            segments={[
              { label: 'Valid & Commerce Ready', value: stats.valid, color: '#10b981' },
              { label: 'Warning: Review Needed', value: stats.warning, color: '#f59e0b' },
              { label: 'Critical Errors', value: stats.critical, color: '#f43f5e' },
            ]}
          />
        </div>

        {/* Quality Score Distribution */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2 mb-5">
            <Activity className="h-4 w-4 text-indigo-400" />
            Confidence Score Distribution
          </h3>
          <BarChart
            data={Object.entries(stats.scoreBuckets).map(([label, value]) => ({ label, value }))}
            barColor="#6366f1"
            height={140}
          />
        </div>

        {/* UNSPSC Category Breakdown */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2 mb-5">
            <Tag className="h-4 w-4 text-violet-400" />
            UNSPSC Commodity Categories
          </h3>
          <HBarChart
            items={Object.entries(stats.catMap)
              .sort((a, b) => b[1] - a[1])
              .map(([label, value], i) => ({ label, value, color: catColors[i % catColors.length] }))}
            maxVal={Math.max(...Object.values(stats.catMap), 1)}
          />
        </div>

        {/* Brand Distribution */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2 mb-5">
            <Cpu className="h-4 w-4 text-blue-400" />
            Manufacturer Brand Analytics
          </h3>
          <HBarChart
            items={Object.entries(stats.brandMap)
              .sort((a, b) => b[1] - a[1])
              .map(([label, value], i) => ({ label, value, color: brandColors[i % brandColors.length] }))}
            maxVal={Math.max(...Object.values(stats.brandMap), 1)}
          />
        </div>

      </div>

      {/* Conversion Types Breakdown */}
      {Object.keys(stats.convTypeMap).length > 0 && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2 mb-4">
            <RefreshCw className="h-4 w-4 text-amber-400" />
            Physics Unit Conversion Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(stats.convTypeMap).map(([type, count], i) => {
              const labels = {
                PRESSURE: { name: 'Pressure', sub: 'PSI → Bar', color: '#f59e0b' },
                TEMPERATURE: { name: 'Temperature', sub: '°F → °C', color: '#ef4444' },
                DIMENSION: { name: 'Dimension', sub: 'in → mm', color: '#3b82f6' },
                FLOW: { name: 'Flow Rate', sub: 'GPM → LPM', color: '#06b6d4' },
                POWER: { name: 'Power', sub: 'HP → kW', color: '#8b5cf6' },
              };
              const l = labels[type] || { name: type, sub: '', color: '#94a3b8' };
              return (
                <div key={i} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-center">
                  <span className="font-heading font-extrabold text-2xl text-white block">{count}</span>
                  <span className="text-xs font-bold block mt-1" style={{ color: l.color }}>{l.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">{l.sub}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
