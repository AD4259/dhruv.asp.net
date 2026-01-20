
import React, { useState, useEffect, useRef } from 'react';
import { BuildResult, Theme } from '../types';
import { Terminal as TerminalIcon, AlertCircle, X, Maximize2, Trash2, ChevronRight, Square, TerminalSquare } from 'lucide-react';

interface TerminalProps {
  result: BuildResult | null;
  isBuilding: boolean;
  projectType: string | undefined;
  currentTheme: Theme;
}

export const Terminal: React.FC<TerminalProps> = ({ result, isBuilding, currentTheme }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isBuilding) {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Starting build process...`, "Microsoft (R) Build Engine version 17.4.0+18d5aef85 for .NET"]);
    }
  }, [isBuilding]);

  useEffect(() => {
    if (result) {
      setLogs(prev => [...prev, result.output]);
    }
  }, [result]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full border-t" style={{ backgroundColor: currentTheme.colors.terminalBg, borderColor: currentTheme.colors.border }}>
      <div className="flex items-center px-4 h-9 shrink-0 border-b" style={{ backgroundColor: currentTheme.colors.sidebarBg, borderColor: currentTheme.colors.border }}>
        <div className="flex items-center space-x-6 h-full">
          <div 
            className="flex items-center space-x-2 text-[11px] font-bold border-b-2 px-1 h-full cursor-pointer"
            style={{ color: currentTheme.colors.textMain, borderBottomColor: currentTheme.colors.accent }}
          >
            <TerminalIcon size={14} style={{ color: currentTheme.colors.accent }} />
            <span className="uppercase tracking-widest">Output</span>
          </div>
          <div 
            className="flex items-center space-x-2 text-[11px] font-bold transition h-full cursor-pointer"
            style={{ color: currentTheme.colors.textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = currentTheme.colors.textMain}
            onMouseLeave={(e) => e.currentTarget.style.color = currentTheme.colors.textMuted}
          >
            <TerminalSquare size={14} />
            <span className="uppercase tracking-widest">Terminal</span>
          </div>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center space-x-3" style={{ color: currentTheme.colors.textMuted }}>
          <button 
            onClick={() => setLogs([])} 
            className="p-1 rounded transition"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.border;
              e.currentTarget.style.color = currentTheme.colors.textMain;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = currentTheme.colors.textMuted;
            }}
          >
            <Trash2 size={14} />
          </button>
          <div className="h-4 w-px" style={{ backgroundColor: currentTheme.colors.border }} />
          <button className="p-1 hover:text-white transition"><Maximize2 size={14} /></button>
          <button className="p-1 hover:text-white transition"><X size={14} /></button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed scrollbar-thin"
        style={{ color: currentTheme.colors.textMain }}
      >
        <div className="space-y-1">
          {logs.map((log, i) => (
            <div key={i} className="flex items-start space-x-2 group">
              <ChevronRight size={14} className="mt-1 shrink-0 opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: currentTheme.colors.accent }} />
              <pre className="whitespace-pre-wrap selection:bg-blue-900/40">{log}</pre>
            </div>
          ))}
          
          {result?.errors && result.errors.length > 0 && (
            <div className="mt-4 border-l-2 border-red-500 pl-4 py-2 bg-red-900/10 rounded-r">
              <h4 className="text-red-400 font-bold mb-2 flex items-center space-x-2">
                <AlertCircle size={16} />
                <span>Build failed with errors:</span>
              </h4>
              {result.errors.map((err, idx) => (
                <div key={idx} className="text-red-400/80 mb-1">
                  <span className="font-bold underline decoration-red-500/30">{err.file}({err.line},{err.column})</span>: 
                  <span className="mx-2 px-1 bg-red-900/40 rounded text-xs">CS{err.code}</span>
                  {err.message}
                </div>
              ))}
            </div>
          )}

          {isBuilding && (
            <div className="flex items-center space-x-2 mt-2 animate-pulse" style={{ color: currentTheme.colors.accent }}>
              <Square size={10} fill="currentColor" className="animate-spin" />
              <span>Compilation in progress...</span>
            </div>
          )}

          {!isBuilding && logs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center space-y-2 opacity-30 select-none" style={{ color: currentTheme.colors.textMuted }}>
              <TerminalIcon size={48} strokeWidth={1} />
              <p className="text-sm font-medium">IDE Terminal is ready</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
