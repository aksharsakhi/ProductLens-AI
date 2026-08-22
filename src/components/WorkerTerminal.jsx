import React, { useEffect, useRef } from 'react';
import { Terminal, X, Minimize2, Maximize2, Server, Activity } from 'lucide-react';

export default function WorkerTerminal({ logs, onClose, isProcessing }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-64 bg-[#0a0c10] border-t border-slate-800 z-50 flex flex-col font-mono animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Terminal className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-bold text-slate-300">node-1.productlens.internal / Worker Process</span>
          
          {isProcessing ? (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              <Activity className="h-3 w-3 animate-pulse" /> PROCESSING
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
              <Server className="h-3 w-3" /> IDLE
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 custom-scrollbar text-[11px] leading-relaxed"
      >
        {logs.length === 0 ? (
          <div className="text-slate-600">Waiting for batch ingestion events...</div>
        ) : (
          logs.map((log, index) => {
            // Color code based on log content
            let textColor = 'text-slate-300';
            let prefixColor = 'text-slate-500';
            
            if (log.includes('CRITICAL_ERROR')) textColor = 'text-rose-400';
            else if (log.includes('WARNING')) textColor = 'text-amber-400';
            else if (log.includes('VALID')) textColor = 'text-emerald-400';
            else if (log.includes('SPAWNING')) textColor = 'text-blue-400';
            else if (log.includes('SUCCESS')) textColor = 'text-emerald-300';

            return (
              <div key={index} className="flex gap-3 hover:bg-slate-900/50 py-0.5 px-1 rounded">
                <span className={`shrink-0 w-24 ${prefixColor}`}>
                  {new Date().toISOString().split('T')[1].slice(0, 12)}
                </span>
                <span className="shrink-0 text-slate-500">[WORKER-01]</span>
                <span className={`${textColor} break-all`}>
                  {log}
                </span>
              </div>
            );
          })
        )}
        
        {isProcessing && (
          <div className="flex gap-3 py-0.5 px-1 mt-2 animate-pulse">
            <span className="text-slate-500">{new Date().toISOString().split('T')[1].slice(0, 12)}</span>
            <span className="text-slate-500">[WORKER-01]</span>
            <span className="text-slate-400">████████████░░░░░░░░░░</span>
          </div>
        )}
      </div>
    </div>
  );
}
