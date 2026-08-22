import React, { useState } from 'react';
import { Sliders, Plus, Trash2, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

export default function RuleConfigurator({ customRules = [], onAddRule, onDeleteRule, onApplyRules }) {
  const [keyword, setKeyword] = useState('');
  const [targetField, setTargetField] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [appliedNotice, setAppliedNotice] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim() || !targetField.trim() || !targetValue.trim()) return;

    onAddRule({
      id: Date.now().toString(),
      keyword: keyword.trim(),
      targetField: targetField.trim(),
      targetValue: targetValue.trim()
    });

    setKeyword('');
    setTargetField('');
    setTargetValue('');
  };

  const handleRunPipeline = () => {
    onApplyRules();
    setAppliedNotice('Rules re-applied across active catalog dataset!');
    setTimeout(() => setAppliedNotice(null), 3000);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="h-5 w-5 text-amber-400" />
            Enterprise Rule Engine & Custom Extraction Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Define custom keyword rules to force attribute extractions and override taxonomy logic.
          </p>
        </div>

        <button
          onClick={handleRunPipeline}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-amber-600/25 transition-all flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Re-Run Pipeline with Rules</span>
        </button>
      </div>

      {appliedNotice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{appliedNotice}</span>
        </div>
      )}

      {/* Add New Rule Form */}
      <form onSubmit={handleSubmit} className="glass-card p-4 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="h-4 w-4 text-amber-400" />
          Add Custom Transformation Rule
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">If Raw Text Contains</label>
            <input
              type="text"
              placeholder="e.g. NPT, IP65, Explosion Proof"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Target Spec Field</label>
            <input
              type="text"
              placeholder="e.g. Connection Type, Enclosure Rating"
              value={targetField}
              onChange={(e) => setTargetField(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Extracted Output Value</label>
            <input
              type="text"
              placeholder="e.g. Threaded NPT, IP65 Weatherproof"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Rule</span>
          </button>
        </div>
      </form>

      {/* Active Rules List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Active Custom Rules ({customRules.length})
        </h3>

        {customRules.length === 0 ? (
          <p className="text-xs text-slate-500 italic p-4 text-center bg-slate-950/40 rounded-xl border border-slate-800">
            No custom rules configured. Standard NLP extraction engine active.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customRules.map((rule) => (
              <div key={rule.id} className="glass-card p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-amber-400 font-mono font-bold block">
                    IF contains "{rule.keyword}"
                  </span>
                  <span className="text-xs text-slate-200">
                    SET {rule.targetField} = <strong className="text-emerald-400">{rule.targetValue}</strong>
                  </span>
                </div>

                <button
                  onClick={() => onDeleteRule(rule.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
