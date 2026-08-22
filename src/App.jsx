import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardMetrics from './components/DashboardMetrics';
import IngestionPanel from './components/IngestionPanel';
import ProductTable from './components/ProductTable';
import ProductCardsView from './components/ProductCardsView';
import AnalyticsView from './components/AnalyticsView';
import TaxonomyBrowser from './components/TaxonomyBrowser';
import RuleConfigurator from './components/RuleConfigurator';
import ExplainabilityModal from './components/ExplainabilityModal';
import ExportModal from './components/ExportModal';

import { SAMPLE_DATASETS } from './data/sampleDatasets';
import { processBatchCatalog, enrichProductItem } from './services/aiEnrichmentEngine';

export default function App() {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards' | 'analytics' | 'taxonomy' | 'rules'
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [customRules, setCustomRules] = useState([
    { id: '1', keyword: 'IP65', targetField: 'Enclosure Rating', targetValue: 'IP65 Weatherproof' },
    { id: '2', keyword: 'NPT', targetField: 'Thread Standard', targetValue: 'ANSI/ASME B1.20.1 NPT' }
  ]);

  // Initialize with default hydraulic dataset on load
  useEffect(() => {
    loadDataset('valves_hydraulics');
  }, []);

  const loadDataset = (datasetId) => {
    const found = SAMPLE_DATASETS.find(d => d.id === datasetId);
    if (found) {
      const enriched = processBatchCatalog(found.items, customRules);
      setRecords(enriched);
    }
  };

  const handleIngestCustomItem = (newItem) => {
    const enrichedItem = enrichProductItem(newItem, customRules);
    setRecords(prev => [enrichedItem, ...prev]);
  };

  const handleUpdateRecord = (updatedRecord) => {
    setRecords(prev => 
      prev.map(r => r.Product_ID === updatedRecord.Product_ID ? updatedRecord : r)
    );
  };

  const handleAddRule = (newRule) => {
    setCustomRules(prev => [...prev, newRule]);
  };

  const handleDeleteRule = (ruleId) => {
    setCustomRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const handleApplyRules = () => {
    setRecords(prev => prev.map(r => enrichProductItem(r._raw, customRules)));
  };

  // Calculate overall catalog quality score
  const avgQualityScore = records.length > 0
    ? Math.round(records.reduce((acc, r) => acc + (r._qualityScore || 90), 0) / records.length)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExportClick={() => setShowExportModal(true)}
        totalRecords={records.length}
        qualityScore={avgQualityScore}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* KPI Dashboard Metrics (shown in studio & cards view) */}
        {(viewMode === 'table' || viewMode === 'cards') && (
          <DashboardMetrics records={records} />
        )}

        {/* Multi-Source Ingestion Engine Component */}
        {(viewMode === 'table' || viewMode === 'cards') && (
          <IngestionPanel
            onLoadDataset={loadDataset}
            onIngestCustomItem={handleIngestCustomItem}
          />
        )}

        {/* Dynamic View Mode Renderer */}
        {viewMode === 'table' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <span>Industrial E-Commerce Product Catalog</span>
                <span className="text-xs font-normal text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                  Studio Grid View
                </span>
              </h2>

              <button
                onClick={() => setShowExportModal(true)}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4"
              >
                Verify 15 Static Output Headers Spec
              </button>
            </div>

            <ProductTable
              records={records}
              onSelectRecord={(rec) => setSelectedRecord(rec)}
              onUpdateRecord={handleUpdateRecord}
            />
          </div>
        )}

        {viewMode === 'cards' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <span>E-Commerce Visual Card Catalog</span>
                <span className="text-xs font-normal text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                  Customer-Facing Layout
                </span>
              </h2>
            </div>

            <ProductCardsView
              records={records}
              onSelectRecord={(rec) => setSelectedRecord(rec)}
            />
          </div>
        )}

        {viewMode === 'analytics' && (
          <AnalyticsView records={records} />
        )}

        {viewMode === 'taxonomy' && (
          <TaxonomyBrowser />
        )}

        {viewMode === 'rules' && (
          <RuleConfigurator
            customRules={customRules}
            onAddRule={handleAddRule}
            onDeleteRule={handleDeleteRule}
            onApplyRules={handleApplyRules}
          />
        )}

      </main>

      {/* AI Explainability & Audit Modal */}
      {selectedRecord && (
        <ExplainabilityModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onSaveRecord={handleUpdateRecord}
        />
      )}

      {/* XLSX / CSV Export Modal */}
      {showExportModal && (
        <ExportModal
          records={records}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Page Footer */}
      <footer className="border-t border-slate-800/80 py-6 bg-slate-950/60 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>ProductLens AI &copy; 2026 — Built for UniHack Hackathon by Unilog</span>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 font-mono text-[11px]">UNSPSC v25.0 Taxon Engine</span>
            <span className="text-slate-400 font-mono text-[11px]">XLSX / CSV Static Exporter</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
