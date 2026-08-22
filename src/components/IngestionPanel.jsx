import React, { useState } from 'react';
import { FileSpreadsheet, Upload, Link, AlignLeft, Play, CheckCircle, Sparkles } from 'lucide-react';
import { SAMPLE_DATASETS } from '../data/sampleDatasets';

export default function IngestionPanel({ onLoadDataset, onIngestCustomItem }) {
  const [activeSubTab, setActiveSubTab] = useState('benchmarks');
  const [rawTextInput, setRawTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [mpnInput, setMpnInput] = useState('');
  const [brandInput, setBrandInput] = useState('');
  const [ingestNotice, setIngestNotice] = useState(null);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!rawTextInput.trim()) return;

    const newItem = {
      raw_id: `CUSTOM-${Date.now().toString().slice(-4)}`,
      raw_input: rawTextInput.trim(),
      source: urlInput.trim() ? `URL: ${urlInput.trim()}` : 'Manual Spec Ingestion',
      mpn: mpnInput.trim() || `MPN-${Math.floor(Math.random() * 8999 + 1000)}`,
      brand: brandInput.trim() || 'Custom Industrial'
    };

    onIngestCustomItem(newItem);
    setIngestNotice('Successfully ingested and enriched custom product record!');
    setRawTextInput('');
    setMpnInput('');
    setBrandInput('');
    setUrlInput('');
    setTimeout(() => setIngestNotice(null), 4000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 border border-slate-800 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            Multi-Source Ingestion & Extraction Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Feed raw unstructured PDFs, URLs, CSV catalog lines, or select preset benchmark datasets for evaluation.
          </p>
        </div>

        {/* Subtab selector */}
        <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('benchmarks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'benchmarks'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Presets & Benchmarks
          </button>

          <button
            onClick={() => setActiveSubTab('paste')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'paste'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Paste Unstructured Text
          </button>

          <button
            onClick={() => setActiveSubTab('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'upload'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upload File / PDF
          </button>
        </div>
      </div>

      {/* Subtab Content 1: Preset Datasets */}
      {activeSubTab === 'benchmarks' && (
        <div className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAMPLE_DATASETS.map((ds) => (
              <div
                key={ds.id}
                onClick={() => onLoadDataset(ds.id)}
                className="group relative cursor-pointer glass-card p-4 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-800/60">
                    {ds.count} Sample Items
                  </span>
                  <Play className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="font-heading text-sm font-bold text-white group-hover:text-blue-300">
                  {ds.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {ds.description}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-slate-300">
                  <span>Click to Load Dataset</span>
                  <span className="font-mono text-blue-400 font-medium">Process →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab Content 2: Paste Raw Text */}
      {activeSubTab === 'paste' && (
        <form onSubmit={handleCustomSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Brand Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Parker Hannifin"
                value={brandInput}
                onChange={(e) => setBrandInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                MPN / Model Number (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. PH-200-VALVE"
                value={mpnInput}
                onChange={(e) => setMpnInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Source Document URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://catalog.example.com/datasheet.pdf"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Raw Product Description / Specs Snippet *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Paste unformatted text, e.g. '3-way stainless steel valve 3/4 inch NPT 3000 PSI 24VDC explosion proof rating model EX-34-3K'"
              value={rawTextInput}
              onChange={(e) => setRawTextInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-between">
            {ingestNotice ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle className="h-4 w-4" /> {ingestNotice}
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">
                AI Pipeline will automatically extract specs, map UNSPSC, and normalize units.
              </span>
            )}

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Enrich Single Item</span>
            </button>
          </div>
        </form>
      )}

      {/* Subtab Content 3: Upload File */}
      {activeSubTab === 'upload' && (
        <div className="mt-5 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl p-8 text-center transition-colors bg-slate-950/40">
          <Upload className="h-8 w-8 text-blue-400 mx-auto mb-3 animate-bounce" />
          <h3 className="font-heading text-sm font-bold text-white">
            Drag and Drop Product Catalog (CSV, XLSX, or Technical PDF)
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Supports batch processing of industrial datasheets, multi-column spreadsheets, and scraped supplier feeds.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => onLoadDataset('valves_hydraulics')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
            >
              Test with Sample Hydraulic Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
