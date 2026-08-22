import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, Check, Sparkles, Table } from 'lucide-react';
import { EXPECTED_STATIC_HEADERS, exportToExcel, exportToCSV } from '../services/excelExporter';
import confetti from 'canvas-confetti';

export default function ExportModal({ records = [], onClose }) {
  const [format, setFormat] = useState('xlsx');
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = () => {
    if (format === 'xlsx') {
      exportToExcel(records, `ProductLens_UniHack_Enriched_Catalog_${Date.now()}.xlsx`);
    } else {
      exportToCSV(records, `ProductLens_UniHack_Enriched_Catalog_${Date.now()}.csv`);
    }

    setDownloaded(true);
    
    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // fallback
    }

    setTimeout(() => {
      setDownloaded(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-slate-700 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                Export Catalog Output Sheet
              </h3>
              <p className="text-xs text-slate-400">
                Generates commerce-ready data formatted strictly to static expected headers.
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

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Format selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Output Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFormat('xlsx')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  format === 'xlsx'
                    ? 'bg-blue-950/60 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-sm text-white">Excel Sheet (.xlsx)</span>
                  <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Recommended format with cell formatting & column widths</p>
              </button>

              <button
                onClick={() => setFormat('csv')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  format === 'csv'
                    ? 'bg-blue-950/60 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-sm text-white">Comma Separated (.csv)</span>
                  <Table className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Lightweight plain-text table format for ERP/PIM import</p>
              </button>
            </div>
          </div>

          {/* Static Headers Verification */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Verified Hackathon Static Headers ({EXPECTED_STATIC_HEADERS.length} Fields)
            </h4>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
              {EXPECTED_STATIC_HEADERS.map((header, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-900 text-slate-300 rounded-lg text-[11px] font-mono border border-slate-800"
                >
                  {header}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            {records.length} items queued for export
          </span>

          <button
            onClick={handleExport}
            disabled={downloaded}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
          >
            {downloaded ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>Exported Successfully!</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download Enriched {format.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
