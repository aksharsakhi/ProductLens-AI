import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardMetrics from './components/DashboardMetrics';
import IngestionPanel from './components/IngestionPanel';
import ProductTable from './components/ProductTable';
import ExplainabilityModal from './components/ExplainabilityModal';
import ExportModal from './components/ExportModal';

import { SAMPLE_DATASETS } from './data/sampleDatasets';
import { processBatchCatalog, enrichProductItem } from './services/aiEnrichmentEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Initialize with default hydraulic dataset on load
  useEffect(() => {
    loadDataset('valves_hydraulics');
  }, []);

  const loadDataset = (datasetId) => {
    const found = SAMPLE_DATASETS.find(d => d.id === datasetId);
    if (found) {
      const enriched = processBatchCatalog(found.items);
      setRecords(enriched);
    }
  };

  const handleIngestCustomItem = (newItem) => {
    const enrichedItem = enrichProductItem(newItem);
    setRecords(prev => [enrichedItem, ...prev]);
    setActiveTab('catalog');
  };

  const handleUpdateRecord = (updatedRecord) => {
    setRecords(prev => 
      prev.map(r => r.Product_ID === updatedRecord.Product_ID ? updatedRecord : r)
    );
  };

  // Calculate overall catalog quality score
  const avgQualityScore = records.length > 0
    ? Math.round(records.reduce((acc, r) => acc + (r._qualityScore || 90), 0) / records.length)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-blue-600 selection:text-white">
      
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportClick={() => setShowExportModal(true)}
        totalRecords={records.length}
        qualityScore={avgQualityScore}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KPI Dashboard Metrics */}
        <DashboardMetrics records={records} />

        {/* Multi-Source Ingestion Engine Component */}
        <IngestionPanel
          onLoadDataset={loadDataset}
          onIngestCustomItem={handleIngestCustomItem}
        />

        {/* Main Product Table View */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <span>Industrial E-Commerce Product Catalog</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                Live AI Output Workspace
              </span>
            </h2>

            <button
              onClick={() => setShowExportModal(true)}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4"
            >
              View Static Output Headers Spec
            </button>
          </div>

          <ProductTable
            records={records}
            onSelectRecord={(rec) => setSelectedRecord(rec)}
            onUpdateRecord={handleUpdateRecord}
          />
        </div>

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
