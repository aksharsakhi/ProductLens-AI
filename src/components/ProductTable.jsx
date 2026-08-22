import React, { useState, useMemo } from 'react';
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

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    let result = [...records];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(r => r.Validation_Status === statusFilter);
    }

    // Search
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

    // Sort
    result.sort((a, b) => {
      let av, bv;
      if (sortBy === 'id') { av = a.Product_ID; bv = b.Product_ID; }
      else if (sortBy === 'brand') { av = a.Brand_Name; bv = b.Brand_Name; }
      else if (sortBy === 'score') { av = a._qualityScore || 0; bv = b._qualityScore || 0; }
      else if (sortBy === 'unspsc') { av = a.UNSPSC_Code; bv = b.UNSPSC_Code; }
      else { av = a.Product_ID; bv = b.Product_ID; }

      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === 'asc' ? av - bv : bv - av;
    });

    return result;
  }, [records, searchQuery, statusFilter, sortBy, sortDir]);

  const handleCopyMPN = (mpn, id) => {
    navigator.clipboard.writeText(mpn);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
      
      {/* Toolbar */}
      <div className="px-5 py-3 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by SKU, MPN, brand, title, UNSPSC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field !pl-10 text-xs"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          {STATUS_FILTERS.map(f => {
            const count = f.id === 'all'
              ? records.length
              : records.filter(r => r.Validation_Status === f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  statusFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 bg-slate-900/50 border border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{f.label}</span>
                <span className="font-mono text-[10px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-10">#</th>
              <th>
                <button onClick={() => toggleSort('id')} className="flex items-center gap-1 hover:text-white transition-colors">
                  SKU ID <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th>MPN</th>
              <th>
                <button onClick={() => toggleSort('brand')} className="flex items-center gap-1 hover:text-white transition-colors">
                  Brand <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="min-w-[240px]">Product Title</th>
              <th>
                <button onClick={() => toggleSort('unspsc')} className="flex items-center gap-1 hover:text-white transition-colors">
                  UNSPSC <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th>Specs</th>
              <th>
                <button onClick={() => toggleSort('score')} className="flex items-center gap-1 hover:text-white transition-colors">
                  Score <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rec, idx) => {
              const score = rec._qualityScore || 90;
              const scoreColor = score >= 90 ? '#10b981' : score >= 75 ? '#f59e0b' : '#f43f5e';
              const specs = rec._extractedSpecsObj || {};
              const specEntries = Object.entries(specs).slice(0, 3);

              return (
                <tr key={rec.Product_ID} className="group">
                  <td className="text-slate-600 font-mono text-[11px]">{idx + 1}</td>

                  <td>
                    <span className="font-mono text-xs font-bold text-indigo-400">{rec.Product_ID}</span>
                  </td>

                  <td>
                    <button
                      onClick={() => handleCopyMPN(rec.MPN, rec.Product_ID)}
                      className="font-mono text-xs text-slate-300 hover:text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1"
                    >
                      {copiedId === rec.Product_ID ? (
                        <><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Copied</>
                      ) : (
                        <><Copy className="h-3 w-3 text-slate-500" /> {rec.MPN}</>
                      )}
                    </button>
                  </td>

                  <td>
                    <span className="text-xs text-slate-300 font-medium">{rec.Brand_Name}</span>
                  </td>

                  <td>
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed max-w-[280px]">
                      {rec.Product_Title}
                    </p>
                  </td>

                  <td>
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3 w-3 text-violet-400 shrink-0" />
                      <span className="font-mono text-[11px] text-violet-300 font-bold">{rec.UNSPSC_Code}</span>
                    </div>
                  </td>

                  <td>
                    <div className="flex flex-wrap gap-1">
                      {specEntries.map(([k, v], i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-slate-900 text-[10px] text-slate-400 rounded border border-slate-800 font-mono truncate max-w-[100px]" title={`${k}: ${v}`}>
                          {v}
                        </span>
                      ))}
                      {Object.keys(specs).length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-500">+{Object.keys(specs).length - 3}</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full overflow-hidden bg-slate-900">
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

                  <td>
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

                  <td className="text-right">
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
      <div className="px-5 py-3 border-t border-slate-800/80 flex items-center justify-between">
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
