import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, Users, FileStack, CreditCard, Award, 
  Activity, ArrowDownToLine, Trash2, Edit2, Check, RefreshCw 
} from 'lucide-react';
import { User, ProcessingLog, SaaSStats } from '../types';

interface AdminPanelProps {
  adminEmail: string;
}

export default function AdminPanel({ adminEmail }: AdminPanelProps) {
  const [stats, setStats] = useState<SaaSStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [recentLogs, setRecentLogs] = useState<ProcessingLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState<'free' | 'pro' | 'enterprise' | 'guest'>('free');
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/dashboard?email=${encodeURIComponent(adminEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setUsers(data.users || []);
        setRecentLogs(data.recentLogs || []);
      }
    } catch (e) {
      console.error('Error loading admin dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [adminEmail]);

  const handleUpdateUser = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail,
          targetUserId: userId,
          plan: editPlan,
          role: editRole,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setEditingUserId(null);
        fetchAdminData(); // Refresh stats
      }
    } catch (e) {
      console.error('Error updating user:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#F3F4F6] min-h-screen">
      
      {/* Admin header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-950 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            SaaS Platform Admin Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global system overrides, user tiers, consumption metrics, and service-level logs.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-all shadow-xs"
          id="admin-refresh-btn"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Registry
        </button>
      </div>

      {/* Stats Cards Row */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Processed Files</span>
              <FileStack className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-display">{stats.totalFilesProcessed}</div>
            <div className="text-[9px] text-emerald-600 font-semibold mt-1">Platform wide total</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Total Users</span>
              <Users className="w-4.5 h-4.5 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-display">{stats.totalUsers}</div>
            <div className="text-[9px] text-slate-500 mt-1">Registered accounts</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Pro Accounts</span>
              <Award className="w-4.5 h-4.5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-display">{stats.proUsersCount}</div>
            <div className="text-[9px] text-purple-600 font-semibold mt-1">$12/mo recurring</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Enterprise Accounts</span>
              <Award className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-display">{stats.enterpriseUsersCount}</div>
            <div className="text-[9px] text-amber-600 font-semibold mt-1">$49/mo high capacity</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Monthly Revenue</span>
              <CreditCard className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 tracking-tight font-display">${stats.revenueThisMonth}</div>
            <div className="text-[9px] text-emerald-600 font-semibold mt-1">Simulated MRR log</div>
          </div>
        </div>
      )}

      {/* Main Admin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Registered Users override console */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5 font-display">
            <Users className="w-4 h-4 text-slate-400" />
            User Registry Overrides
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                  <th className="py-2.5 px-3 font-display">Name / Email</th>
                  <th className="py-2.5 px-3 font-display">Subscription</th>
                  <th className="py-2.5 px-3 font-display">Role</th>
                  <th className="py-2.5 px-3 font-display">Today Usage</th>
                  <th className="py-2.5 px-3 text-right font-display">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/25 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{user.email}</div>
                    </td>
                    <td className="py-3 px-3">
                       {editingUserId === user.id ? (
                        <select
                          value={editPlan}
                          onChange={(e) => setEditPlan(e.target.value as any)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                        >
                          <option value="free">Free</option>
                          <option value="guest">Guest</option>
                          <option value="pro">Pro</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded font-semibold text-[9px] uppercase tracking-wider ${
                          user.plan === 'enterprise' 
                            ? 'bg-amber-50 border border-amber-200 text-amber-700' 
                            : user.plan === 'pro' 
                              ? 'bg-purple-50 border border-purple-200 text-purple-700' 
                              : user.plan === 'guest'
                                ? 'bg-sky-50 border border-sky-200 text-sky-700'
                                : 'bg-slate-50 border border-slate-200 text-slate-600'
                        }`}>
                          {user.plan}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {editingUserId === user.id ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value as any)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className="font-semibold capitalize text-slate-700">{user.role}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-600">
                      {user.filesProcessedToday} / {user.dailyLimit}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {editingUserId === user.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleUpdateUser(user.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Save Changes"
                            id={`admin-save-user-${user.id}`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded text-[9px] font-bold"
                            title="Cancel"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingUserId(user.id);
                            setEditPlan(user.plan);
                            setEditRole(user.role);
                          }}
                          className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded border border-blue-100 hover:border-blue-200 text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                          id={`admin-edit-user-${user.id}`}
                        >
                          <Edit2 className="w-3 h-3" />
                          Modify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Live platform operations monitoring feed */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5 font-display">
            <Activity className="w-4 h-4 text-slate-400" />
            Live Processing logs
          </h2>

          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg text-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 truncate max-w-[150px]" title={log.fileName}>
                    {log.fileName}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                    log.status === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    {log.status}
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 mb-1.5">
                  Tool: <strong className="text-slate-700 font-semibold">{log.toolName}</strong>
                </div>

                <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                  <span>Size: {log.sizeBytes ? `${(log.sizeBytes / 1024).toFixed(1)} KB` : 'N/A'}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}

            {recentLogs.length === 0 && (
              <p className="text-center text-slate-400 py-8 text-xs">No logs registered yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
