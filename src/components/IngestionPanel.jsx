import React, { useState, useCallback } from 'react';
import { Upload, Database, ChevronRight, Loader2, FileSpreadsheet, XCircle, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';

export default function IngestionPanel({ onIngestCustom, onBatchIngest }) {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileStats, setFileStats] = useState(null); // { name, count, error }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    setIsProcessing(true);
    setFileStats(null);

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        worker: true, // Offloads parsing to a background thread
        complete: (results) => {
          try {
            const data = results.data.filter(row => Object.keys(row).length > 0);
            
            // Map generic CSV rows to our expected raw_input format
            const mappedItems = data.map((row, index) => {
              // Extract a likely text column. Prefer description, title, or just concatenate everything
              const rawText = row.Description || row.description || row.Title || row.title || row.ItemDescription || Object.values(row).join(' ');
              const mpn = row.MPN || row.mpn || row.PartNumber || row.part_number || '';
              const brand = row.Brand || row.brand || row.Manufacturer || row.manufacturer || '';
              
              return {
                raw_id: row.ID || row.id || row.SKU || row.sku || `UPL-${Date.now()}-${index}`,
                raw_input: rawText,
                source: file.name,
                mpn: mpn,
                brand: brand,
                _originalRow: row
              };
            });

            setFileStats({ name: file.name, count: mappedItems.length });
            
            // Send to parent for batch processing
            if (onBatchIngest) {
              onBatchIngest(mappedItems);
            }
          } catch (err) {
            setFileStats({ name: file.name, error: err.message });
          } finally {
            setIsProcessing(false);
          }
        },
        error: (err) => {
          setFileStats({ name: file.name, error: err.message });
          setIsProcessing(false);
        }
      });
    } else {
      setFileStats({ name: file.name, error: "Only .csv files are currently supported for upload." });
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 shadow-inner text-indigo-400">
          <Database className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-white text-lg">Batch File Ingestion</h2>
          <p className="text-xs text-slate-400 mt-0.5">Upload CSV files containing raw catalog items</p>
        </div>
      </div>

      <div 
        className={`relative z-10 w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${
          dragActive 
            ? 'border-indigo-500 bg-indigo-950/20' 
            : 'border-slate-700 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/40'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {isProcessing ? (
          <>
            <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mb-3" />
            <p className="text-sm font-semibold text-indigo-300">Parsing File Data...</p>
          </>
        ) : (
          <>
            <Upload className={`h-10 w-10 mb-3 transition-colors ${dragActive ? 'text-indigo-400' : 'text-slate-500'}`} />
            <p className="text-sm font-bold text-slate-300">Drag & Drop CSV File</p>
            <p className="text-xs text-slate-500 mt-1">or click to browse local files</p>
          </>
        )}
      </div>

      {fileStats && (
        <div className={`mt-4 p-3 rounded-xl border flex items-start gap-3 animate-slide-up ${
          fileStats.error ? 'bg-rose-950/40 border-rose-900/50' : 'bg-emerald-950/40 border-emerald-900/50'
        }`}>
          {fileStats.error ? (
            <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          )}
          
          <div>
            <p className={`text-sm font-bold ${fileStats.error ? 'text-rose-400' : 'text-emerald-400'}`}>
              {fileStats.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {fileStats.error 
                ? `Error: ${fileStats.error}` 
                : `Successfully parsed ${fileStats.count} raw items. Sent to AI enrichment pipeline.`}
            </p>
          </div>
        </div>
      )}

      {/* Helper text for format */}
      <div className="mt-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2 mb-2">
          <FileSpreadsheet className="h-4 w-4 text-slate-500" />
          Expected CSV Format
        </h4>
        <p className="text-[11px] text-slate-500 mb-2">
          The engine will automatically search for text to enrich across your columns. For best results, include these headers:
        </p>
        <div className="flex gap-2 flex-wrap">
          {['SKU / ID', 'Description / Title', 'MPN', 'Brand / Manufacturer'].map(h => (
            <span key={h} className="text-[10px] px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-400 font-mono">
              {h}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
