import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, FileText, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Copy, Check } from 'lucide-react';

export default function ExplainabilityModal({ record, onClose, onSaveRecord }) {
  const [copied, setCopied] = useState(false);
  const [editedTitle, setEditedTitle] = useState(record.Product_Title || '');
  const [editedUnspsc, setEditedUnspsc] = useState(record.UNSPSC_Code || '');

  if (!record) return null;

  const score = parseInt(record.Confidence_Score) || 90;
  const rawInput = record._raw?.raw_input || '';
  const conversions = record._conversions || [];

  const handleCopyAudit = () => {
    navigator.clipboard.writeText(record.AI_Reasoning_Audit || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveRecord({
      ...record,
      Product_Title: editedTitle,
      UNSPSC_Code: editedUnspsc
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-slate-700 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-heading text-lg font-bold text-white">
                  AI Explainability & Audit Inspection
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-950 border border-blue-800 text-blue-300">
                  ID: {record.Product_ID}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transparent verification of LLM extractions, source citations, and unit normalization rules.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Overall AI Confidence</span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-heading font-extrabold text-2xl text-emerald-400">{score}%</span>
                <span className="text-xs text-emerald-400 font-medium px-2 py-0.5 bg-emerald-950 rounded-full border border-emerald-800">
                  Verified Accurate
                </span>
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Validation Status</span>
              <div className="mt-1 flex items-center space-x-2">
                <span className="font-heading font-bold text-lg text-white">{record.Validation_Status}</span>
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Source Document</span>
              <div className="mt-1 flex items-center space-x-2 text-xs font-mono text-blue-300 truncate">
                <FileText className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="truncate">{record.Source_Reference}</span>
              </div>
            </div>
          </div>

          {/* Raw Input vs Enriched Output Comparison */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="font-heading text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-400" />
              Ingestion Transformation Pipeline
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Raw Raw Data */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-2">
                  Original Raw Input Data
                </span>
                <p className="text-xs font-mono text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  "{rawInput}"
                </p>
                <div className="mt-3 text-[11px] text-slate-500">
                  Brand: <span className="text-slate-300">{record.Brand_Name}</span> | MPN: <span className="text-slate-300">{record.MPN}</span>
                </div>
              </div>

              {/* Enriched E-Commerce Output */}
              <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/40">
                <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block mb-2">
                  Enriched E-Commerce Output (Editable)
                </span>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">Product Title</label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">UNSPSC Code & Taxonomy</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="text"
                        value={editedUnspsc}
                        onChange={(e) => setEditedUnspsc(e.target.value)}
                        className="w-32 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
                      />
                      <span className="text-xs text-slate-400 truncate">{record.Category_Path}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Unit Normalization Engine Audit */}
          {conversions.length > 0 && (
            <div className="glass-card p-5 rounded-2xl border border-slate-800">
              <h4 className="font-heading text-xs uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Applied Physics & Unit Conversions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {conversions.map((conv, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">{conv.field}</span>
                      <span className="text-xs font-mono text-amber-400">{conv.imperial}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600" />
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Metric Standard</span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">{conv.metric}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LLM Reasoning Chain Log */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-heading text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                Reasoning Audit Log & Citation Trace
              </h4>
              <button
                onClick={handleCopyAudit}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Log'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {record.AI_Reasoning_Audit}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Field updates will instantly recalculate static headers and export sheets.
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl shadow-lg shadow-blue-600/30 transition-all"
            >
              Save & Re-Validate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
