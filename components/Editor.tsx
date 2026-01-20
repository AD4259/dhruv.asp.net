
import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import { FileNode, Theme } from '../types';
import { X, FileCode } from 'lucide-react';

interface EditorProps {
  file: FileNode;
  onChange: (content: string) => void;
  currentTheme: Theme;
  fontSize: number;
}

export const Editor: React.FC<EditorProps> = ({ file, onChange, currentTheme, fontSize }) => {
  const getLanguage = (fileName: string) => {
    if (fileName.endsWith('.cs')) return 'csharp';
    if (fileName.endsWith('.json')) return 'json';
    if (fileName.endsWith('.cshtml')) return 'razor';
    if (fileName.endsWith('.csproj')) return 'xml';
    return 'plaintext';
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: currentTheme.colors.editorBg }}>
      {/* Tab Bar */}
      <div 
        className="flex border-b overflow-x-auto shrink-0 scrollbar-none"
        style={{ backgroundColor: currentTheme.colors.sidebarBg, borderColor: currentTheme.colors.border }}
      >
        <div 
          className="relative flex items-center px-4 py-2 border-t text-[11px] space-x-3 min-w-[120px] shadow-[0_-4px_10px_rgba(0,0,0,0.3)]"
          style={{ 
            backgroundColor: currentTheme.colors.editorBg, 
            borderTopColor: currentTheme.colors.accent,
            color: currentTheme.colors.textMain 
          }}
        >
          <FileCode size={14} className="shrink-0" style={{ color: currentTheme.colors.accent }} />
          <span className="truncate flex-1 font-medium">{file.name}</span>
          <button 
            className="p-0.5 rounded transition shrink-0"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.border}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={12} style={{ color: currentTheme.colors.textMuted }} />
          </button>
        </div>
        
        {/* Placeholder for more tabs */}
        <div className="flex-1" style={{ backgroundColor: currentTheme.colors.sidebarBg }} />
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative group">
        <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-10 transition pointer-events-none z-10 select-none">
          <FileCode size={120} style={{ color: currentTheme.colors.textMuted }} strokeWidth={1} />
        </div>
        
        <MonacoEditor
          height="100%"
          language={getLanguage(file.name)}
          value={file.content || ''}
          theme={currentTheme.colors.monacoTheme}
          options={{
            fontSize: fontSize,
            lineHeight: Math.round(fontSize * 1.57),
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            fontLigatures: true,
            minimap: { enabled: true, scale: 1, side: 'right' },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            roundedSelection: true,
            renderLineHighlight: 'all',
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true, indentation: true },
            wordWrap: 'on'
          }}
          onChange={(val) => onChange(val || '')}
        />
      </div>
    </div>
  );
};
