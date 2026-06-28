import React, { useEffect, useState } from 'react';
import { 
  Sparkles, ShieldCheck, FileText, Zap, Calendar, History, 
  Search, ArrowUpRight, ArrowDownToLine, RefreshCw, AlertCircle, CheckCircle
} from 'lucide-react';
import { User, ProcessingLog } from '../types';

interface DashboardProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export default function Dashboard({ user, onUpdateUser }: DashboardProps) {
  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [billingLoading, setBillingLoading] = useState<'pro' | 'enterprise' | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch processing log history
  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch(`/api/user/logs?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error('Error fetching logs:', e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user.id, user.filesProcessedToday]);

  const handleSubscribe = async (tier: 'pro' | 'enterprise') => {
    setBillingLoading(tier);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Simulate checkout gate latency
      await new Promise((r) => setTimeout(r, 1200));

      const res = await fetch('/api/user/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, plan: tier }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Subscription update failed.');

      setSuccessMsg(`Simulated checkout successful! You are now subscribed to ${tier.toUpperCase()}.`);
      onUpdateUser(data.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment simulation failed.');
    } finally {
      setBillingLoading(null);
    }
  };

  const filteredLogs = logs.filter((log) => 
    log.fileName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.toolName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadLog = (log: ProcessingLog) => {
    // Generate a downloadable text/document representation matching the log name
    const fileContent = `WE LOVE PDF Processed Document Output\n` +
                        `--------------------------------------\n` +
                        `File Name: ${log.fileName}\n` +
                        `Tool Used: ${log.toolName}\n` +
                        `Processed Date: ${new Date(log.timestamp).toLocaleString()}\n` +
                        `File Size: ${(log.sizeBytes / 1024).toFixed(2)} KB\n\n` +
                        `Status: Document processed successfully via WE LOVE PDF secure engines.`;
                        
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = log.fileName.endsWith('.pdf') || log.fileName.endsWith('.docx') || log.fileName.endsWith('.txt')
      ? log.fileName
      : `${log.fileName}.txt`;
      
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  // Math variables
  const quotaPercentage = Math.min(100, Math.round((user.filesProcessedToday / user.dailyLimit) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#F3F4F6] min-h-screen">
      {/* Alert overlays */}
      {successMsg && (
        <div className="flex items-center gap-2 p-4 mb-6 text-xs font-semibold text-green-800 bg-green-50 border border-green-200 rounded-lg shadow-xs">
          <CheckCircle className="w-4.5 h-4.5 text-green-600" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 mb-6 text-xs font-semibold text-red-800 bg-red-50 border border-red-200 rounded-lg shadow-xs">
          <AlertCircle className="w-4.5 h-4.5 text-red-600" />
          {errorMsg}
        </div>
      )}

      {/* Main SaaS Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols: Main stats, plans, upgrade */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Welcome Dashboard and Daily Consumption gauge */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-950 tracking-tight">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-xs text-slate-400 mt-1">Manage your document workflows, subscriptions, and logs</p>
              </div>

              {/* Badge */}
              <div className="inline-flex self-start sm:self-center items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-100 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                <span className="text-xs font-bold text-red-700 capitalize">
                  {user.plan} Account
                </span>
              </div>
            </div>

            {/* Daily gauge */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>Daily Processing Usage</span>
                <span>{user.filesProcessedToday} / {user.dailyLimit} files</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    quotaPercentage >= 100 
                      ? 'bg-red-500' 
                      : quotaPercentage >= 75 
                        ? 'bg-amber-500' 
                        : 'bg-red-600'
                  }`}
                  style={{ width: `${quotaPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
                <p>Quotas refresh daily at midnight.</p>
                {(user.plan === 'free' || user.plan === 'guest') && (
                  <p className="text-red-600 font-semibold animate-pulse">Upgrade to Pro for unlimited usage!</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Subscription Upgrader */}
          {user.plan !== 'enterprise' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-bold font-display text-slate-900 tracking-tight mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-purple-600" />
                Upgrade Your Professional Plan
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Unlock specialized capabilities like Gemini Summaries, OCR file readings, translations, and bigger file thresholds.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Pro upgrade package */}
                {(user.plan === 'free' || user.plan === 'guest') && (
                  <div className="p-5 rounded-lg border border-red-100 bg-red-50/20 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 font-display">Professional Suite</h3>
                      <p className="text-xl font-bold text-slate-900 tracking-tight mt-1 font-display">$12<span className="text-xs text-slate-400 font-normal">/mo</span></p>
                      <ul className="text-[11px] text-slate-600 space-y-2 mt-4">
                        <li className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                          100 documents daily
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                          Full AI tools (Summarize, Translate)
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                          Full OCR processing capabilities
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSubscribe('pro')}
                      disabled={billingLoading !== null}
                      className="w-full mt-6 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      id="dash-upgrade-pro-btn"
                    >
                      {billingLoading === 'pro' ? (
                        <div className="w-3.5 h-3.5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                      ) : (
                        <>
                          Upgrade to Pro
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Enterprise package */}
                <div className="p-5 rounded-lg border border-purple-100 bg-purple-50/20 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 font-display">Enterprise Scale</h3>
                    <p className="text-xl font-bold text-slate-900 tracking-tight mt-1 font-display">$49<span className="text-xs text-slate-400 font-normal">/mo</span></p>
                    <ul className="text-[11px] text-slate-600 space-y-2 mt-4">
                      <li className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        Unlimited (9,999) documents daily
                      </li>
                      <li className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        Full Admin platform dashboard
                      </li>
                      <li className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        API access & support
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSubscribe('enterprise')}
                    disabled={billingLoading !== null}
                    className="w-full mt-6 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    id="dash-upgrade-ent-btn"
                  >
                    {billingLoading === 'enterprise' ? (
                      <div className="w-3.5 h-3.5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    ) : (
                      <>
                        Upgrade to Enterprise
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 col: Billing details & Subscription meta */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-1.5 font-display">
              <Calendar className="w-4 h-4 text-slate-400" />
              SaaS Billing Info
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Plan Status:</span>
                <span className="font-bold text-slate-900 capitalize">{user.plan}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Billing Cycle:</span>
                <span className="font-bold text-slate-900">Monthly</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Renewal Date:</span>
                <span className="font-bold text-slate-900">
                  {user.subscriptionExpiresAt 
                    ? new Date(user.subscriptionExpiresAt).toLocaleDateString()
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">SLA Status:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processed History Log */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            <div>
              <h2 className="text-base font-bold font-display text-slate-900 tracking-tight">Document History</h2>
              <p className="text-xs text-slate-400 mt-0.5">Logs and downloadable assets from past processing runs</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-900 shadow-xs"
              />
            </div>

            {/* Refresh */}
            <button 
              onClick={fetchLogs}
              disabled={loadingLogs}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg border border-slate-200 bg-white shadow-xs"
              id="dash-refresh-history-btn"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* List of processed logs */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                <th className="py-2.5 px-4 font-display">Document Title</th>
                <th className="py-2.5 px-4 font-display">Tool Used</th>
                <th className="py-2.5 px-4 font-display">Processed Date</th>
                <th className="py-2.5 px-4 font-display">Size</th>
                <th className="py-2.5 px-4 text-right font-display">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-500" />
                    <span className="truncate max-w-xs">{log.fileName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-semibold text-slate-600 rounded">
                      {log.toolName}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[10px]">
                    {log.sizeBytes ? `${(log.sizeBytes / 1024).toFixed(1)} KB` : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => handleDownloadLog(log)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-bold hover:underline"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5 text-red-500" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    {loadingLogs ? 'Loading document history...' : 'No documents processed yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
