
import React from 'react';
import { TEMPLATES } from '../constants';
import { BarChart3, Plus, Github, FolderOpen, BookOpen, MessageSquare } from 'lucide-react';

interface WelcomeScreenProps {
  onCreate: (type: keyof typeof TEMPLATES) => void;
  onOpenStats: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onCreate, onOpenStats }) => {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] flex flex-col items-center justify-center p-8 select-none">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Section: Branding & Recent */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8 animate-in slide-in-from-left duration-700">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-3">
                <Plus size={40} className="text-white -rotate-3" />
              </div>
              <h1 className="text-5xl font-light tracking-tight text-white">DotNet<span className="font-bold text-blue-500">Web</span></h1>
            </div>
            <p className="text-xl text-gray-400 font-medium">Enterprise C# Development in your browser.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Start</h2>
            <div className="space-y-2">
              <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#2d2d2d] text-blue-400 transition group">
                <FolderOpen size={20} className="group-hover:scale-110 transition" />
                <span className="text-lg">Open a local project...</span>
              </button>
              <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#2d2d2d] text-blue-400 transition group">
                <Github size={20} className="group-hover:scale-110 transition" />
                <span className="text-lg">Clone a repository...</span>
              </button>
              <button 
                onClick={onOpenStats}
                className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#2d2d2d] text-blue-400 transition group"
              >
                <BarChart3 size={20} className="group-hover:scale-110 transition" />
                <span className="text-lg">View Productivity Dashboard</span>
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800">
             <div className="flex items-center space-x-6 text-gray-500">
                <a href="#" className="hover:text-white transition flex items-center space-x-1">
                  <BookOpen size={16} /> <span>Docs</span>
                </a>
                <a href="#" className="hover:text-white transition flex items-center space-x-1">
                  <MessageSquare size={16} /> <span>Community</span>
                </a>
             </div>
          </div>
        </div>

        {/* Right Section: Templates */}
        <div className="lg:col-span-7 space-y-6 animate-in fade-in duration-1000">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Create a new project</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(TEMPLATES) as Array<keyof typeof TEMPLATES>).map((key) => {
              const template = TEMPLATES[key];
              return (
                <div 
                  key={key}
                  onClick={() => onCreate(key)}
                  className="bg-[#252526] border border-[#3e3e3e] hover:border-blue-500/50 p-6 rounded-xl cursor-pointer transition-all hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-blue-500/10 group"
                >
                  <div className="mb-6 p-3 bg-[#1e1e1e] w-fit rounded-lg group-hover:bg-blue-600 transition-colors">
                    {React.cloneElement(template.icon as React.ReactElement, { className: 'w-8 h-8 group-hover:text-white transition-colors' })}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">{template.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {template.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
