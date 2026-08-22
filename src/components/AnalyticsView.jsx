import React from 'react';
import { BarChart3, PieChart, ShieldCheck, Tag, RefreshCw, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

export default function AnalyticsView({ records = [] }) {
  const total = records.length;
  
  const valid = records.filter(r => r.Validation_Status === 'VALID').length;
  const warning = records.filter(r => r.Validation_Status === 'WARNING').length;
  const error = records.filter(r => r.Validation_Status === 'CRITICAL_ERROR').length;

  const validPct = total > 0 ? Math.round((valid / total) * 100) : 0;
  const warnPct = total > 0 ? Math.round((warning / total) * 100) : 0;

  // UNSPSC categories distribution
  const unspscMap = {};
  records.forEach(r => {
    const code = `${r.UNSPSC_Code} (${r.Category_Path.split('>').pop()?.trim() || 'General'})`;
    unspscMap[code] = (unspscMap[code] || 0) + 1;
  });

  // Brands distribution
  const brandMap = {};
  records.forEach(r => {
    const b = r.Brand_Name || 'Generic';
    brandMap[b] = (brandMap[b] || 0) + 1;
  });

  // Imperial to Metric Conversions total
  const conversions = records.reduce((acc, r) => acc + (r._conversions?.length || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            Catalog Quality & Intelligence Analytics (BI)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time quality scoring, taxonomy coverage, unit conversions, and validation audit metrics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 bg-blue-950/80 border border-blue-800 rounded-xl text-xs font-mono text-blue-300">
            {total} SKUs Analyzed
          </div>
          <div className="px-3 py-1.5 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs font-mono text-emerald-300">
            {validPct}% High Precision
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Health Distribution */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Validation Health Status
            </h3>
            <span className="text-[11px] font-mono text-slate-400">{valid}/{total} Valid</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Valid & Commerce Ready
                </span>
                <span className="font-mono text-slate-300">{valid} ({validPct}%)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${validPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-400 font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Minor Attribute Warnings
                </span>
                <span className="font-mono text-slate-300">{warning} ({warnPct}%)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${warnPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: UNSPSC Taxonomy Breakdown */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Tag className="h-4 w-4 text-purple-400" />
              UNSPSC Commodity Categories
            </h3>
            <span className="text-[11px] font-mono text-purple-300">Auto-Mapped</span>
          </div>

          <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
            {Object.entries(unspscMap).map(([cat, count], idx) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-mono text-[11px] truncate max-w-[200px]">{cat}</span>
                    <span className="text-purple-400 font-mono font-bold">{count} SKUs</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Brand Distribution */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-400" />
              Ingested Manufacturers & Brands
            </h3>
            <span className="text-[11px] font-mono text-blue-300">{Object.keys(brandMap).length} Brands</span>
          </div>

          <div className="space-y-2 max-h-44 overflow-y-auto">
            {Object.entries(brandMap).map(([brand, count], idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-medium text-slate-200">{brand}</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-950 text-blue-400 font-mono text-[11px]">
                  {count} SKUs
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
