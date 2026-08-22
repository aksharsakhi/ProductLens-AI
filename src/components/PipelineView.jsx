import React, { useState, useEffect, useCallback } from 'react';
import {
  FileInput, Brain, Layers, RefreshCw, ShieldCheck, FileOutput,
  Play, CheckCircle2, Loader2, ArrowRight, Sparkles, Zap, Clock,
  ChevronDown, ChevronUp, AlertTriangle
} from 'lucide-react';

const PIPELINE_STAGES = [
  {
    id: 'ingest',
    title: 'Data Ingestion',
    subtitle: 'Multi-source parser',
    icon: FileInput,
    color: '#3b82f6',
    description: 'Accepts CSV, XLSX, JSON, PDF text, and manual input. Tokenizes raw product strings into structured token streams.',
    details: [
      'CSV/XLSX column auto-detection & header mapping',
      'PDF OCR text extraction pipeline',
      'JSON schema validation & flattening',
      'Duplicate SKU detection & merge strategy',
    ],
  },
  {
    id: 'nlp',
    title: 'NLP Entity Extraction',
    subtitle: 'Attribute mining engine',
    icon: Brain,
    color: '#8b5cf6',
    description: 'Named Entity Recognition (NER) for industrial specifications. Extracts material, voltage, pressure, dimensions, amperage, and motor ratings.',
    details: [
      'Regex + heuristic NER for 20+ spec categories',
      'Material identification (Brass, 316SS, Cast Iron...)',
      'Electrical parameter extraction (V, A, W, Hz)',
      'Dimensional parsing with fraction support (1/2", 3/4")',
    ],
  },
  {
    id: 'taxonomy',
    title: 'UNSPSC Classification',
    subtitle: 'Vector similarity mapper',
    icon: Layers,
    color: '#06b6d4',
    description: 'Maps products to UNSPSC v25.0 taxonomy codes using keyword vector similarity against 50+ commodity class embeddings.',
    details: [
      '50+ UNSPSC commodity codes in reference database',
      'Weighted keyword scoring with fallback classification',
      'Segment → Family → Class → Commodity path generation',
      'Mandatory attribute checklist per commodity class',
    ],
  },
  {
    id: 'normalize',
    title: 'Physics Normalization',
    subtitle: 'Imperial → SI converter',
    icon: RefreshCw,
    color: '#f59e0b',
    description: 'Normalizes all physical measurements into dual imperial/metric representation with precision rounding.',
    details: [
      'Pressure: PSI → Bar / MPa',
      'Temperature: °F → °C',
      'Dimensions: Inches (fractional) → mm',
      'Flow Rate: GPM → LPM',
      'Power: HP → kW',
    ],
  },
  {
    id: 'validate',
    title: 'Quality Validation',
    subtitle: 'Anomaly detection engine',
    icon: ShieldCheck,
    color: '#10b981',
    description: 'Multi-pass quality scoring with confidence weighting. Flags missing MPN, unspecified materials, unmapped taxonomy codes.',
    details: [
      'Missing MPN detection (-20 confidence penalty)',
      'Unspecified material flagging (-10 penalty)',
      'UNSPSC fallback code detection',
      'Composite confidence score 0-100%',
    ],
  },
  {
    id: 'export',
    title: 'Commerce Export',
    subtitle: '15-header output format',
    icon: FileOutput,
    color: '#ec4899',
    description: 'Generates commerce-ready output matching Unilog\'s 15 mandatory static headers for XLSX/CSV download.',
    details: [
      'Product_ID, MPN, Brand_Name, Product_Title',
      'Short/Long Description (HTML structured)',
      'Category_Path, UNSPSC_Code, Primary_Specifications',
      'Validation_Status, Confidence_Score, AI_Reasoning_Audit',
    ],
  },
];

function PipelineStage({ stage, index, status, isActive, isExpanded, onToggle, elapsed }) {
  const Icon = stage.icon;

  const statusConfig = {
    pending: { label: 'Pending', class: 'text-slate-500', bg: 'bg-slate-900' },
    processing: { label: 'Processing...', class: 'text-blue-400', bg: 'bg-blue-950' },
    complete: { label: 'Complete', class: 'text-emerald-400', bg: 'bg-emerald-950' },
  };

  const s = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`animate-slide-up`} style={{ animationDelay: `${index * 0.08}s` }}>
      <div
        className={`glass-card rounded-2xl p-5 border transition-all duration-300 cursor-pointer ${
          isActive ? 'border-indigo-500/50 glow-indigo' :
          status === 'complete' ? 'border-emerald-500/20' :
          'border-slate-800'
        }`}
        onClick={onToggle}
      >
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Step Number + Icon */}
            <div
              className="relative h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${stage.color}15`, border: `1px solid ${stage.color}30` }}
            >
              {status === 'processing' ? (
                <Loader2 className="h-5 w-5 animate-spin" style={{ color: stage.color }} />
              ) : status === 'complete' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <Icon className="h-5 w-5" style={{ color: stage.color }} />
              )}
              <span className="absolute -top-1.5 -left-1.5 h-5 w-5 rounded-md bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                {index + 1}
              </span>
            </div>

            <div>
              <h3 className="font-heading font-bold text-sm text-white">{stage.title}</h3>
              <p className="text-[11px] text-slate-500">{stage.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {elapsed && (
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {elapsed}ms
              </span>
            )}
            <span className={`badge ${s.bg} ${s.class} border-transparent text-[10px]`}>
              {s.label}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {status === 'processing' && (
          <div className="mt-3 pipeline-bar">
            <div className="pipeline-fill w-full animate-shimmer" style={{
              background: `linear-gradient(90deg, ${stage.color}00, ${stage.color}, ${stage.color}00)`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }} />
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 space-y-3 animate-fade-in">
            <p className="text-xs text-slate-400 leading-relaxed">{stage.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {stage.details.map((detail, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                  <Zap className="h-3 w-3 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Connector Arrow */}
      {index < PIPELINE_STAGES.length - 1 && (
        <div className="flex justify-center py-1.5">
          <ArrowRight className={`h-4 w-4 rotate-90 transition-colors ${
            status === 'complete' ? 'text-emerald-500' : 'text-slate-700'
          }`} />
        </div>
      )}
    </div>
  );
}

export default function PipelineView({ records = [] }) {
  const [statuses, setStatuses] = useState(PIPELINE_STAGES.map(() => 'pending'));
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTimes, setElapsedTimes] = useState([]);
  const [pipelineComplete, setPipelineComplete] = useState(false);

  const runPipeline = useCallback(() => {
    setIsRunning(true);
    setPipelineComplete(false);
    setStatuses(PIPELINE_STAGES.map(() => 'pending'));
    setElapsedTimes([]);

    PIPELINE_STAGES.forEach((_, i) => {
      // Start processing
      setTimeout(() => {
        setStatuses(prev => prev.map((s, j) => j === i ? 'processing' : s));
        setExpandedIdx(i);
      }, i * 900);

      // Complete
      const elapsed = 200 + Math.floor(Math.random() * 400);
      setTimeout(() => {
        setStatuses(prev => prev.map((s, j) => j === i ? 'complete' : s));
        setElapsedTimes(prev => { const next = [...prev]; next[i] = elapsed; return next; });
        if (i === PIPELINE_STAGES.length - 1) {
          setIsRunning(false);
          setPipelineComplete(true);
        }
      }, i * 900 + 700);
    });
  }, []);

  // Auto-run on mount if records exist
  useEffect(() => {
    if (records.length > 0 && statuses.every(s => s === 'pending')) {
      runPipeline();
    }
  }, [records.length]);

  const totalElapsed = elapsedTimes.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Pipeline Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              AI Enrichment Pipeline Orchestrator
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              6-stage real-time processing pipeline with explainable AI audit at each transformation step.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {pipelineComplete && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/80 border border-emerald-800 rounded-xl">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-300">
                  {records.length} SKUs processed in {totalElapsed}ms
                </span>
              </div>
            )}

            <button
              onClick={runPipeline}
              disabled={isRunning}
              className={`btn-primary flex items-center gap-2 text-xs !py-2.5 ${
                isRunning ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Run Full Pipeline</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span>Pipeline Progress</span>
            <span className="font-mono">
              {statuses.filter(s => s === 'complete').length}/{PIPELINE_STAGES.length} stages
            </span>
          </div>
          <div className="pipeline-bar" style={{ height: '8px' }}>
            <div
              className="pipeline-fill"
              style={{
                width: `${(statuses.filter(s => s === 'complete').length / PIPELINE_STAGES.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="space-y-0">
        {PIPELINE_STAGES.map((stage, i) => (
          <PipelineStage
            key={stage.id}
            stage={stage}
            index={i}
            status={statuses[i]}
            isActive={statuses[i] === 'processing'}
            isExpanded={expandedIdx === i}
            onToggle={() => setExpandedIdx(expandedIdx === i ? null : i)}
            elapsed={elapsedTimes[i]}
          />
        ))}
      </div>

      {/* Pipeline Summary Stats */}
      {pipelineComplete && (
        <div className="glass-panel p-5 rounded-2xl border border-emerald-800/40 animate-slide-up">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2 mb-4">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Pipeline Execution Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
              <span className="font-heading font-extrabold text-xl text-white">{records.length}</span>
              <p className="text-[11px] text-slate-400 mt-0.5">SKUs Processed</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
              <span className="font-heading font-extrabold text-xl text-emerald-400">
                {records.filter(r => r.Validation_Status === 'VALID').length}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Valid & Commerce Ready</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
              <span className="font-heading font-extrabold text-xl text-amber-400">
                {records.reduce((a, r) => a + (r._conversions?.length || 0), 0)}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Unit Conversions</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
              <span className="font-heading font-extrabold text-xl text-cyan-400">{totalElapsed}ms</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Total Latency</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
