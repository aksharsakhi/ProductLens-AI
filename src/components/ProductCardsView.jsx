import React, { useState } from 'react';
import {
  Tag, CheckCircle2, AlertTriangle, Eye, Sparkles, ShieldCheck,
  Zap, ArrowRight, Copy, ExternalLink, Package, Ruler, Thermometer,
  Gauge, Activity
} from 'lucide-react';

const SPEC_ICONS = {
  Material: Package,
  Voltage: Zap,
  'Motor Rating': Activity,
  'Max Pressure': Gauge,
  'Amperage Rating': Zap,
};

function ConfidenceBar({ score }) {
  const color = score >= 90 ? '#10b981' : score >= 75 ? '#f59e0b' : '#f43f5e';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 pipeline-bar" style={{ height: '4px' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color, boxShadow: `0 0 8px ${color}50` }}
        />
      </div>
      <span className="text-[11px] font-mono font-bold" style={{ color }}>{score}%</span>
    </div>
  );
}

function ProductCard({ record, onSelect, index }) {
  const [copied, setCopied] = useState(false);
  const score = parseInt(record.Confidence_Score) || 90;
  const specs = record._extractedSpecsObj || {};
  const conversions = record._conversions || [];

  const handleCopyMPN = () => {
    navigator.clipboard.writeText(record.MPN);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="glass-card rounded-2xl flex flex-col justify-between group relative overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: score >= 90
            ? 'linear-gradient(90deg, #10b981, #06b6d4)'
            : score >= 75
            ? 'linear-gradient(90deg, #f59e0b, #f97316)'
            : 'linear-gradient(90deg, #f43f5e, #e11d48)'
        }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-800/60">
              {record.Product_ID}
            </span>
            {record.Validation_Status === 'VALID' ? (
              <span className="p-1 bg-emerald-950 rounded-full border border-emerald-800/50" title="Valid">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              </span>
            ) : (
              <span className="p-1 bg-amber-950 rounded-full border border-amber-800/50" title="Warning">
                <AlertTriangle className="h-3 w-3 text-amber-400" />
              </span>
            )}
          </div>

          <button
            onClick={handleCopyMPN}
            className="text-[10px] font-mono text-slate-400 hover:text-white bg-slate-900 px-2 py-1 rounded-md border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1"
          >
            <Copy className="h-3 w-3" />
            {copied ? 'Copied!' : record.MPN}
          </button>
        </div>

        {/* Brand & Title */}
        <div className="mb-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em] block mb-0.5">
            {record.Brand_Name}
          </span>
          <h3 className="font-heading font-bold text-sm text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">
            {record.Product_Title}
          </h3>
        </div>

        {/* Confidence Bar */}
        <div className="mb-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
            AI Confidence
          </span>
          <ConfidenceBar score={score} />
        </div>

        {/* UNSPSC Badge */}
        <div className="mb-4 flex items-center gap-2 p-2.5 rounded-xl bg-violet-950/40 border border-violet-800/30">
          <Tag className="h-3.5 w-3.5 text-violet-400 shrink-0" />
          <div>
            <span className="font-mono text-[11px] font-bold text-violet-300 block">{record.UNSPSC_Code}</span>
            <span className="text-[10px] text-slate-400 line-clamp-1">{record.Category_Path}</span>
          </div>
        </div>

        {/* Extracted Specifications Grid */}
        <div className="mb-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-2">
            Extracted Attributes
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(specs).slice(0, 6).map(([key, value], i) => {
              const Icon = SPEC_ICONS[key] || Package;
              return (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-950/70 rounded-lg border border-slate-800/60 text-[11px]"
                >
                  <Icon className="h-3 w-3 text-slate-500 shrink-0" />
                  <span className="text-slate-300 truncate">{value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unit Conversions */}
        {conversions.length > 0 && (
          <div className="mb-3">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
              Physics Normalizations
            </span>
            <div className="space-y-1">
              {conversions.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span className="text-amber-400">{c.imperial}</span>
                  <ArrowRight className="h-3 w-3 text-slate-600" />
                  <span className="text-cyan-400">{c.metric}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-800/60 flex items-center justify-between bg-slate-950/30">
        <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
          {record.Source_Reference}
        </span>
        <button
          onClick={() => onSelect(record)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-600/10 hover:bg-indigo-600 hover:text-white border border-indigo-500/20 hover:border-indigo-500 transition-all"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Inspect AI</span>
        </button>
      </div>
    </div>
  );
}

export default function ProductCardsView({ records = [], onSelectRecord }) {
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = filterStatus === 'all'
    ? records
    : records.filter(r => r.Validation_Status === filterStatus);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Filter Bar */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: 'All Products', count: records.length },
          { id: 'VALID', label: 'Commerce Ready', count: records.filter(r => r.Validation_Status === 'VALID').length },
          { id: 'WARNING', label: 'Needs Review', count: records.filter(r => r.Validation_Status === 'WARNING').length },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilterStatus(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              filterStatus === f.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 bg-slate-900/60 border border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{f.label}</span>
            <span className="font-mono text-[10px] opacity-70">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger-children">
        {filtered.map((rec, idx) => (
          <ProductCard key={rec.Product_ID} record={rec} onSelect={onSelectRecord} index={idx} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No products match the selected filter.</p>
        </div>
      )}
    </div>
  );
}
