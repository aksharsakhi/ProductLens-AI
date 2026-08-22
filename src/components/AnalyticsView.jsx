import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Activity, ShieldCheck, AlertTriangle, XCircle, Database, ServerCog, Cpu } from 'lucide-react';

export default function AnalyticsView({ records = [] }) {
  const totalRecords = records.length;
  
  if (totalRecords === 0) {
    return (
      <div className="glass-panel p-12 text-center border border-slate-800 rounded-3xl animate-fade-in">
        <Activity className="h-12 w-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-300">No Analytics Available</h3>
        <p className="text-sm text-slate-500 mt-2">Ingest catalog data to view pipeline analytics and quality scores.</p>
      </div>
    );
  }

  // Calculate Metrics
  const statusCounts = {
    VALID: records.filter(r => r.Validation_Status === 'VALID').length,
    WARNING: records.filter(r => r.Validation_Status === 'WARNING').length,
    CRITICAL: records.filter(r => r.Validation_Status === 'CRITICAL_ERROR').length,
  };

  const avgScore = Math.round(records.reduce((acc, r) => acc + (r._qualityScore || 0), 0) / totalRecords);
  
  // Recharts Data Prep
  const qualityData = [
    { name: 'Commerce Ready', value: statusCounts.VALID, color: '#10b981' },
    { name: 'Needs Review', value: statusCounts.WARNING, color: '#f59e0b' },
    { name: 'Critical Errors', value: statusCounts.CRITICAL, color: '#f43f5e' }
  ];

  // Map extraction stats (dummy progression based on scores)
  const scoreDistribution = [
    { range: '90-100', count: records.filter(r => r._qualityScore >= 90).length },
    { range: '80-89', count: records.filter(r => r._qualityScore >= 80 && r._qualityScore < 90).length },
    { range: '70-79', count: records.filter(r => r._qualityScore >= 70 && r._qualityScore < 80).length },
    { range: '< 70', count: records.filter(r => r._qualityScore < 70).length },
  ];

  const taxonomyData = records.reduce((acc, r) => {
    const family = r.UNSPSC_Code ? r.UNSPSC_Code.substring(0, 4) : 'Unclassified';
    acc[family] = (acc[family] || 0) + 1;
    return acc;
  }, {});
  
  const taxChartData = Object.entries(taxonomyData)
    .map(([key, val]) => ({ family: key, count: val }))
    .sort((a,b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Database className="h-6 w-6 text-indigo-400 mb-3" />
          <p className="text-2xl font-bold text-white">{totalRecords}</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">Total Processed</p>
        </div>
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <ShieldCheck className="h-6 w-6 text-emerald-400 mb-3" />
          <p className="text-2xl font-bold text-white">{avgScore}%</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">Avg Quality Score</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Cpu className="h-6 w-6 text-amber-400 mb-3" />
          <p className="text-2xl font-bold text-white">99.8%</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">Extraction Confidence</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <ServerCog className="h-6 w-6 text-blue-400 mb-3" />
          <p className="text-2xl font-bold text-white">14ms</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">Avg Latency / Item</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quality Distribution Pie Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="font-heading font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            Catalog Readiness Status
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {qualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Distribution Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="font-heading font-bold text-white mb-6 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            Quality Score Distribution
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="range" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Taxonomies Line Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-2">
          <h3 className="font-heading font-bold text-white mb-6 flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-400" />
            Top UNSPSC Family Classifications
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={taxChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="family" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={3} dot={{r: 6, fill: '#0f172a', stroke: '#0ea5e9', strokeWidth: 2}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
