
export type FileType = 'file' | 'folder';

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  content?: string;
  parentId: string | null;
  children?: string[]; // IDs of children
  isOpen?: boolean;
}

export interface Project {
  id: string;
  name: string;
  template: 'console' | 'webapi' | 'mvc';
  files: Record<string, FileNode>;
  rootId: string;
}

export interface BuildResult {
  success: boolean;
  output: string;
  errors: BuildError[];
  previewUrl?: string;
}

export interface BuildError {
  line: number;
  column: number;
  message: string;
  code: string;
  file: string;
}

export interface ActivityLog {
  timestamp: number;
  type: 'editing' | 'building' | 'running' | 'debugging' | 'idle';
  duration: number; // in seconds
  projectName: string;
}

export interface DailyStats {
  date: string;
  editing: number;
  building: number;
  running: number;
  debugging: number;
}

export interface ThemeColors {
  activityBarBg: string;
  sidebarBg: string;
  editorBg: string;
  terminalBg: string;
  topBarBg: string;
  statusBarBg: string;
  textMain: string;
  textMuted: string;
  border: string;
  accent: string;
  monacoTheme: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}
