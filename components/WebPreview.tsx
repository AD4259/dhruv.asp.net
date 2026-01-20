
import React, { useEffect, useRef, useState } from 'react';
import { Globe, RotateCcw, ExternalLink, ShieldCheck, ArrowLeft, ArrowRight, Lock, Plus, Monitor, Smartphone, Tablet, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { BuildResult, Theme } from '../types';

interface WebPreviewProps {
  result: BuildResult | null;
  isBuilding: boolean;
  onRefresh?: () => void;
  currentTheme: Theme;
  panelWidth: number; // Controlled by App.tsx
}

export const WebPreview: React.FC<WebPreviewProps> = ({ result, isBuilding, onRefresh, currentTheme, panelWidth }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const addressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result?.previewUrl && iframeRef.current) {
      const timer = setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = result.previewUrl || '';
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const scrollAddressBar = (direction: 'left' | 'right') => {
    if (addressBarRef.current) {
      const scrollAmount = 100;
      addressBarRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      className="flex flex-col h-full shadow-2xl z-10 w-full"
      style={{ 
        backgroundColor: currentTheme.colors.editorBg,
        borderColor: currentTheme.colors.border
      }}
    >
      {/* Browser Tab Strip */}
      <div className="h-9 flex items-center px-2 space-x-1 shrink-0" style={{ backgroundColor: currentTheme.colors.sidebarBg }}>
        <div 
          className="flex items-center px-4 h-full rounded-t-lg border-x border-t text-[10px] font-bold space-x-2"
          style={{ 
            backgroundColor: currentTheme.colors.editorBg, 
            borderColor: currentTheme.colors.border,
            color: currentTheme.colors.textMain
          }}
        >
           <Globe size={12} style={{ color: currentTheme.colors.accent }} />
           <span className="truncate max-w-[120px]">App Preview</span>
           <Plus size={12} style={{ color: currentTheme.colors.textMuted }} className="hover:text-white cursor-pointer" />
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-2 px-2">
           <Smartphone size={14} className="text-gray-500 hover:text-white transition cursor-pointer" />
           <Tablet size={14} className="text-gray-500 hover:text-white transition cursor-pointer" />
           <Monitor size={14} className="text-blue-400 cursor-default" />
        </div>
      </div>

      {/* Browser Navigation Bar */}
      <div className="h-10 border-b flex items-center px-3 space-x-2 shrink-0" style={{ backgroundColor: currentTheme.colors.topBarBg, borderColor: currentTheme.colors.border }}>
        <div className="flex space-x-1 mr-2 shrink-0">
          <div className="w-3 h-3 bg-[#ff5f56] rounded-full shadow-sm" />
          <div className="w-3 h-3 bg-[#ffbd2e] rounded-full shadow-sm" />
          <div className="w-3 h-3 bg-[#27c93f] rounded-full shadow-sm" />
        </div>
        
        <div className="flex items-center space-x-1 text-gray-400 shrink-0">
          <button className="p-1 hover:bg-white/5 rounded disabled:opacity-20 transition" disabled><ArrowLeft size={14} /></button>
          <button className="p-1 hover:bg-white/5 rounded disabled:opacity-20 transition" disabled><ArrowRight size={14} /></button>
          <button 
            onClick={onRefresh}
            className="p-1 hover:bg-white/5 rounded transition"
            style={{ color: currentTheme.colors.accent }}
            title="Reload Preview"
          >
            <RotateCcw size={14} className={isBuilding ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Address Bar with Scroll Controls */}
        <div className="flex-1 flex items-center space-x-1 min-w-0">
          <div 
            ref={addressBarRef}
            className="flex-1 flex items-center space-x-2 border rounded-full px-4 h-7 overflow-x-auto scrollbar-none shadow-inner group transition-all"
            style={{ backgroundColor: currentTheme.colors.sidebarBg, borderColor: currentTheme.colors.border }}
          >
            <Lock size={12} className="text-green-500 shrink-0" />
            <span className="text-[11px] whitespace-nowrap font-mono selection:bg-blue-900" style={{ color: currentTheme.colors.textMuted }}>
              https://localhost:5001/api/v1/sandbox/runtime/dotnet-web-ide-instance-active
            </span>
          </div>
        </div>

        <button className="p-1 text-gray-500 hover:text-white transition shrink-0">
          <ExternalLink size={14} />
        </button>
      </div>

      {/* Browser Content Area */}
      <div className="flex-1 bg-white overflow-hidden relative shadow-inner">
        {isBuilding && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex items-center justify-center z-20 transition-all duration-300">
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                <Globe className="absolute inset-0 m-auto text-blue-500/20" size={32} />
              </div>
              <p className="mt-6 text-gray-800 text-sm font-bold tracking-tight">Deploying to Local Cluster...</p>
              <p className="text-gray-400 text-[10px] mt-1 font-mono uppercase tracking-widest">ASP.NET 7.0 RUNTIME</p>
            </div>
          </div>
        )}

        {result?.previewUrl ? (
          <div className="w-full h-full overflow-auto flex justify-center bg-gray-100 p-4">
             <div 
               className="bg-white shadow-2xl transition-all duration-300 overflow-hidden w-full h-full"
             >
                <iframe
                  ref={iframeRef}
                  title="Web Preview"
                  className="w-full h-full border-none bg-white animate-in zoom-in-95 duration-500"
                  sandbox="allow-scripts allow-forms allow-same-origin"
                />
             </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-[#f8f9fa] selection:bg-blue-100">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center max-w-sm">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-inner ring-8 ring-blue-50/50">
                <Globe size={48} className="text-blue-400" />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-3 tracking-tight">Runtime Initialized</h4>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                The sandbox environment is waiting for your source code. Run the project to inject the ASP.NET pipeline.
              </p>
              <button 
                onClick={onRefresh}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <Plus size={18} />
                <span>Initialize Host</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="h-7 border-t flex items-center px-4 justify-between select-none" style={{ backgroundColor: currentTheme.colors.sidebarBg, borderColor: currentTheme.colors.border }}>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: currentTheme.colors.textMuted }}>Secure Host</span>
        </div>
        <div className="flex items-center space-x-4">
           <span className="text-[10px] font-medium" style={{ color: currentTheme.colors.textMuted }}>127.0.0.1:5001</span>
           <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: currentTheme.colors.textMuted }}>DotNetWeb Engine</span>
        </div>
      </div>
    </div>
  );
};
