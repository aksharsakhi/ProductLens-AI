import React from 'react';
import { Cpu, Sparkles, Layers, ShieldCheck, Download, ExternalLink } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onExportClick, totalRecords, qualityScore }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="h-5 w-5 text-blue-400 animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-lg text-white tracking-wide">
                  ProductLens <span className="text-blue-500">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/60 rounded-full">
                  UniHack 2026
                </span>
              </div>
              <p className="text-xs text-slate-400">Industrial Product Intelligence & Commerce Catalog Engine</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'catalog'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Catalog Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('ingestion')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ingestion'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Data Ingestion & AI</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'audit'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Validation & Audit</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col items-end mr-2 text-right">
              <span className="text-[11px] text-slate-400 font-mono">
                {totalRecords} Products Loaded
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">
                {qualityScore}% Quality Score
              </span>
            </div>

            <button
              onClick={onExportClick}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              <span>Export Expected XLSX</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
