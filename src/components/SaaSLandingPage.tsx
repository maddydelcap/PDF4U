import React, { useState } from 'react';
import { 
  Sparkles, FileStack, Scissors, FolderTree, Crop, 
  Image, Table, Globe, Camera, 
  Edit3, ShieldAlert, RotateCw, Hash, PenTool, Lock, 
  Unlock, Activity, Columns, EyeOff, CheckSquare, Archive, 
  Search, ArrowRight, Check, Zap, Eye, Languages, Layers, ShieldCheck, FileText
} from 'lucide-react';
import { PDFTool, ToolId } from '../types';
import { TOOLS } from '../toolsData';

interface SaaSLandingPageProps {
  onSelectTool: (toolId: ToolId) => void;
  onOpenAuth: () => void;
  userEmail: string | null;
}

export default function SaaSLandingPage({ onSelectTool, onOpenAuth, userEmail }: SaaSLandingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'ai' | 'organize' | 'convert' | 'edit' | 'security'>('all');

  // Filter tools
  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getIconData = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': 
        return {
          element: <Sparkles className="w-5 h-5 text-purple-600" />,
          bgClass: 'bg-purple-50',
          borderClass: 'border-purple-100',
          hoverBgClass: 'group-hover:bg-purple-100'
        };
      case 'Languages': 
        return {
          element: <Languages className="w-5 h-5 text-indigo-600" />,
          bgClass: 'bg-indigo-50',
          borderClass: 'border-indigo-100',
          hoverBgClass: 'group-hover:bg-indigo-100'
        };
      case 'Eye': 
        return {
          element: <Eye className="w-5 h-5 text-blue-600" />,
          bgClass: 'bg-blue-50',
          borderClass: 'border-blue-100',
          hoverBgClass: 'group-hover:bg-blue-100'
        };
      case 'FileStack': 
        return {
          element: <FileStack className="w-5 h-5 text-rose-600" />,
          bgClass: 'bg-rose-50',
          borderClass: 'border-rose-100',
          hoverBgClass: 'group-hover:bg-rose-100'
        };
      case 'Scissors': 
        return {
          element: <Scissors className="w-5 h-5 text-amber-600" />,
          bgClass: 'bg-amber-50',
          borderClass: 'border-amber-100',
          hoverBgClass: 'group-hover:bg-amber-100'
        };
      case 'FolderTree': 
        return {
          element: <FolderTree className="w-5 h-5 text-teal-600" />,
          bgClass: 'bg-teal-50',
          borderClass: 'border-teal-100',
          hoverBgClass: 'group-hover:bg-teal-100'
        };
      case 'Crop': 
        return {
          element: <Crop className="w-5 h-5 text-orange-600" />,
          bgClass: 'bg-orange-50',
          borderClass: 'border-orange-100',
          hoverBgClass: 'group-hover:bg-orange-100'
        };
      case 'FileWord': 
        return {
          element: <FileText className="w-5 h-5 text-blue-600" />,
          bgClass: 'bg-blue-50',
          borderClass: 'border-blue-100',
          hoverBgClass: 'group-hover:bg-blue-100'
        };
      case 'FileSliders': 
        return {
          element: <Layers className="w-5 h-5 text-red-600" />,
          bgClass: 'bg-red-50',
          borderClass: 'border-red-100',
          hoverBgClass: 'group-hover:bg-red-100'
        };
      case 'FileSpreadsheet': 
        return {
          element: <Table className="w-5 h-5 text-emerald-600" />,
          bgClass: 'bg-emerald-50',
          borderClass: 'border-emerald-100',
          hoverBgClass: 'group-hover:bg-emerald-100'
        };
      case 'Image': 
        return {
          element: <Image className="w-5 h-5 text-pink-600" />,
          bgClass: 'bg-pink-50',
          borderClass: 'border-pink-100',
          hoverBgClass: 'group-hover:bg-pink-100'
        };
      case 'FileCheck': 
        return {
          element: <CheckSquare className="w-5 h-5 text-cyan-600" />,
          bgClass: 'bg-cyan-50',
          borderClass: 'border-cyan-100',
          hoverBgClass: 'group-hover:bg-cyan-100'
        };
      case 'FileCode': 
        return {
          element: <FileText className="w-5 h-5 text-violet-600" />,
          bgClass: 'bg-violet-50',
          borderClass: 'border-violet-100',
          hoverBgClass: 'group-hover:bg-violet-100'
        };
      case 'Table': 
        return {
          element: <Table className="w-5 h-5 text-green-600" />,
          bgClass: 'bg-green-50',
          borderClass: 'border-green-100',
          hoverBgClass: 'group-hover:bg-green-100'
        };
      case 'FileImage': 
        return {
          element: <Image className="w-5 h-5 text-fuchsia-600" />,
          bgClass: 'bg-fuchsia-50',
          borderClass: 'border-fuchsia-100',
          hoverBgClass: 'group-hover:bg-fuchsia-100'
        };
      case 'Globe': 
        return {
          element: <Globe className="w-5 h-5 text-indigo-600" />,
          bgClass: 'bg-indigo-50',
          borderClass: 'border-indigo-100',
          hoverBgClass: 'group-hover:bg-indigo-100'
        };
      case 'Camera': 
        return {
          element: <Camera className="w-5 h-5 text-rose-600" />,
          bgClass: 'bg-rose-50',
          borderClass: 'border-rose-100',
          hoverBgClass: 'group-hover:bg-rose-100'
        };
      case 'FileArchive': 
        return {
          element: <Archive className="w-5 h-5 text-blue-600" />,
          bgClass: 'bg-blue-50',
          borderClass: 'border-blue-100',
          hoverBgClass: 'group-hover:bg-blue-100'
        };
      case 'Edit3': 
        return {
          element: <Edit3 className="w-5 h-5 text-sky-600" />,
          bgClass: 'bg-sky-50',
          borderClass: 'border-sky-100',
          hoverBgClass: 'group-hover:bg-sky-100'
        };
      case 'ShieldAlert': 
        return {
          element: <ShieldAlert className="w-5 h-5 text-orange-600" />,
          bgClass: 'bg-orange-50',
          borderClass: 'border-orange-100',
          hoverBgClass: 'group-hover:bg-orange-100'
        };
      case 'RotateCw': 
        return {
          element: <RotateCw className="w-5 h-5 text-teal-600" />,
          bgClass: 'bg-teal-50',
          borderClass: 'border-teal-100',
          hoverBgClass: 'group-hover:bg-teal-100'
        };
      case 'Hash': 
        return {
          element: <Hash className="w-5 h-5 text-purple-600" />,
          bgClass: 'bg-purple-50',
          borderClass: 'border-purple-100',
          hoverBgClass: 'group-hover:bg-purple-100'
        };
      case 'PenTool': 
        return {
          element: <PenTool className="w-5 h-5 text-emerald-600" />,
          bgClass: 'bg-emerald-50',
          borderClass: 'border-emerald-100',
          hoverBgClass: 'group-hover:bg-emerald-100'
        };
      case 'Lock': 
        return {
          element: <Lock className="w-5 h-5 text-red-600" />,
          bgClass: 'bg-red-50',
          borderClass: 'border-red-100',
          hoverBgClass: 'group-hover:bg-red-100'
        };
      case 'Unlock': 
        return {
          element: <Unlock className="w-5 h-5 text-yellow-600" />,
          bgClass: 'bg-yellow-50',
          borderClass: 'border-yellow-100',
          hoverBgClass: 'group-hover:bg-yellow-100'
        };
      case 'Activity': 
        return {
          element: <Activity className="w-5 h-5 text-cyan-600" />,
          bgClass: 'bg-cyan-50',
          borderClass: 'border-cyan-100',
          hoverBgClass: 'group-hover:bg-cyan-100'
        };
      case 'Columns': 
        return {
          element: <Columns className="w-5 h-5 text-indigo-600" />,
          bgClass: 'bg-indigo-50',
          borderClass: 'border-indigo-100',
          hoverBgClass: 'group-hover:bg-indigo-100'
        };
      case 'EyeOff': 
        return {
          element: <EyeOff className="w-5 h-5 text-rose-600" />,
          bgClass: 'bg-rose-50',
          borderClass: 'border-rose-100',
          hoverBgClass: 'group-hover:bg-rose-100'
        };
      case 'CheckSquare': 
        return {
          element: <CheckSquare className="w-5 h-5 text-green-600" />,
          bgClass: 'bg-green-50',
          borderClass: 'border-green-100',
          hoverBgClass: 'group-hover:bg-green-100'
        };
      case 'Archive': 
        return {
          element: <Archive className="w-5 h-5 text-slate-600" />,
          bgClass: 'bg-slate-100',
          borderClass: 'border-slate-200',
          hoverBgClass: 'group-hover:bg-slate-200'
        };
      default: 
        return {
          element: <FileText className="w-5 h-5 text-slate-600" />,
          bgClass: 'bg-slate-50',
          borderClass: 'border-slate-100',
          hoverBgClass: 'group-hover:bg-slate-100'
        };
    }
  };

  return (
    <div className="bg-[#F3F4F6] min-h-screen pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 py-16 sm:py-20 shadow-xs">
        {/* Abstract background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/40 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50/40 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-6 text-[11px] font-semibold text-red-700 bg-red-50 rounded-full border border-red-100">
            <Zap className="w-3.5 h-3.5 fill-red-700 text-red-600" />
            Empowering PDF work with server-side AI & Gemini Core
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 tracking-tight leading-tight mb-5">
            The Complete Professional <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
              WE LOVE PDF
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-500 leading-relaxed mb-8">
            Merge, split, compress, convert, sign, and safeguard documents. Use advanced Gemini-powered AI models to summarize, translate, and extract scanned text instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto mb-12">
            {!userEmail ? (
              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 group animate-bounce"
                id="hero-get-started-btn"
              >
                Get Started for Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <a
                href="#tools"
                className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-all shadow-xs flex items-center justify-center gap-2"
              >
                Explore Tools
              </a>
            )}
            <a
              href="#pricing"
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-lg transition-all text-center"
            >
              View Pricing
            </a>
          </div>

          {/* SaaS Core Trust Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-200 text-left">
            <div>
              <div className="text-2xl font-bold text-slate-900 font-display">30+</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">High-Fidelity PDF Tools</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 font-display">100%</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">GDPR & Secure Storage</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 font-display">10x</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">Faster with Server AI</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 font-display">99.9%</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">Platform Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tool Grid Section */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight mb-1.5">Our Complete WE LOVE PDF Toolbox</h2>
          <p className="text-xs text-slate-500">Find any tool you need for complete doc processing</p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none border-b border-slate-100 md:border-b-0">
            {(['all', 'ai', 'organize', 'convert', 'edit', 'security'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
                }`}
                id={`cat-tab-${cat}`}
              >
                {cat === 'all' ? 'All Tools' : cat === 'ai' ? 'AI Tools' : cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tools (e.g. Merge, AI)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 shadow-xs"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTools.map((tool) => {
            const iconData = getIconData(tool.iconName);
            return (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className="group relative p-5 bg-white rounded-xl border border-slate-200/80 hover:border-red-500 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between shadow-xs"
                id={`tool-card-${tool.id}`}
              >
                {/* Badge for New or Pro */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  {tool.isNew && (
                    <span className="px-1.5 py-0.5 text-[8px] font-bold text-white bg-green-500 rounded uppercase tracking-wider">
                      New
                    </span>
                  )}
                  {tool.requiresPro && (
                    <span className="px-1.5 py-0.5 text-[8px] font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded uppercase tracking-wider flex items-center gap-0.5">
                      <Sparkles className="w-2 h-2 fill-white" />
                      Pro
                    </span>
                  )}
                </div>

                <div>
                  {/* Icon wrapper */}
                  <div className={`w-10 h-10 mb-4 ${iconData.bgClass} ${iconData.hoverBgClass} rounded-lg flex items-center justify-center transition-all border ${iconData.borderClass} shadow-xs`}>
                    {iconData.element}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight group-hover:text-red-600 transition-colors font-display">
                    {tool.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 leading-relaxed mt-2 line-clamp-3">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1 text-[10px] font-bold text-red-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                  Launch Tool
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-xs">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-600">No tools match your query.</p>
            <p className="text-[10px] text-slate-400 mt-1">Try searching for other phrases like "Split" or "AI".</p>
          </div>
        )}
      </section>

      {/* SaaS Feature Highlights */}
      <section className="bg-white border-y border-slate-200 py-12 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 tracking-tight mb-1.5 font-display">Zero-Leak Privacy</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Files are processed securely in temporary server directories and auto-deleted immediately after download. Your files remain completely yours.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 tracking-tight mb-1.5 font-display">Gemini 3.5 AI Core</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Leverage Google's latest Gemini model capabilities directly on your PDF texts to translate whole essays or generate accurate bulleted summaries.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center border border-purple-100">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 tracking-tight mb-1.5 font-display">Pristine Vectors</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Whether merging pages, adding page numbers, or placing custom watermarks, we preserve original PDF font coordinates and vector layers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight mb-1.5">SaaS Pricing Plans</h2>
          <p className="text-xs text-slate-500">Choose the capacity that fits your business requirements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plan 1: Free */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col justify-between relative overflow-hidden shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Standard Plan</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Perfect for casual files</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-slate-900 tracking-tight font-display">$0</span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>

              <ul className="mt-6 space-y-3 text-[11px] text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  3 processed documents / day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Max file size: 10MB
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Basic PDF conversion & tools
                </li>
                <li className="flex items-center gap-2 text-slate-300 line-through">
                  Gemini AI summaries & translation
                </li>
                <li className="flex items-center gap-2 text-slate-300 line-through">
                  Optical Character Recognition (OCR)
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenAuth}
              className="w-full mt-6 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-center border border-slate-200"
              id="plan-free-action-btn"
            >
              Start Free Trial
            </button>
          </div>

          {/* Plan 2: Pro (Best Value) */}
          <div className="bg-white rounded-xl border-2 border-blue-600 p-8 flex flex-col justify-between relative overflow-hidden shadow-md shadow-blue-50">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-widest rounded-bl-lg">
              Most Popular
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Professional Suite</h3>
              <p className="text-[11px] text-blue-600 mt-0.5 font-semibold">Unleash AI tools & size limits</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-slate-900 tracking-tight font-display">$12</span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>

              <ul className="mt-6 space-y-3 text-[11px] text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />
                  100 processed documents / day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />
                  Max file size: 100MB
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />
                  Full access to all 30+ PDF utilities
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />
                  Gemini AI translations & summary logs
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />
                  Server-side high fidelity OCR
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenAuth}
              className="w-full mt-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-center shadow-xs"
              id="plan-pro-action-btn"
            >
              Get Professional Now
            </button>
          </div>

          {/* Plan 3: Enterprise */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col justify-between relative overflow-hidden shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Enterprise Scale</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">For teams and heavy workloads</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-slate-900 tracking-tight font-display">$49</span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>

              <ul className="mt-6 space-y-3 text-[11px] text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  9,999 documents / day (Unlimited)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Max file size: 500MB
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Dedicated fast-lane queues
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Comprehensive admin panel access
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  API gateway access credentials
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenAuth}
              className="w-full mt-6 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-center border border-slate-200"
              id="plan-ent-action-btn"
            >
              Contact Enterprise Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
