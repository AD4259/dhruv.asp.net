
import React, { useState } from 'react';
import { FileNode, Theme } from '../types';
import { ChevronDown, ChevronRight, FileCode, Folder, FolderOpen, Search, GitBranch, Package, Plus, MoreHorizontal } from 'lucide-react';

interface SidebarProps {
  files: Record<string, FileNode>;
  rootId: string;
  activeFileId: string | null;
  onSelectFile: (id: string) => void;
  currentTheme: Theme;
}

export const Sidebar: React.FC<SidebarProps> = ({ files, rootId, activeFileId, onSelectFile, currentTheme }) => {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set([rootId]));

  const toggleFolder = (id: string) => {
    setOpenFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderNode = (id: string, depth: number = 0) => {
    const node = files[id];
    if (!node) return null;

    const isOpen = openFolders.has(id);
    const isActive = activeFileId === id;

    return (
      <div key={id} className="select-none">
        <div 
          onClick={() => node.type === 'folder' ? toggleFolder(id) : onSelectFile(id)}
          className={`group flex items-center py-1 px-2 cursor-pointer transition-colors relative whitespace-nowrap overflow-hidden`}
          style={{ 
            paddingLeft: `${depth * 12 + 12}px`,
            backgroundColor: isActive ? currentTheme.colors.border : 'transparent',
            color: isActive ? currentTheme.colors.textMain : currentTheme.colors.textMuted
          }}
          onMouseEnter={(e) => {
            if (!isActive) e.currentTarget.style.backgroundColor = `${currentTheme.colors.border}50`;
          }}
          onMouseLeave={(e) => {
            if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: currentTheme.colors.accent }} />}
          
          <span className="mr-2 shrink-0" style={{ color: currentTheme.colors.textMuted }}>
            {node.type === 'folder' ? (
              isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            ) : (
              <FileCode size={16} className={node.name.endsWith('.cs') ? 'text-blue-400' : ''} />
            )}
          </span>
          
          {node.type === 'folder' && (
            <span className="mr-2 shrink-0" style={{ color: currentTheme.colors.accent }}>
              {isOpen ? <FolderOpen size={16} /> : <Folder size={16} />}
            </span>
          )}
          
          <span className={`text-xs truncate flex-1 ${isActive ? 'font-semibold' : ''}`} style={{ color: isActive ? currentTheme.colors.textMain : 'inherit' }}>
            {node.name}
          </span>

          <div className="hidden group-hover:flex items-center space-x-1 ml-2 shrink-0">
            <Plus size={12} className="hover:text-white transition" style={{ color: currentTheme.colors.textMuted }} />
            <MoreHorizontal size={12} className="hover:text-white transition" style={{ color: currentTheme.colors.textMuted }} />
          </div>
        </div>
        
        {node.type === 'folder' && isOpen && node.children?.map(childId => renderNode(childId, depth + 1))}
      </div>
    );
  };

  return (
    <div 
      className="flex flex-col h-full border-r shadow-xl relative z-40 w-full"
      style={{ backgroundColor: currentTheme.colors.sidebarBg, borderColor: currentTheme.colors.border }}
    >
      <div className="h-9 flex items-center px-4 justify-between border-b shrink-0" style={{ borderColor: currentTheme.colors.border }}>
        <h2 className="text-[11px] font-bold uppercase tracking-widest truncate" style={{ color: currentTheme.colors.textMuted }}>Explorer</h2>
        <div className="flex items-center space-x-2 shrink-0" style={{ color: currentTheme.colors.textMuted }}>
          <Search size={14} className="hover:text-white cursor-pointer transition" />
          <Package size={14} className="hover:text-white cursor-pointer transition" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        <div className="px-2 mb-2">
           <div className="p-1.5 rounded flex items-center space-x-2 border" style={{ backgroundColor: currentTheme.colors.editorBg, borderColor: currentTheme.colors.border }}>
              <Folder size={12} className="shrink-0" style={{ color: currentTheme.colors.textMuted }} />
              <span className="text-[10px] font-bold uppercase truncate" style={{ color: currentTheme.colors.textMuted }}>{files[rootId]?.name || 'PROJECT'}</span>
           </div>
        </div>
        {renderNode(rootId)}
      </div>

      <div className="h-8 border-t flex items-center px-4 shrink-0" style={{ backgroundColor: currentTheme.colors.sidebarBg, borderColor: currentTheme.colors.border }}>
        <GitBranch size={12} className="mr-2 shrink-0" style={{ color: currentTheme.colors.textMuted }} />
        <span className="text-[10px] font-bold uppercase tracking-tighter truncate" style={{ color: currentTheme.colors.textMuted }}>Main Branch</span>
      </div>
    </div>
  );
};
