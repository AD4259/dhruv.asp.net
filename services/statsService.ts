
import { ActivityLog, DailyStats } from "../types";

class StatsService {
  private logs: ActivityLog[] = [];

  constructor() {
    const saved = localStorage.getItem('ide_activity_logs');
    if (saved) {
      this.logs = JSON.parse(saved);
    }
  }

  logActivity(type: ActivityLog['type'], duration: number, projectName: string) {
    const log: ActivityLog = {
      timestamp: Date.now(),
      type,
      duration,
      projectName
    };
    this.logs.push(log);
    this.save();
  }

  private save() {
    localStorage.setItem('ide_activity_logs', JSON.stringify(this.logs));
  }

  getDailyStats(): DailyStats[] {
    const days: Record<string, DailyStats> = {};
    
    this.logs.forEach(log => {
      const date = new Date(log.timestamp).toISOString().split('T')[0];
      if (!days[date]) {
        days[date] = { date, editing: 0, building: 0, running: 0, debugging: 0 };
      }
      if (log.type !== 'idle') {
        days[date][log.type] += log.duration;
      }
    });

    return Object.values(days).sort((a, b) => a.date.localeCompare(b.date));
  }

  getProjectDistribution(): { name: string; value: number }[] {
    const projects: Record<string, number> = {};
    this.logs.forEach(log => {
      projects[log.projectName] = (projects[log.projectName] || 0) + log.duration;
    });
    return Object.entries(projects).map(([name, value]) => ({ name, value }));
  }

  reset() {
    this.logs = [];
    localStorage.removeItem('ide_activity_logs');
  }

  getTotalTime(): number {
    return this.logs.reduce((acc, log) => acc + (log.type !== 'idle' ? log.duration : 0), 0);
  }
}

export const statsService = new StatsService();
