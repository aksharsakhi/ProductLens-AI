import React, { useState, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Search, Filter, Eye, CheckCircle2, AlertTriangle, XCircle,
  ChevronRight, Edit2, Tag, ArrowUpDown, Copy, Package, Zap
} from 'lucide-react';

const STATUS_FILTERS = [
  { id: 'all', label: 'All', color: 'text-slate-300' },
  { id: 'VALID', label: 'Valid', color: 'text-emerald-400' },
  { id: 'WARNING', label: 'Warning', color: 'text-amber-400' },
  { id: 'CRITICAL_ERROR', label: 'Critical', color: 'text-rose-400' },
];

export default function ProductTable({ records = [], onSelectRecord, onUpdateRecord }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [copiedId, setCopiedId] = useState(null);

  const parentRef = useRef(null);

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    let result = [...records];

    if (statusFilter !== 'all') {
      result = result.filter(r => r.Validation_Status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.Product_ID?.toLowerCase().includes(q) ||
        r.MPN?.toLowerCase().includes(q) ||
        r.Brand_Name?.toLowerCase().includes(q) ||
        r.Product_Title?.toLowerCase().includes(q) ||
        r.UNSPSC_Code?.includes(q)
      );
    }

    result.sort((a, b) => {
      let av, bv;
      if (sortBy === 'id') { av = a.Product_ID; bv = b.Product_ID; }
      else if (sortBy === 'brand') { av = a.Brand_Name; bv = b.Brand_Name; }
      else if (sortBy === 'score') { av = a._qualityScore || 0; bv = b._qualityScore || 0; }
      
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [records, searchQuery, statusFilter, sortBy, sortDir]);

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52, // Estimated row height
    overscan: 5,
  });

  const handleCopyMPN = (mpn, id) => {
    if (!mpn) return;
    navigator.clipboard.writeText(mpn);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (records.length === 0) {
    return (
      <div className="glass-panel p-16 text-center border border-slate-800 rounded-3xl animate-fade-in shadow-xl">
        <Package className="h-16 w-16 text-slate-700 mx-auto mb-6" />
        <h3 className="text-xl font-heading font-bold text-slate-300">Catalog is Empty</h3>
        <p className="text-slate-500 mt-2 max-w-sm mx-auto">Upload a dataset or trigger the heuristic extraction pipeline to populate the catalog table.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl border border-slate-800/80 overflow-hidden flex flex-col animate-slide-up shadow-xl h-[800px]">
      
      {/* Header Controls */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/50 flex flex-col sm:flex-row gap-4 justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-200">Catalog Registry</h3>
            <p className="text-[10px] text-indigo-400/80 font-mono">Virtualized — Handles 100k+ rows seamlessly</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Status Filters */}
          <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === f.id 
                    ? `bg-slate-800 ${f.color} shadow-sm border border-slate-700` 
                    : 'text-slate-500 hover:text-slate-400 border border-transparent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search MPN, Brand, Taxonomy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table Container (Virtualized) */}
      <div className="flex-1 overflow-auto custom-scrollbar relative" ref={parentRef}>
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-16">#</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('id')}>
                <div className="flex items-center gap-1">SKU <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">MPN</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('brand')}>
                <div className="flex items-center gap-1">Brand <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4">Auto-Generated Title</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">UNSPSC</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Extracted Specs</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('score')}>
                <div className="flex items-center gap-1">Score <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          
          <tbody style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const rec = filtered[virtualRow.index];
              const score = rec._qualityScore || 0;
              const scoreColor = score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#f43f5e';
              
              let specs = {};
              try { specs = typeof rec.Enriched_Attributes === 'string' ? JSON.parse(rec.Enriched_Attributes) : rec.Enriched_Attributes; } catch(e){}
              const specEntries = Object.entries(specs || {}).slice(0, 3);

              return (
                <tr 
                  key={virtualRow.key} 
                  className="group hover:bg-slate-800/30 border-b border-slate-800/50 transition-colors absolute w-full flex items-center"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <td className="px-4 w-16 text-slate-600 font-mono text-[11px] truncate">{virtualRow.index + 1}</td>
                  
                  <td className="px-4 flex-1 min-w-[120px] truncate">
                    <span className="font-mono text-xs font-bold text-indigo-400">{rec.Product_ID}</span>
                  </td>

                  <td className="px-4 flex-1 min-w-[150px] truncate">
                    <button
                      onClick={() => handleCopyMPN(rec.MPN, rec.Product_ID)}
                      className="font-mono text-xs text-slate-300 hover:text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1 truncate max-w-full"
                    >
                      {copiedId === rec.Product_ID ? (
                        <><CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" /> Copied</>
                      ) : (
                        <><Copy className="h-3 w-3 text-slate-500 shrink-0" /> <span className="truncate">{rec.MPN}</span></>
                      )}
                    </button>
                  </td>

                  <td className="px-4 flex-1 min-w-[120px] truncate">
                    <span className="text-xs text-slate-300 font-medium">{rec.Brand_Name}</span>
                  </td>

                  <td className="px-4 w-1/4 min-w-[250px]">
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed" title={rec.Product_Title}>
                      {rec.Product_Title}
                    </p>
                  </td>

                  <td className="px-4 flex-1 min-w-[120px] truncate">
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3 w-3 text-violet-400 shrink-0" />
                      <span className="font-mono text-[11px] text-violet-300 font-bold">{rec.UNSPSC_Code}</span>
                    </div>
                  </td>

                  <td className="px-4 flex-1 min-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {specEntries.map(([k, v], i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-slate-900 text-[10px] text-slate-400 rounded border border-slate-800 font-mono truncate max-w-[80px]" title={`${k}: ${v}`}>
                          {v}
                        </span>
                      ))}
                      {Object.keys(specs).length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-500">+{Object.keys(specs).length - 3}</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 flex-1 min-w-[120px] truncate">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full overflow-hidden bg-slate-900 shrink-0">
                        <div className="h-full rounded-full" style={{
                          width: `${score}%`, background: scoreColor,
                          boxShadow: `0 0 6px ${scoreColor}40`
                        }} />
                      </div>
                      <span className="font-mono text-[11px] font-bold" style={{ color: scoreColor }}>
                        {score}%
                      </span>
                    </div>
                  </td>

                  <td className="px-4 flex-1 min-w-[100px] truncate">
                    {rec.Validation_Status === 'VALID' ? (
                      <span className="badge badge-emerald flex items-center gap-1 w-fit text-[10px]">
                        <CheckCircle2 className="h-3 w-3" /> Valid
                      </span>
                    ) : rec.Validation_Status === 'WARNING' ? (
                      <span className="badge badge-amber flex items-center gap-1 w-fit text-[10px]">
                        <AlertTriangle className="h-3 w-3" /> Warn
                      </span>
                    ) : (
                      <span className="badge badge-rose flex items-center gap-1 w-fit text-[10px]">
                        <XCircle className="h-3 w-3" /> Error
                      </span>
                    )}
                  </td>

                  <td className="px-4 w-[120px] text-right truncate">
                    <button
                      onClick={() => onSelectRecord(rec)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-600/10 hover:bg-indigo-600 hover:text-white border border-indigo-500/20 hover:border-indigo-500 transition-all flex items-center gap-1 ml-auto opacity-60 group-hover:opacity-100"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/50">
        <span className="text-[11px] text-slate-500">
          Showing {filtered.length} of {records.length} products
        </span>
        <span className="text-[10px] text-slate-600 font-mono">
          ProductLens AI • Catalog Studio v2.0
        </span>
      </div>
    </div>
  );
}
