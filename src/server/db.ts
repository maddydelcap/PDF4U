import fs from 'fs';
import path from 'path';
import { User, ProcessingLog, SaaSStats } from '../types';

const DB_FILE = path.join(process.cwd(), 'src_server_db.json');

interface DatabaseSchema {
  users: Record<string, User>;
  logs: ProcessingLog[];
  stats: SaaSStats;
}

// Initial state
const initialDb: DatabaseSchema = {
  users: {
    'admin-user-id': {
      id: 'admin-user-id',
      email: 'nassim.hrss@gmail.com',
      name: 'Nassim H.',
      role: 'admin',
      plan: 'enterprise',
      filesProcessedToday: 0,
      dailyLimit: 9999,
      subscriptionExpiresAt: null,
      createdAt: new Date().toISOString(),
    },
    'demo-user-id': {
      id: 'demo-user-id',
      email: 'demo@pdfcraft.com',
      name: 'Demo Account',
      role: 'user',
      plan: 'free',
      filesProcessedToday: 1,
      dailyLimit: 3,
      subscriptionExpiresAt: null,
      createdAt: new Date().toISOString(),
    },
  },
  logs: [
    {
      id: 'log-1',
      userId: 'demo-user-id',
      fileName: 'tax_return_2025.pdf',
      toolId: 'compress',
      toolName: 'Compress PDF',
      sizeBytes: 4200100,
      status: 'success',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      downloadUrl: '#',
      details: { compressionRatio: '45% saved' },
    },
    {
      id: 'log-2',
      userId: 'admin-user-id',
      fileName: 'ai_blueprint.pdf',
      toolId: 'ai-summarizer',
      toolName: 'AI Summarizer',
      sizeBytes: 1540200,
      status: 'success',
      timestamp: new Date().toISOString(),
      downloadUrl: '#',
      details: { keyPointsCount: 6 },
    },
  ],
  stats: {
    totalFilesProcessed: 148,
    totalUsers: 24,
    proUsersCount: 5,
    enterpriseUsersCount: 2,
    revenueThisMonth: 158,
  },
};

class FileDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = initialDb;
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (e) {
      console.error('Error loading DB, using defaults:', e);
      this.data = initialDb;
    }
  }

  private save() {
    try {
      // Ensure parent dir exists
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('Error saving DB:', e);
    }
  }

  getUsers(): User[] {
    return Object.values(this.data.users);
  }

  getUser(userId: string): User | undefined {
    return this.data.users[userId];
  }

  getUserByEmail(email: string): User | undefined {
    return Object.values(this.data.users).find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(email: string, name: string, role: 'user' | 'admin' = 'user'): User {
    const id = 'user-' + Math.random().toString(36).substring(2, 11);
    const isNassim = email.toLowerCase() === 'nassim.hrss@gmail.com';
    const newUser: User = {
      id,
      email: email.toLowerCase(),
      name,
      role: isNassim ? 'admin' : role,
      plan: isNassim ? 'enterprise' : 'free',
      filesProcessedToday: 0,
      dailyLimit: isNassim ? 9999 : 3,
      subscriptionExpiresAt: null,
      createdAt: new Date().toISOString(),
    };
    this.data.users[id] = newUser;
    this.data.stats.totalUsers += 1;
    this.save();
    return newUser;
  }

  updateUserPlan(userId: string, plan: 'free' | 'pro' | 'enterprise' | 'guest', expiresAt: string | null = null): User | undefined {
    const user = this.data.users[userId];
    if (!user) return undefined;

    const oldPlan = user.plan;
    user.plan = plan;
    user.dailyLimit = plan === 'free' ? 3 : plan === 'guest' ? 4 : plan === 'pro' ? 100 : 9999;
    user.subscriptionExpiresAt = expiresAt;

    // Adjust global stats
    if (oldPlan !== plan) {
      if (oldPlan === 'pro') this.data.stats.proUsersCount = Math.max(0, this.data.stats.proUsersCount - 1);
      if (oldPlan === 'enterprise') this.data.stats.enterpriseUsersCount = Math.max(0, this.data.stats.enterpriseUsersCount - 1);

      if (plan === 'pro') this.data.stats.proUsersCount += 1;
      if (plan === 'enterprise') this.data.stats.enterpriseUsersCount += 1;

      if (plan === 'pro') this.data.stats.revenueThisMonth += 12;
      if (plan === 'enterprise') this.data.stats.revenueThisMonth += 49;
    }

    this.save();
    return user;
  }

  createGuestUser(): User {
    const id = 'guest-' + Math.random().toString(36).substring(2, 11);
    const newUser: User = {
      id,
      email: `${id}@welovepdf.com`,
      name: 'Guest User',
      role: 'user',
      plan: 'guest',
      filesProcessedToday: 0,
      dailyLimit: 4, // 4 files operation as requested!
      subscriptionExpiresAt: null,
      createdAt: new Date().toISOString(),
    };
    this.data.users[id] = newUser;
    this.data.stats.totalUsers += 1;
    this.save();
    return newUser;
  }

  incrementProcessedCount(userId: string): boolean {
    const user = this.data.users[userId];
    if (!user) return false;

    user.filesProcessedToday += 1;
    this.data.stats.totalFilesProcessed += 1;
    this.save();
    return true;
  }

  resetDailyUsage(): void {
    for (const userId in this.data.users) {
      this.data.users[userId].filesProcessedToday = 0;
    }
    this.save();
  }

  addLog(userId: string, fileName: string, toolId: any, toolName: string, sizeBytes: number, status: 'success' | 'failed', details?: Record<string, any>): ProcessingLog {
    const log: ProcessingLog = {
      id: 'log-' + Math.random().toString(36).substring(2, 11),
      userId,
      fileName,
      toolId,
      toolName,
      sizeBytes,
      status,
      timestamp: new Date().toISOString(),
      downloadUrl: '#',
      details,
    };
    this.data.logs.unshift(log);
    this.incrementProcessedCount(userId);
    this.save();
    return log;
  }

  getLogsByUser(userId: string): ProcessingLog[] {
    return this.data.logs.filter((l) => l.userId === userId);
  }

  getRecentLogs(limit: number = 10): ProcessingLog[] {
    return this.data.logs.slice(0, limit);
  }

  getStats(): SaaSStats {
    return this.data.stats;
  }

  updateStats(stats: Partial<SaaSStats>): SaaSStats {
    this.data.stats = { ...this.data.stats, ...stats };
    this.save();
    return this.data.stats;
  }

  getAdminDashboardData() {
    return {
      stats: this.data.stats,
      users: Object.values(this.data.users),
      recentLogs: this.data.logs.slice(0, 30),
    };
  }
}

export const dbInstance = new FileDatabase();
