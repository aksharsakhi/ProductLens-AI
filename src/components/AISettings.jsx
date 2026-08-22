import React, { useState, useEffect } from 'react';
import {
  Brain, Key, CheckCircle2, XCircle, Zap, Shield, Eye, EyeOff,
  Loader2, AlertTriangle, Settings, Sparkles, RefreshCw
} from 'lucide-react';
import { configureGemini, isGeminiEnabled, getGeminiStats, aiExtractSpecifications } from '../services/geminiService';

export default function AISettings({ onAIStatusChange }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('productlens_gemini_key') || '');
  const [enabled, setEnabled] = useState(() => localStorage.getItem('productlens_ai_enabled') === 'true');
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // null | 'testing' | 'success' | 'error'
  const [testError, setTestError] = useState('');
  const [stats, setStats] = useState(getGeminiStats());

  useEffect(() => {
    const result = configureGemini(apiKey, enabled);
    setStats(getGeminiStats());
    onAIStatusChange?.(result.configured);
  }, [apiKey, enabled]);

  const handleSaveKey = () => {
    localStorage.setItem('productlens_gemini_key', apiKey);
    localStorage.setItem('productlens_ai_enabled', String(enabled));
    configureGemini(apiKey, enabled);
    setStats(getGeminiStats());
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) return;
    setTestStatus('testing');
    setTestError('');

    try {
      configureGemini(apiKey, true);
      const result = await aiExtractSpecifications('Brass solenoid valve 1/2 inch NPT 24VDC 150 PSI');
      if (result && result.specs) {
        setTestStatus('success');
        setEnabled(true);
        localStorage.setItem('productlens_ai_enabled', 'true');
        localStorage.setItem('productlens_gemini_key', apiKey);
      } else {
        setTestStatus('error');
        setTestError('API responded but returned no data');
      }
    } catch (err) {
      setTestStatus('error');
      setTestError(err.message);
      configureGemini(apiKey, false);
    }
  };

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem('productlens_ai_enabled', String(next));
    configureGemini(apiKey, next);
    onAIStatusChange?.(next && apiKey.length > 0);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-400" />
            AI Engine Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Connect to Google Gemini for real LLM-powered product enrichment
          </p>
        </div>

        {/* AI Toggle */}
        <button
          onClick={handleToggle}
          className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
            enabled && apiKey ? 'bg-indigo-600 shadow-md shadow-indigo-600/30' : 'bg-slate-700'
          }`}
        >
          <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${
            enabled && apiKey ? 'translate-x-7' : 'translate-x-0.5'
          }`} />
        </button>
      </div>

      {/* Status Banner */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${
        isGeminiEnabled()
          ? 'bg-emerald-950/40 border-emerald-800/50'
          : 'bg-slate-900/60 border-slate-800'
      }`}>
        {isGeminiEnabled() ? (
          <>
            <div className="h-10 w-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-sm font-bold text-emerald-300 block">AI Engine Active</span>
              <span className="text-[11px] text-slate-400">
                Google Gemini 2.0 Flash • {stats.requestCount} API calls this session
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <Shield className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-300 block">Heuristic Engine (Offline Mode)</span>
              <span className="text-[11px] text-slate-400">
                Using regex + NLP extractors. Add Gemini API key for AI-powered enrichment.
              </span>
            </div>
          </>
        )}
      </div>

      {/* API Key Input */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Google Gemini API Key
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="input-field !pl-10 !pr-10 text-sm font-mono"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={!apiKey.trim() || testStatus === 'testing'}
            className="btn-primary flex items-center gap-2 text-xs !py-2 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {testStatus === 'testing' ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Testing...</>
            ) : (
              <><Zap className="h-4 w-4" /> Test & Activate</>
            )}
          </button>
        </div>

        <p className="text-[10px] text-slate-500">
          Get a free API key at{' '}
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
            aistudio.google.com/apikey
          </a>
          {' '}— Key is stored locally in your browser only.
        </p>
      </div>

      {/* Test Result */}
      {testStatus === 'success' && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 animate-slide-up">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Connection successful! AI engine is now active. Gemini will power all enrichment operations.</span>
        </div>
      )}

      {testStatus === 'error' && (
        <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 animate-slide-up">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="h-4 w-4 shrink-0" />
            <span className="font-bold">Connection Failed</span>
          </div>
          <p className="text-rose-400/80 ml-6">{testError}</p>
        </div>
      )}

      {/* AI Capabilities List */}
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
          AI-Powered Capabilities
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { icon: Brain, label: 'LLM Spec Extraction', desc: '30+ attribute types via Gemini NLP' },
            { icon: Sparkles, label: 'Smart Title Generation', desc: 'SEO-optimized commerce titles' },
            { icon: RefreshCw, label: 'AI Description Writer', desc: 'Short + HTML long descriptions' },
            { icon: Settings, label: 'UNSPSC Classification', desc: 'AI-powered taxonomy mapping' },
          ].map((cap, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800">
              <div className={`p-1.5 rounded-lg shrink-0 ${isGeminiEnabled() ? 'bg-indigo-600/20' : 'bg-slate-800'}`}>
                <cap.icon className={`h-4 w-4 ${isGeminiEnabled() ? 'text-indigo-400' : 'text-slate-500'}`} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">{cap.label}</span>
                <span className="text-[10px] text-slate-500">{cap.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mode Comparison */}
      <div className="border-t border-slate-800 pt-4">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
          Engine Mode Comparison
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border ${!isGeminiEnabled() ? 'border-indigo-500/50 bg-indigo-950/20' : 'border-slate-800 bg-slate-950/40'}`}>
            <h4 className="text-xs font-bold text-slate-200 mb-2">🔧 Heuristic Engine</h4>
            <ul className="space-y-1 text-[10px] text-slate-400">
              <li>• 27 regex-based extractors</li>
              <li>• 200+ synonym resolver</li>
              <li>• Rule-based UNSPSC mapping</li>
              <li>• Template-based titles</li>
              <li>• Instant (no API calls)</li>
              <li>• Works fully offline</li>
            </ul>
          </div>
          <div className={`p-4 rounded-xl border ${isGeminiEnabled() ? 'border-indigo-500/50 bg-indigo-950/20' : 'border-slate-800 bg-slate-950/40'}`}>
            <h4 className="text-xs font-bold text-slate-200 mb-2">🧠 Gemini AI Engine</h4>
            <ul className="space-y-1 text-[10px] text-slate-400">
              <li>• LLM-powered NLP extraction</li>
              <li>• Context-aware classification</li>
              <li>• Natural language descriptions</li>
              <li>• SEO-optimized titles</li>
              <li>• Semantic understanding</li>
              <li>• Free API (rate-limited)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
