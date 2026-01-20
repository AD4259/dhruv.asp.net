
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Editor } from './components/Editor';
import { Terminal } from './components/Terminal';
import { WebPreview } from './components/WebPreview';
import { StatsDashboard } from './components/StatsDashboard';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Project, FileNode, BuildResult, Theme } from './types';
import { TEMPLATES, THEMES } from './constants';
import { GeminiCompilerService } from './services/geminiCompiler';
import { statsService } from './services/statsService';
import { Code, BarChart3, Settings, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'welcome' | 'ide' | 'stats'>('welcome');
  const [project, setProject] = useState<Project | null>(null);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [buildResult, setBuildResult] = useState<BuildResult | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES.vscode_dark);
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('ide_font_size');
    return saved ? parseInt(saved, 10) : 14;
  });
  
  // Resizing states
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [terminalHeight, setTerminalHeight] = useState(240);
  const [previewWidth, setPreviewWidth] = useState(500);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingTerminal, setIsResizingTerminal] = useState(false);
  const [isResizingPreview, setIsResizingPreview] = useState(false);

  const [lastActivity, setLastActivity] = useState(Date.now());
  
  const activityTimerRef = useRef<number | null>(null);
  const compiler = useRef(new GeminiCompilerService());

  useEffect(() => {
    localStorage.setItem('ide_font_size', fontSize.toString());
  }, [fontSize]);

  // Handle Resize Events
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizingSidebar) {
      const newWidth = Math.max(160, Math.min(600, e.clientX - 48));
      setSidebarWidth(newWidth);
    }
    if (isResizingTerminal) {
      const newHeight = Math.max(100, Math.min(window.innerHeight - 200, window.innerHeight - e.clientY - 24));
      setTerminalHeight(newHeight);
    }
    if (isResizingPreview) {
      const newWidth = Math.max(300, Math.min(800, window.innerWidth - e.clientX));
      setPreviewWidth(newWidth);
    }
  }, [isResizingSidebar, isResizingTerminal, isResizingPreview]);

  const handleMouseUp = useCallback(() => {
    setIsResizingSidebar(false);
    setIsResizingTerminal(false);
    setIsResizingPreview(false);
  }, []);

  useEffect(() => {
    if (isResizingSidebar || isResizingTerminal || isResizingPreview) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isResizingTerminal ? 'row-resize' : 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar, isResizingTerminal, isResizingPreview, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const colors = currentTheme.colors;
    const root = document.documentElement;
    root.style.setProperty('--activity-bg', colors.activityBarBg);
    root.style.setProperty('--sidebar-bg', colors.sidebarBg);
    root.style.setProperty('--editor-bg', colors.editorBg);
    root.style.setProperty('--terminal-bg', colors.terminalBg);
    root.style.setProperty('--topbar-bg', colors.topBarBg);
    root.style.setProperty('--status-bg', colors.statusBarBg);
    root.style.setProperty('--text-main', colors.textMain);
    root.style.setProperty('--text-muted', colors.textMuted);
    root.style.setProperty('--border-color', colors.border);
    root.style.setProperty('--accent-color', colors.accent);
  }, [currentTheme]);

  useEffect(() => {
    if (view === 'ide' && project) {
      activityTimerRef.current = window.setInterval(() => {
        const now = Date.now();
        if ((now - lastActivity) / 1000 < 120) { 
          statsService.logActivity('editing', 5, project.name);
        }
      }, 5000);
    }
    return () => {
      if (activityTimerRef.current !== null) window.clearInterval(activityTimerRef.current);
    };
  }, [view, project, lastActivity]);

  const handleCreateProject = (type: keyof typeof TEMPLATES) => {
    const template = TEMPLATES[type];
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: `My${type.charAt(0).toUpperCase() + type.slice(1)}App`,
      template: type as any,
      files: JSON.parse(JSON.stringify(template.files)),
      rootId: 'root'
    };
    setProject(newProject);
    setActiveFileId('prog');
    setView('ide');
    setBuildResult(null);
  };

  const handleFileSelect = (id: string) => {
    const file = project?.files[id];
    if (file && file.type === 'file') {
      setActiveFileId(id);
      setLastActivity(Date.now());
    }
  };

  const handleFileChange = (content: string) => {
    if (!project || !activeFileId) return;
    setProject(prev => {
      if (!prev) return null;
      return {
        ...prev,
        files: { ...prev.files, [activeFileId]: { ...prev.files[activeFileId], content } }
      };
    });
    setLastActivity(Date.now());
  };

  const handleBuildAndRun = async () => {
    if (!project) return;
    setIsBuilding(true);
    statsService.logActivity('building', 2, project.name);
    const result = await compiler.current.compileAndRun(project);
    setBuildResult(result);
    setIsBuilding(false);
    if (result.success) statsService.logActivity('running', 5, project.name);
  };

  if (view === 'welcome') return <WelcomeScreen onCreate={handleCreateProject} onOpenStats={() => setView('stats')} />;
  if (view === 'stats') return <StatsDashboard onBack={() => setView(project ? 'ide' : 'welcome')} />;

  const isWebProject = project?.template === 'webapi' || project?.template === 'mvc';

  return (
    <div className={`flex flex-col h-screen overflow-hidden`} style={{ backgroundColor: currentTheme.colors.editorBg, color: currentTheme.colors.textMain }}>
      <TopBar 
        projectName={project?.name || ''} 
        onRun={handleBuildAndRun} 
        isBuilding={isBuilding}
        onViewStats={() => setView('stats')}
        onExit={() => setView('welcome')}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Activity Bar */}
        <div 
          className="w-12 flex flex-col items-center py-4 space-y-4 border-r shrink-0 z-50"
          style={{ backgroundColor: currentTheme.colors.activityBarBg, borderColor: currentTheme.colors.border }}
        >
          <button className="p-2 transition" style={{ color: currentTheme.colors.accent }}><Code size={20} /></button>
          <button onClick={() => setView('stats')} className="p-2 transition" style={{ color: currentTheme.colors.textMuted }}><BarChart3 size={20} /></button>
          <div className="flex-1" />
          <button className="p-2 transition" style={{ color: currentTheme.colors.textMuted }}><Settings size={20} /></button>
        </div>

        {/* Sidebar */}
        <div style={{ width: `${sidebarWidth}px` }} className="flex shrink-0">
          <Sidebar 
            files={project?.files || {}} 
            rootId={project?.rootId || ''} 
            activeFileId={activeFileId} 
            onSelectFile={handleFileSelect}
            currentTheme={currentTheme}
          />
        </div>

        {/* Sidebar Resizer */}
        <div 
          onMouseDown={() => setIsResizingSidebar(true)}
          className={`w-1 cursor-col-resize z-50 hover:bg-blue-500/50 transition-colors ${isResizingSidebar ? 'bg-blue-500' : ''}`}
          style={{ backgroundColor: isResizingSidebar ? currentTheme.colors.accent : 'transparent' }}
        />

        {/* Main Workspace Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor & Terminal Column */}
          <div className="flex flex-col flex-1 overflow-hidden relative">
            <div className="flex-1 min-h-0">
              {activeFileId && project?.files[activeFileId] ? (
                <Editor 
                  file={project.files[activeFileId]} 
                  onChange={handleFileChange} 
                  currentTheme={currentTheme}
                  fontSize={fontSize}
                />
              ) : (
                <div className="h-full flex items-center justify-center" style={{ backgroundColor: currentTheme.colors.editorBg }}>
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border" style={{ backgroundColor: currentTheme.colors.sidebarBg, borderColor: currentTheme.colors.border }}>
                      <Code size={40} style={{ color: currentTheme.colors.textMuted }} />
                    </div>
                    <p className="text-lg font-medium" style={{ color: currentTheme.colors.textMuted }}>Open a file from the Explorer</p>
                  </div>
                </div>
              )}
            </div>

            {/* Terminal Resizer */}
            <div 
              onMouseDown={() => setIsResizingTerminal(true)}
              className={`h-1 cursor-row-resize z-50 hover:bg-blue-500/50 transition-colors ${isResizingTerminal ? 'bg-blue-500' : ''}`}
              style={{ backgroundColor: isResizingTerminal ? currentTheme.colors.accent : 'transparent' }}
            />

            {/* Bottom Panel (Terminal) */}
            {/* FIX: Merge duplicate style attributes to resolve JSX attribute error */}
            <div 
              className="shrink-0 border-t flex flex-col" 
              style={{ 
                backgroundColor: currentTheme.colors.terminalBg, 
                borderColor: currentTheme.colors.border, 
                height: `${terminalHeight}px` 
              }}
            >
              <Terminal 
                result={buildResult} 
                isBuilding={isBuilding} 
                projectType={project?.template}
                currentTheme={currentTheme}
              />
            </div>
          </div>

          {/* Preview Resizer */}
          {isWebProject && (
            <div 
              onMouseDown={() => setIsResizingPreview(true)}
              className={`w-1 cursor-col-resize z-50 hover:bg-blue-500/50 transition-colors ${isResizingPreview ? 'bg-blue-500' : ''}`}
              style={{ backgroundColor: isResizingPreview ? currentTheme.colors.accent : 'transparent' }}
            />
          )}

          {/* Side Web Preview */}
          {isWebProject && (
            <div style={{ width: `${previewWidth}px` }} className="shrink-0">
              <WebPreview 
                result={buildResult} 
                isBuilding={isBuilding} 
                onRefresh={handleBuildAndRun} 
                currentTheme={currentTheme}
                panelWidth={previewWidth} // Pass width to component
              />
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 text-white text-[10px] font-medium flex items-center px-3 space-x-4 shrink-0 shadow-inner z-50" style={{ backgroundColor: currentTheme.colors.statusBarBg }}>
        <div className="flex items-center space-x-1.5 px-1 rounded cursor-pointer h-full transition">
          <CheckCircle2 size={12} />
          <span className="uppercase tracking-wider">Ready</span>
        </div>
        <div className="px-1 rounded cursor-pointer h-full flex items-center transition uppercase tracking-widest">{project?.template}</div>
        <div className="flex-1" />
        <div className="px-1 rounded cursor-pointer h-full flex items-center transition font-bold">C#</div>
      </div>
    </div>
  );
};

export default App;
