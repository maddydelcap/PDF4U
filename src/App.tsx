import React, { useState, useEffect } from 'react';
import { 
  Sparkles, FileText, LayoutDashboard, ShieldAlert, LogIn, LogOut, 
  Layers, CheckCircle, HelpCircle, Mail, HelpCircle as HelpIcon, ArrowRight,
  Heart
} from 'lucide-react';
import { User, ToolId } from './types';
import SaaSLandingPage from './components/SaaSLandingPage';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import ToolProcessor from './components/ToolProcessor';
import AuthModal from './components/AuthModal';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'admin' | 'tool'>('landing');
  const [activeToolId, setActiveToolId] = useState<ToolId | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    const cachedEmail = localStorage.getItem('pdf_saas_user_email');
    if (cachedEmail) {
      fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cachedEmail }),
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error();
        })
        .then((data) => {
          if (data.user) setUser(data.user);
        })
        .catch(() => {
          localStorage.removeItem('pdf_saas_user_email');
        });
    }
  }, []);

  const handleAuthSuccess = (authUser: User) => {
    setUser(authUser);
    localStorage.setItem('pdf_saas_user_email', authUser.email);
    setView('dashboard'); // Redirect to dashboard immediately on successful login/registration!
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('pdf_saas_user_email');
    setView('landing');
    setActiveToolId(null);
  };

  const handleSelectTool = (toolId: ToolId) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setActiveToolId(toolId);
    setView('tool');
  };

  const refreshUserSession = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/auth/me?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (e) {
      console.error('Error refreshing session:', e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F3F4F6] font-sans text-slate-800" id="main-saas-container">
      {/* Global Header Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand click navigates to Landing */}
          <div 
            onClick={() => { setView('landing'); setActiveToolId(null); }}
            className="flex items-center gap-2.5 cursor-pointer group"
            id="brand-logo-nav"
          >
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Heart className="w-4.5 h-4.5 text-white fill-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-950 font-display">WE LOVE PDF</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-semibold">
            <button
              onClick={() => { setView('landing'); setActiveToolId(null); }}
              className={`px-3 py-2 rounded-md transition-colors ${
                view === 'landing' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
              id="nav-home-btn"
            >
              All Tools
            </button>

            {user && (
              <button
                onClick={() => setView('dashboard')}
                className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                  view === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
                id="nav-dash-btn"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={() => setView('admin')}
                className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 text-red-600 hover:bg-red-50/50 ${
                  view === 'admin' ? 'bg-red-50 text-red-700' : ''
                }`}
                id="nav-admin-btn"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Console
              </button>
            )}

            {/* User credentials / Auth triggers */}
            {user ? (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
                {/* Plan Badge */}
                <span className="hidden md:inline px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold capitalize">
                  {user.plan} Tier
                </span>

                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md flex items-center gap-1 transition-colors"
                  id="nav-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md flex items-center gap-1 shadow-sm transition-all ml-2"
                id="nav-signin-btn"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {view === 'landing' && (
          <SaaSLandingPage 
            onSelectTool={handleSelectTool} 
            onOpenAuth={() => setIsAuthOpen(true)}
            userEmail={user ? user.email : null}
          />
        )}

        {view === 'dashboard' && user && (
          <Dashboard 
            user={user} 
            onUpdateUser={(updated) => setUser(updated)} 
          />
        )}

        {view === 'admin' && user?.role === 'admin' && (
          <AdminPanel adminEmail={user.email} />
        )}

        {view === 'tool' && activeToolId && (
          <ToolProcessor 
            toolId={activeToolId} 
            user={user} 
            onOpenAuth={() => setIsAuthOpen(true)}
            onRefreshUser={refreshUserSession}
          />
        )}
      </main>

      {/* SaaS footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-bold text-slate-900 font-display">WE LOVE PDF</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Professional-grade full-stack document utility SaaS. Realized via secure node-side frameworks and Gemini AI.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">Service Tools</h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li><span className="hover:text-blue-600 cursor-pointer">Merge PDF</span></li>
              <li><span className="hover:text-blue-600 cursor-pointer">Split & Rotate</span></li>
              <li><span className="hover:text-blue-600 cursor-pointer">Protect & Sign</span></li>
              <li><span className="hover:text-blue-600 cursor-pointer">Gemini Summaries</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">SaaS Security</h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                SSL / 256-bit AES Crypt
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Zero document retention
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                ISO-27001 Datacenters
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">SaaS Contact</h4>
            <p className="text-xs text-slate-500 mb-2">Have security or enterprise pipeline queries?</p>
            <div className="flex items-center gap-1 text-xs text-red-600 font-bold">
              <Mail className="w-4 h-4 text-red-500" />
              support@welovepdf.com
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <p>© 2026 WE LOVE PDF SaaS Technologies, Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">SaaS SLA Agreement</span>
          </div>
        </div>
      </footer>

      {/* Sign In Overlay Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
