
import React, { useState } from 'react';
import { Play, RotateCcw, BarChart3, LogOut, ChevronRight, Share2, Palette, Check, Type } from 'lucide-react';
import { Theme } from '../types';
import { THEMES } from '../constants';

interface TopBarProps {
  projectName: string;
  onRun: () => void;
  isBuilding: boolean;
  onViewStats: () => void;
  onExit: () => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  projectName, onRun, isBuilding, onViewStats, onExit, currentTheme, onThemeChange, fontSize, onFontSizeChange 
}) => {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);

  const fontSizes = [
    { label: 'Small', value: 12 },
    { label: 'Medium', value: 14 },
    { label: 'Large', value: 18 },
  ];

  return (
    <div 
      className="h-10 flex items-center px-2 justify-between border-b select-none z-50 shadow-md relative"
      style={{ backgroundColor: currentTheme.colors.topBarBg, borderColor: currentTheme.colors.border }}
    >
      {/* Branding & Menus */}
      <div className="flex items-center space-x-1 shrink-0">
        <div 
          className="w-6 h-6 rounded flex items-center justify-center mr-2 ml-1 shadow-lg"
          style={{ backgroundColor: currentTheme.colors.accent }}
        >
          <span className="text-[10px] font-black text-white italic">DW</span>
        </div>
        <div className="hidden lg:flex items-center" style={{ color: currentTheme.colors.textMuted }}>
          {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map(item => (
            <span 
              key={item} 
              className="text-[11px] px-2 py-1 rounded hover:text-white cursor-pointer transition"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.border;
                e.currentTarget.style.color = currentTheme.colors.textMain;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = currentTheme.colors.textMuted;
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Center Breadcrumbs / Project Info */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 flex items-center border px-4 py-0.5 rounded-md text-[11px] shadow-inner max-w-[30%] overflow-hidden"
        style={{ backgroundColor: currentTheme.colors.editorBg, borderColor: currentTheme.colors.border, color: currentTheme.colors.textMuted }}
      >
        <span className="truncate">{projectName}</span>
        <ChevronRight size={12} className="mx-1 shrink-0" />
        <span className="font-semibold shrink-0" style={{ color: currentTheme.colors.accent }}>Debug</span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-1">
        <div className="flex items-center mr-2 rounded p-0.5 border" style={{ backgroundColor: currentTheme.colors.sidebarBg, borderColor: currentTheme.colors.border }}>
          <button 
            onClick={onRun}
            disabled={isBuilding}
            className={`flex items-center space-x-2 px-3 h-6 rounded transition text-[11px] font-bold uppercase tracking-wider ${
              isBuilding ? 'bg-gray-600 cursor-not-allowed opacity-50' : ''
            } text-white shadow-sm`}
            style={!isBuilding ? { backgroundColor: '#16a34a' } : {}}
          >
            {isBuilding ? <RotateCcw size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
            <span>{isBuilding ? 'Compiling' : 'Run'}</span>
          </button>
        </div>

        <div className="h-4 w-px mx-1" style={{ backgroundColor: currentTheme.colors.border }} />

        {/* Font Size Selector */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowFontPicker(!showFontPicker);
              setShowThemePicker(false);
            }}
            className="p-1.5 rounded transition"
            style={{ color: currentTheme.colors.textMuted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.border;
              e.currentTarget.style.color = currentTheme.colors.textMain;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = currentTheme.colors.textMuted;
            }}
            title="Editor Font Size"
          >
            <Type size={16} />
          </button>

          {showFontPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowFontPicker(false)} />
              <div 
                className="absolute right-0 mt-2 w-32 rounded-md shadow-xl border z-50 py-1"
                style={{ backgroundColor: currentTheme.colors.sidebarBg, borderColor: currentTheme.colors.border }}
              >
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => {
                      onFontSizeChange(size.value);
                      setShowFontPicker(false);
                    }}
                    className="w-full text-left px-4 py-2 text-[11px] flex items-center justify-between transition"
                    style={{ 
                      color: fontSize === size.value ? currentTheme.colors.accent : currentTheme.colors.textMain,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.border}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>{size.label}</span>
                    {fontSize === size.value && <Check size={12} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Theme Selector */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowThemePicker(!showThemePicker);
              setShowFontPicker(false);
            }}
            className="p-1.5 rounded transition"
            style={{ color: currentTheme.colors.textMuted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.border;
              e.currentTarget.style.color = currentTheme.colors.textMain;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = currentTheme.colors.textMuted;
            }}
            title="Switch Theme"
          >
            <Palette size={16} />
          </button>

          {showThemePicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowThemePicker(false)} />
              <div 
                className="absolute right-0 mt-2 w-48 rounded-md shadow-xl border z-50 py-1"
                style={{ backgroundColor: currentTheme.colors.sidebarBg, borderColor: currentTheme.colors.border }}
              >
                {Object.values(THEMES).map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onThemeChange(theme);
                      setShowThemePicker(false);
                    }}
                    className="w-full text-left px-4 py-2 text-[11px] flex items-center justify-between hover:bg-opacity-50"
                    style={{ 
                      color: currentTheme.id === theme.id ? currentTheme.colors.accent : currentTheme.colors.textMain,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.border}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>{theme.name}</span>
                    {currentTheme.id === theme.id && <Check size={12} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button 
          onClick={onViewStats}
          className="p-1.5 rounded transition"
          style={{ color: currentTheme.colors.textMuted }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = currentTheme.colors.border;
            e.currentTarget.style.color = currentTheme.colors.textMain;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = currentTheme.colors.textMuted;
          }}
          title="Productivity Insights"
        >
          <BarChart3 size={16} />
        </button>

        <button 
          onClick={onExit}
          className="p-1.5 rounded transition hover:text-red-400"
          style={{ color: currentTheme.colors.textMuted }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = currentTheme.colors.border;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Close Workspace"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
};
