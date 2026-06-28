export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'enterprise' | 'guest';
  filesProcessedToday: number;
  dailyLimit: number;
  subscriptionExpiresAt: string | null;
  createdAt: string;
}

export type ToolId =
  | 'merge'
  | 'split'
  | 'compress'
  | 'pdf-to-word'
  | 'word-to-pdf'
  | 'pdf-to-ppt'
  | 'ppt-to-pdf'
  | 'pdf-to-excel'
  | 'excel-to-pdf'
  | 'edit'
  | 'pdf-to-jpg'
  | 'jpg-to-pdf'
  | 'sign'
  | 'watermark'
  | 'rotate'
  | 'html-to-pdf'
  | 'unlock'
  | 'protect'
  | 'organize'
  | 'pdf-to-pdfa'
  | 'repair'
  | 'page-numbers'
  | 'scan-to-pdf'
  | 'ocr'
  | 'compare'
  | 'redact'
  | 'crop'
  | 'forms'
  | 'ai-summarizer'
  | 'ai-translate';

export interface PDFTool {
  id: ToolId;
  name: string;
  shortDescription: string;
  description: string;
  category: 'edit' | 'convert' | 'security' | 'organize' | 'ai';
  iconName: string;
  isNew?: boolean;
  requiresPro?: boolean;
}

export interface ProcessingLog {
  id: string;
  userId: string;
  fileName: string;
  toolId: ToolId;
  toolName: string;
  sizeBytes: number;
  status: 'success' | 'failed';
  timestamp: string;
  downloadUrl?: string;
  details?: Record<string, any>;
}

export interface SaaSStats {
  totalFilesProcessed: number;
  totalUsers: number;
  proUsersCount: number;
  enterpriseUsersCount: number;
  revenueThisMonth: number;
}
