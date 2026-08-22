import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle2, AlertTriangle, XCircle, ChevronRight, Edit2, Tag } from 'lucide-react';

export default function ProductTable({ records = [], onSelectRecord, onUpdateRecord }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter records
  const filtered = records.filter(rec => {
    const matchesSearch = 
      (rec.Product_Title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.MPN || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.Brand_Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.UNSPSC_Code || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && rec.Validation_Status === statusFilter;
  });

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      
      {/* Table Action Bar */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Title, MPN, Brand, UNSPSC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'ALL'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({records.length})
          </button>
          
          <button
            onClick={() => setStatusFilter('VALID')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              statusFilter === 'VALID'
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Valid ({records.filter(r => r.Validation_Status === 'VALID').length})
          </button>

          <button
            onClick={() => setStatusFilter('WARNING')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              statusFilter === 'WARNING'
                ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Warnings ({records.filter(r => r.Validation_Status === 'WARNING').length})
          </button>
        </div>

      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Product / MPN</th>
              <th className="py-3 px-4">Standardized E-Commerce Title</th>
              <th className="py-3 px-4">Taxonomy & UNSPSC</th>
              <th className="py-3 px-4">Extracted Specifications</th>
              <th className="py-3 px-4">Quality & Status</th>
              <th className="py-3 px-4 text-right">AI Audit Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No product records match the filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((record, idx) => {
                const score = parseInt(record.Confidence_Score) || 90;
                
                return (
                  <tr 
                    key={record.Product_ID || idx}
                    className="hover:bg-slate-900/60 transition-colors group"
                  >
                    {/* Column 1: ID & MPN */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] font-bold text-blue-400">
                        {record.Product_ID}
                      </div>
                      <div className="text-slate-300 font-semibold mt-0.5">
                        {record.Brand_Name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {record.MPN}
                      </div>
                    </td>

                    {/* Column 2: Standardized Title */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-slate-100 group-hover:text-blue-300 transition-colors line-clamp-2">
                        {record.Product_Title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                        Raw: {record._raw?.raw_input}
                      </div>
                    </td>

                    {/* Column 3: Category & UNSPSC */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-800/60 text-purple-300 font-mono text-[11px]">
                        <Tag className="h-3 w-3" />
                        <span>UNSPSC {record.UNSPSC_Code}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 max-w-[180px] truncate">
                        {record.Category_Path}
                      </div>
                    </td>

                    {/* Column 4: Specs */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-[11px] font-mono text-slate-300 line-clamp-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                        {record.Primary_Specifications}
                      </div>
                      {record._conversions && record._conversions.length > 0 && (
                        <div className="text-[10px] text-amber-400 font-mono mt-1">
                          ⚡ Normalizations: {record._conversions.map(c => `${c.imperial} → ${c.metric}`).join(', ')}
                        </div>
                      )}
                    </td>

                    {/* Column 5: Status & Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        {record.Validation_Status === 'VALID' && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-semibold text-[11px]">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Valid</span>
                          </span>
                        )}
                        {record.Validation_Status === 'WARNING' && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-400 font-semibold text-[11px]">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Warning</span>
                          </span>
                        )}
                        {record.Validation_Status === 'CRITICAL_ERROR' && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-rose-400 font-semibold text-[11px]">
                            <XCircle className="h-3 w-3" />
                            <span>Error</span>
                          </span>
                        )}
                        <span className="font-mono text-xs text-slate-300 font-medium">
                          {score}%
                        </span>
                      </div>
                      <div className="w-24 bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${
                            score >= 90 ? 'bg-emerald-500' : score >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </td>

                    {/* Column 6: Action Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectRecord(record)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 border border-blue-800/80 text-blue-300 rounded-xl text-xs font-medium transition-all"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Audit AI</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
