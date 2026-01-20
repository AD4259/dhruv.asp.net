
import React from 'react';
import { statsService } from '../services/statsService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { ArrowLeft, Clock, Code, Play, Bug, RefreshCw } from 'lucide-react';

interface StatsDashboardProps {
  onBack: () => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ onBack }) => {
  const dailyData = statsService.getDailyStats();
  const distribution = statsService.getProjectDistribution();
  const totalSeconds = statsService.getTotalTime();

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const resetStats = () => {
    if (confirm("Clear all usage history? This cannot be undone.")) {
      statsService.reset();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Editor</span>
          </button>
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-blue-400">Developer Time Tracking</h1>
            <button 
              onClick={resetStats}
              className="p-2 text-gray-500 hover:text-red-400 transition"
              title="Reset All Stats"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Coding Time', value: formatTime(totalSeconds), icon: <Clock className="text-blue-400" /> },
            { label: 'Editing', value: formatTime(dailyData.reduce((a, b) => a + b.editing, 0)), icon: <Code className="text-green-400" /> },
            { label: 'Running', value: formatTime(dailyData.reduce((a, b) => a + b.running, 0)), icon: <Play className="text-yellow-400" /> },
            { label: 'Debugging', value: formatTime(dailyData.reduce((a, b) => a + b.debugging, 0)), icon: <Bug className="text-red-400" /> },
          ].map((card, i) => (
            <div key={i} className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{card.label}</span>
                {card.icon}
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Productivity */}
          <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-6">Daily Activity (Seconds)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="date" stroke="#8b949e" />
                  <YAxis stroke="#8b949e" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="editing" fill="#3b82f6" name="Editing" />
                  <Bar dataKey="building" fill="#10b981" name="Building" />
                  <Bar dataKey="running" fill="#f59e0b" name="Running" />
                  <Bar dataKey="debugging" fill="#ef4444" name="Debugging" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Distribution */}
          <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-6">Time per Project</h3>
            <div className="h-80 flex items-center justify-center">
              {distribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-gray-500 italic">No project data available yet</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-[#161b22] border border-[#30363d] p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
          <div className="h-40">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <XAxis dataKey="date" hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="editing" stroke="#3b82f6" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="running" stroke="#f59e0b" dot={false} strokeWidth={2} />
                </LineChart>
             </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">
            * Tracking is session-based and stored locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};
