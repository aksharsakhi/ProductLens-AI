import React, { useState } from 'react';
import { Tag, CheckCircle2, AlertTriangle, Eye, Sparkles, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export default function ProductCardsView({ records = [], onSelectRecord }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {records.map((rec) => {
        const score = parseInt(rec.Confidence_Score) || 90;
        const specs = rec._raw ? rec.Primary_Specifications.split(' | ') : [];

        return (
          <div
            key={rec.Product_ID}
            className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-blue-500/40 transition-all hover:scale-[1.01] group relative"
          >
            {/* Card Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-lg border border-blue-800">
                  {rec.Product_ID}
                </span>

                <div className="flex items-center space-x-2">
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    score >= 90 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {score}% Confidence
                  </span>

                  {rec.Validation_Status === 'VALID' ? (
                    <span className="text-emerald-400 p-1 bg-emerald-950 rounded-full">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="text-amber-400 p-1 bg-amber-950 rounded-full">
                      <AlertTriangle className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Brand */}
              <div className="mb-3">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  {rec.Brand_Name} • MPN: {rec.MPN}
                </span>
                <h3 className="font-heading font-bold text-sm text-white group-hover:text-blue-300 transition-colors mt-0.5 line-clamp-2">
                  {rec.Product_Title}
                </h3>
              </div>

              {/* Category Breadcrumb */}
              <div className="mb-4 flex items-center space-x-1.5 text-xs text-purple-300 bg-purple-950/60 p-2 rounded-xl border border-purple-900/60">
                <Tag className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span className="font-mono text-[11px] font-bold">UNSPSC {rec.UNSPSC_Code}</span>
                <span className="text-slate-400 text-[10px] truncate">• {rec.Category_Path.split('>').pop()}</span>
              </div>

              {/* Specifications Pill Grid */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Extracted Features</span>
                <div className="flex flex-wrap gap-1.5">
                  {specs.slice(0, 4).map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-slate-950 text-slate-300 rounded-md text-[11px] font-mono border border-slate-800"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono truncate max-w-[170px]">
                {rec.Source_Reference}
              </span>

              <button
                onClick={() => onSelectRecord(rec)}
                className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-xl text-xs font-medium border border-blue-500/30 transition-all flex items-center gap-1.5"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Audit AI</span>
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}
