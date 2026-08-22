import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu, Sparkles, Download, LayoutGrid, Table, BarChart3,
  FolderTree, Sliders, Activity, Menu, X, Zap, Brain
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'table', label: 'Catalog Studio', icon: Table },
  { id: 'cards', label: 'Commerce View', icon: LayoutGrid },
  { id: 'pipeline', label: 'AI Pipeline', icon: Activity },
  { id: 'analytics', label: 'BI Analytics', icon: BarChart3 },
  { id: 'taxonomy', label: 'UNSPSC Browser', icon: FolderTree },
  { id: 'rules', label: 'Rule Engine', icon: Sliders },
];

export default function Header({ viewMode, setViewMode, onExportClick, totalRecords, qualityScore }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled
        ? 'bg-[#050810]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20'
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-violet-600 p-[2px] shadow-lg glow-indigo group">
              <div className="h-full w-full bg-[#080c14] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <Brain className="h-5 w-5 text-indigo-400 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#080c14] animate-pulse-subtle" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg text-white tracking-tight">
                  Product<span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Lens</span> AI
                </span>
                <span className="badge badge-blue font-mono text-[9px] tracking-wider">v2.0</span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5">Industrial Product Intelligence Engine</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:block">
            <div className="tab-nav">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id)}
                  className={`tab-btn ${viewMode === id ? 'tab-btn-active' : ''}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Live Stats */}
            <div className="hidden md:flex items-center gap-3 mr-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="status-dot status-valid" />
                <span className="text-[11px] text-slate-300 font-mono">{totalRecords} SKUs</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
                <Zap className="h-3 w-3 text-amber-400" />
                <span className="text-[11px] text-emerald-400 font-mono font-bold">{qualityScore}%</span>
              </div>
            </div>

            {/* Export Button */}
            <button onClick={onExportClick} className="btn-primary flex items-center gap-2 text-xs !py-2 !px-4">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export XLSX</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-800 animate-slide-up">
            <div className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => { setViewMode(id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    viewMode === id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 bg-slate-900/40 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
