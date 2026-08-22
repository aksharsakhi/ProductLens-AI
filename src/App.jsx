import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import DashboardMetrics from './components/DashboardMetrics';
import IngestionPanel from './components/IngestionPanel';
import ProductTable from './components/ProductTable';
import ProductCardsView from './components/ProductCardsView';
import PipelineView from './components/PipelineView';
import AnalyticsView from './components/AnalyticsView';
import TaxonomyBrowser from './components/TaxonomyBrowser';
import RuleConfigurator from './components/RuleConfigurator';
import ExplainabilityModal from './components/ExplainabilityModal';
import ExportModal from './components/ExportModal';

import { SAMPLE_DATASETS } from './data/sampleDatasets';
import { processBatchCatalog, enrichProductItem } from './services/aiEnrichmentEngine';

export default function App() {
  const [viewMode, setViewMode] = useState('table');
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [customRules, setCustomRules] = useState([
    { id: '1', keyword: 'IP65', targetField: 'Enclosure Rating', targetValue: 'IP65 Weatherproof' },
    { id: '2', keyword: 'NPT', targetField: 'Thread Standard', targetValue: 'ANSI/ASME B1.20.1 NPT' },
    { id: '3', keyword: 'TEFC', targetField: 'Motor Enclosure', targetValue: 'Totally Enclosed Fan Cooled' },
    { id: '4', keyword: 'Explosion Proof', targetField: 'Hazard Class', targetValue: 'Class 1 Div 1 / ATEX Zone 1' },
  ]);

  const showNotification = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Initialize with all datasets loaded on first render
  useEffect(() => {
    loadAllDatasets();
  }, []);

  const loadAllDatasets = () => {
    const allItems = SAMPLE_DATASETS.flatMap(d => d.items);
    setIsProcessing(true);
    // Simulate brief processing delay for realism
    setTimeout(() => {
      const enriched = processBatchCatalog(allItems, customRules);
      setRecords(enriched);
      setIsProcessing(false);
      showNotification(`${enriched.length} products enriched across ${SAMPLE_DATASETS.length} industrial datasets`);
    }, 300);
  };

  const loadDataset = (datasetId) => {
    const found = SAMPLE_DATASETS.find(d => d.id === datasetId);
    if (found) {
      setIsProcessing(true);
      setTimeout(() => {
        const enriched = processBatchCatalog(found.items, customRules);
        setRecords(enriched);
        setIsProcessing(false);
        showNotification(`Loaded ${enriched.length} products from "${found.name}"`);
      }, 200);
    }
  };

  const handleIngestCustomItem = (newItem) => {
    const enrichedItem = enrichProductItem(newItem, customRules);
    setRecords(prev => [enrichedItem, ...prev]);
    showNotification(`Ingested & enriched product "${newItem.raw_id}"`);
  };

  const handleUpdateRecord = (updatedRecord) => {
    setRecords(prev =>
      prev.map(r => r.Product_ID === updatedRecord.Product_ID ? updatedRecord : r)
    );
  };

  const handleAddRule = (newRule) => {
    setCustomRules(prev => [...prev, newRule]);
    showNotification(`Rule added: IF "${newRule.keyword}" → SET ${newRule.targetField}`);
  };

  const handleDeleteRule = (ruleId) => {
    setCustomRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const handleApplyRules = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setRecords(prev => prev.map(r => enrichProductItem(r._raw, customRules)));
      setIsProcessing(false);
      showNotification(`Re-enriched ${records.length} products with ${customRules.length} custom rules`);
    }, 200);
  };

  const avgQualityScore = records.length > 0
    ? Math.round(records.reduce((acc, r) => acc + (r._qualityScore || 90), 0) / records.length)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#050810] text-slate-100">

      {/* Global Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl border text-sm font-medium shadow-lg animate-slide-in-right max-w-sm ${
          notification.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-800 text-emerald-300'
            : notification.type === 'error'
            ? 'bg-rose-950/90 border-rose-800 text-rose-300'
            : 'bg-blue-950/90 border-blue-800 text-blue-300'
        }`} style={{ backdropFilter: 'blur(12px)' }}>
          {notification.msg}
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel p-8 rounded-2xl border border-indigo-800/40 text-center animate-scale-in">
            <div className="h-12 w-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="font-heading font-bold text-white">Processing Catalog...</p>
            <p className="text-xs text-slate-400 mt-1">Running AI enrichment pipeline</p>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExportClick={() => setShowExportModal(true)}
        totalRecords={records.length}
        qualityScore={avgQualityScore}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* KPI Dashboard (table & cards views) */}
        {(viewMode === 'table' || viewMode === 'cards') && (
          <DashboardMetrics records={records} />
        )}

        {/* Ingestion Panel (table & cards views) */}
        {(viewMode === 'table' || viewMode === 'cards') && (
          <IngestionPanel
            onLoadDataset={loadDataset}
            onIngestCustomItem={handleIngestCustomItem}
          />
        )}

        {/* View Router */}
        {viewMode === 'table' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <span>E-Commerce Catalog Studio</span>
                <span className="badge badge-blue text-[10px]">Grid View</span>
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={loadAllDatasets}
                  className="btn-ghost text-xs flex items-center gap-1.5"
                >
                  Load All {SAMPLE_DATASETS.reduce((a, d) => a + d.items.length, 0)} Products
                </button>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4"
                >
                  Verify 15 Output Headers
                </button>
              </div>
            </div>
            <ProductTable
              records={records}
              onSelectRecord={(rec) => setSelectedRecord(rec)}
              onUpdateRecord={handleUpdateRecord}
            />
          </div>
        )}

        {viewMode === 'cards' && (
          <ProductCardsView
            records={records}
            onSelectRecord={(rec) => setSelectedRecord(rec)}
          />
        )}

        {viewMode === 'pipeline' && (
          <PipelineView records={records} />
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

      {/* Modals */}
      {selectedRecord && (
        <ExplainabilityModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onSaveRecord={handleUpdateRecord}
        />
      )}

      {showExportModal && (
        <ExportModal
          records={records}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-6 bg-[#050810]/80 text-center">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              ProductLens AI &copy; 2026 — Built for UniHack by Unilog
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-600 font-mono">UNSPSC v25.0</span>
            <span className="text-[11px] text-slate-600">•</span>
            <span className="text-[11px] text-slate-600 font-mono">XAI Audit Engine</span>
            <span className="text-[11px] text-slate-600">•</span>
            <span className="text-[11px] text-slate-600 font-mono">XLSX/CSV Exporter</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
