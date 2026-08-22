import React, { useState } from 'react';
import {
  X, Brain, CheckCircle2, AlertTriangle, Copy, ArrowRight,
  Zap, ShieldCheck, Tag, RefreshCw, FileText, Edit3,
  Save, ExternalLink, Package, Sparkles
} from 'lucide-react';

export default function ExplainabilityModal({ record, onClose, onSaveRecord }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(record.Product_Title);
  const [editShortDesc, setEditShortDesc] = useState(record.Short_Description);
  const [copied, setCopied] = useState(null);

  const score = parseInt(record.Confidence_Score) || 90;
  const conversions = record._conversions || [];
  const specs = record._extractedSpecsObj || {};
  const taxon = record._taxonDetails || {};

  const handleSave = () => {
    onSaveRecord({
      ...record,
      Product_Title: editTitle,
      Short_Description: editShortDesc,
    });
    setIsEditing(false);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const scoreColor = score >= 90 ? '#10b981' : score >= 75 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content max-w-3xl p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-slate-800 bg-[#0d1220]/95 backdrop-blur-xl flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${scoreColor}15`, border: `1px solid ${scoreColor}30` }}>
              <Brain className="h-5 w-5" style={{ color: scoreColor }} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-white">
                AI Explainability & Audit Inspector
              </h2>
              <p className="text-[11px] text-slate-400">
                {record.Product_ID} • {record.MPN} • {record.Brand_Name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <button onClick={handleSave} className="btn-primary text-xs !py-1.5 !px-3 flex items-center gap-1">
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-ghost text-xs !py-1.5 !px-3 flex items-center gap-1"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Score & Status Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ background: `${scoreColor}08`, borderColor: `${scoreColor}30` }}>
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: `${scoreColor}20` }}>
                <span className="font-heading font-extrabold text-sm" style={{ color: scoreColor }}>
                  {score}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Confidence</span>
                <span className="text-xs font-bold text-white">{score >= 90 ? 'High' : score >= 75 ? 'Medium' : 'Low'}</span>
              </div>
            </div>

            <span className={`badge flex items-center gap-1 ${
              record.Validation_Status === 'VALID' ? 'badge-emerald' : record.Validation_Status === 'WARNING' ? 'badge-amber' : 'badge-rose'
            }`}>
              {record.Validation_Status === 'VALID' ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              {record.Validation_Status}
            </span>

            <span className="badge badge-purple flex items-center gap-1">
              <Tag className="h-3 w-3" />
              UNSPSC {record.UNSPSC_Code}
            </span>

            <span className="badge badge-blue flex items-center gap-1">
              <Package className="h-3 w-3" />
              {record.Brand_Name}
            </span>
          </div>

          {/* Product Title (Editable) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated Product Title</label>
              <button
                onClick={() => handleCopy(record.Product_Title, 'title')}
                className="text-[10px] text-slate-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
              >
                <Copy className="h-3 w-3" />
                {copied === 'title' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            {isEditing ? (
              <textarea
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="input-field text-sm"
                rows={2}
              />
            ) : (
              <p className="text-sm text-white leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                {record.Product_Title}
              </p>
            )}
          </div>

          {/* Short Description (Editable) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Short Description</label>
              <button
                onClick={() => handleCopy(record.Short_Description, 'short')}
                className="text-[10px] text-slate-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
              >
                <Copy className="h-3 w-3" />
                {copied === 'short' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            {isEditing ? (
              <textarea
                value={editShortDesc}
                onChange={(e) => setEditShortDesc(e.target.value)}
                className="input-field text-xs"
                rows={3}
              />
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                {record.Short_Description}
              </p>
            )}
          </div>

          {/* UNSPSC Taxonomy Path */}
          <div className="glass-card p-4 rounded-xl border border-slate-800">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Tag className="h-3.5 w-3.5 text-violet-400" />
              UNSPSC v25.0 Taxonomy Classification
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 w-20 shrink-0">Segment</span>
                <span className="text-violet-300 font-mono">{taxon.segment || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 w-20 shrink-0">Family</span>
                <span className="text-violet-300 font-mono">{taxon.family || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 w-20 shrink-0">Class</span>
                <span className="text-violet-300 font-mono">{taxon.class || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 w-20 shrink-0">Commodity</span>
                <span className="text-white font-mono font-bold">{taxon.code} — {taxon.title}</span>
              </div>
              <div className="flex items-center gap-2 text-xs mt-1">
                <span className="text-slate-400 w-20 shrink-0">Full Path</span>
                <span className="text-slate-300">{record.Category_Path}</span>
              </div>
            </div>
          </div>

          {/* Extracted Specifications */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              AI-Extracted Product Attributes
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(specs).map(([key, value], i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium">{key}</span>
                  <span className="text-white font-mono font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Unit Conversions */}
          {conversions.length > 0 && (
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
                Physics Unit Normalizations ({conversions.length})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {conversions.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-amber-950/20 rounded-xl border border-amber-800/30">
                    <div className="text-center flex-1">
                      <span className="text-[10px] text-slate-500 block">Imperial</span>
                      <span className="text-sm font-mono font-bold text-amber-300">{c.imperial}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 shrink-0" />
                    <div className="text-center flex-1">
                      <span className="text-[10px] text-slate-500 block">Metric SI</span>
                      <span className="text-sm font-mono font-bold text-cyan-300">{c.metric}</span>
                    </div>
                    <span className="badge badge-amber text-[9px] shrink-0">{c.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Flags */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Validation Audit Flags
            </label>
            <div className="space-y-1.5">
              {record.Validation_Flags.split(' ; ').filter(Boolean).map((flag, i) => (
                <div key={i} className="flex items-center gap-2 text-xs p-2 bg-slate-950/50 rounded-lg border border-slate-800">
                  <span className="text-slate-300">{flag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* XAI Reasoning Log */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5 text-indigo-400" />
                Explainable AI (XAI) Reasoning Audit Log
              </label>
              <button
                onClick={() => handleCopy(record.AI_Reasoning_Audit, 'audit')}
                className="text-[10px] text-slate-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
              >
                <Copy className="h-3 w-3" />
                {copied === 'audit' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-[11px] text-slate-300 bg-slate-950/70 p-4 rounded-xl border border-slate-800 overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap">
              {record.AI_Reasoning_Audit}
            </pre>
          </div>

          {/* Source Reference */}
          <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-500" />
              <span className="text-slate-400">Source:</span>
              <span className="text-slate-300 font-medium">{record.Source_Reference}</span>
            </div>
            <span className="font-mono text-slate-500">{record.Product_ID}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
