import React, { useState } from 'react';
import { Tag, Search, Check, FolderTree, Sparkles } from 'lucide-react';

const UNSPSC_CATALOG_CODES = [
  { code: '40141602', title: 'Solenoid Valves', category: 'Industrial Valves & Fluid Control > Solenoid Valves', segment: 'Industrial Manufacturing Machinery (40000000)' },
  { code: '40141607', title: 'Ball Valves', category: 'Industrial Valves & Fluid Control > Ball Valves', segment: 'Industrial Manufacturing Machinery (40000000)' },
  { code: '40141609', title: 'Needle Valves', category: 'Industrial Valves & Fluid Control > Needle Valves', segment: 'Industrial Manufacturing Machinery (40000000)' },
  { code: '40141611', title: 'Butterfly Valves', category: 'Industrial Valves & Fluid Control > Butterfly Valves', segment: 'Industrial Manufacturing Machinery (40000000)' },
  { code: '40151503', title: 'Centrifugal Pumps', category: 'Pumps & Fluid Transfer > Centrifugal Pumps', segment: 'Industrial Manufacturing Machinery (40000000)' },
  { code: '40151504', title: 'Positive Displacement Pumps', category: 'Pumps & Fluid Transfer > Displacement Pumps', segment: 'Industrial Manufacturing Machinery (40000000)' },
  { code: '40151512', title: 'Submersible Sump Pumps', category: 'Pumps & Fluid Transfer > Submersible Pumps', segment: 'Industrial Manufacturing Machinery (40000000)' },
  { code: '39121601', title: 'Circuit Breakers', category: 'Electrical & Automation > Circuit Breakers', segment: 'Electrical Systems & Components (39000000)' },
  { code: '39121521', title: 'Motor Starters & Contactors', category: 'Electrical & Automation > Motor Controls', segment: 'Electrical Systems & Components (39000000)' },
  { code: '39121006', title: 'Power Supplies', category: 'Electrical & Automation > Power Supplies', segment: 'Electrical Systems & Components (39000000)' },
  { code: '39122001', title: 'Variable Frequency Drives (VFD)', category: 'Electrical & Automation > Drives', segment: 'Electrical Systems & Components (39000000)' },
  { code: '31171501', title: 'Ball Bearings', category: 'Bearings & Motion Controls > Ball Bearings', segment: 'Manufacturing Components (31000000)' },
  { code: '31171504', title: 'Pillow Block Bearings', category: 'Bearings & Motion Controls > Mounted Bearings', segment: 'Manufacturing Components (31000000)' },
  { code: '31171520', title: 'Linear Motion Guides', category: 'Bearings & Motion Controls > Linear Guides', segment: 'Manufacturing Components (31000000)' }
];

export default function TaxonomyBrowser() {
  const [query, setQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const filtered = UNSPSC_CATALOG_CODES.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.code.includes(query) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-purple-400" />
            UNSPSC v25.0 Taxonomy Code Finder
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse and query global Universal Supplier Products and Services Codes used by ProductLens AI.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search taxonomy code or title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.code} className="glass-card p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-800/80">
                  {item.code}
                </span>
                
                <button
                  onClick={() => handleCopy(item.code)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {copiedCode === item.code ? (
                    <span className="text-emerald-400 font-medium">Copied</span>
                  ) : (
                    <span>Copy</span>
                  )}
                </button>
              </div>

              <h3 className="font-heading text-sm font-bold text-white mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 mb-2">
                {item.category}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
              Segment: {item.segment}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
