import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet, Upload, Play, CheckCircle, Sparkles,
  Database, Plus, ArrowRight, FileText,
  Loader2, Package, AlertCircle
} from 'lucide-react';
import { SAMPLE_DATASETS } from '../data/sampleDatasets';
import * as XLSX from 'xlsx';

export default function IngestionPanel({ onLoadDataset, onIngestCustomItem }) {
  const [activeTab, setActiveTab] = useState('presets');
  const [customInput, setCustomInput] = useState('');
  const [customMPN, setCustomMPN] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [customSource, setCustomSource] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handlePresetLoad = (datasetId) => {
    setSelectedPreset(datasetId);
    onLoadDataset(datasetId);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    onIngestCustomItem({
      raw_id: `SKU-C-${Date.now().toString(36).toUpperCase()}`,
      raw_input: customInput.trim(),
      mpn: customMPN.trim() || 'UNKNOWN',
      brand: customBrand.trim() || 'Custom Feed',
      source: customSource.trim() || 'Manual Entry',
    });

    setCustomInput('');
    setCustomMPN('');
    setCustomBrand('');
    setCustomSource('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setUploadStatus('parsing');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      if (rows.length === 0) {
        setUploadStatus('error');
        return;
      }

      // Try to auto-detect columns
      const firstRow = rows[0];
      const keys = Object.keys(firstRow);

      rows.forEach((row, idx) => {
        const rawInput = row.raw_input || row.description || row.title || row.product_name || row[keys[0]] || '';
        const mpn = row.mpn || row.MPN || row.part_number || row[keys[1]] || 'UNKNOWN';
        const brand = row.brand || row.Brand || row.manufacturer || row[keys[2]] || 'Uploaded';
        const source = `File Upload: ${file.name} (Row ${idx + 1})`;

        onIngestCustomItem({
          raw_id: `SKU-U-${idx + 1}-${Date.now().toString(36).slice(-4).toUpperCase()}`,
          raw_input: String(rawInput),
          mpn: String(mpn),
          brand: String(brand),
          source,
        });
      });

      setUploadStatus('success');
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err) {
      console.error('File parse error:', err);
      setUploadStatus('error');
    }
  };

  const TABS = [
    { id: 'presets', label: 'Sample Datasets', icon: Database },
    { id: 'manual', label: 'Manual Entry', icon: Plus },
    { id: 'upload', label: 'File Upload', icon: Upload },
  ];

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">

      {/* Panel Header */}
      <div className="px-6 py-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <FileSpreadsheet className="h-4.5 w-4.5 text-indigo-400" />
            Multi-Source Data Ingestion Engine
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Load preset industrial datasets, enter raw product specs manually, or upload CSV/XLSX files
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="tab-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : ''}`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 animate-fade-in">

        {/* Preset Datasets */}
        {activeTab === 'presets' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {SAMPLE_DATASETS.map((ds) => (
              <button
                key={ds.id}
                onClick={() => handlePresetLoad(ds.id)}
                className={`glass-card p-4 rounded-xl text-left transition-all group ${
                  selectedPreset === ds.id
                    ? 'border-indigo-500/50 glow-indigo'
                    : 'border-slate-800 hover:border-indigo-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-blue text-[10px]">{ds.count} Products</span>
                  {selectedPreset === ds.id && (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  )}
                </div>
                <h3 className="font-heading font-bold text-sm text-white group-hover:text-indigo-300 transition-colors mb-1">
                  {ds.name}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2">{ds.description}</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-3 w-3" />
                  <span>Load & Enrich</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Manual Entry */}
        {activeTab === 'manual' && (
          <form onSubmit={handleCustomSubmit} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1.5">
                Raw Product Specification Text <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                placeholder="e.g., Brass solenoid valve 1/2 in NPT female 24VDC 150psi max temp 180F model SV-24V-05"
                rows={3}
                className="input-field resize-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Paste any unstructured product description — the AI engine will extract attributes automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1.5">MPN</label>
                <input
                  type="text" value={customMPN} onChange={e => setCustomMPN(e.target.value)}
                  placeholder="SV-24V-05" className="input-field text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1.5">Brand</label>
                <input
                  type="text" value={customBrand} onChange={e => setCustomBrand(e.target.value)}
                  placeholder="FlowTech" className="input-field text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1.5">Source</label>
                <input
                  type="text" value={customSource} onChange={e => setCustomSource(e.target.value)}
                  placeholder="PDF Datasheet p.4" className="input-field text-xs"
                />
              </div>
            </div>

            <button type="submit" disabled={!customInput.trim()} className="btn-primary flex items-center gap-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed">
              <Sparkles className="h-4 w-4" />
              <span>Ingest & Enrich with AI</span>
            </button>
          </form>
        )}

        {/* File Upload */}
        {activeTab === 'upload' && (
          <div className="max-w-2xl space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-10 text-center cursor-pointer transition-all group hover:bg-indigo-950/10"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="h-10 w-10 text-slate-500 group-hover:text-indigo-400 mx-auto mb-3 transition-colors" />
              <p className="text-sm text-slate-300 font-medium">
                Drop CSV or XLSX file here, or <span className="text-indigo-400 underline">browse</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Auto-detects columns: raw_input, mpn, brand, description, title, product_name
              </p>
            </div>

            {uploadStatus === 'parsing' && (
              <div className="flex items-center gap-2 p-3 bg-blue-950/60 border border-blue-800 rounded-xl text-xs text-blue-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Parsing "{uploadedFile?.name}"...</span>
              </div>
            )}
            {uploadStatus === 'success' && (
              <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300">
                <CheckCircle className="h-4 w-4" />
                <span>Successfully ingested all rows from "{uploadedFile?.name}"</span>
              </div>
            )}
            {uploadStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300">
                <AlertCircle className="h-4 w-4" />
                <span>Failed to parse file. Ensure it has valid tabular data.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
