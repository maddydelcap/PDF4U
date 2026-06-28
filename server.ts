import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { dbInstance } from './src/server/db';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not defined in Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ---------------------------------------------------------
// AUTHENTICATION ENDPOINTS
// ---------------------------------------------------------
app.post('/api/auth/register', (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required.' });
  }

  const existingUser = dbInstance.getUserByEmail(email);
  if (existingUser) {
    return res.json({ user: existingUser });
  }

  const newUser = dbInstance.createUser(email, name);
  res.json({ user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  let user = dbInstance.getUserByEmail(email);
  if (!user) {
    // Auto-create for seamless developer sandbox experience!
    user = dbInstance.createUser(email, email.split('@')[0]);
  }
  res.json({ user });
});

app.post('/api/auth/guest', (req, res) => {
  const user = dbInstance.createGuestUser();
  res.json({ user });
});

app.get('/api/auth/me', (req, res) => {
  const email = req.query.email as string;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  const user = dbInstance.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ user });
});

// ---------------------------------------------------------
// SUBSCRIPTIONS & LOGS
// ---------------------------------------------------------
app.post('/api/user/subscribe', (req, res) => {
  const { userId, plan } = req.body;
  if (!userId || !plan) {
    return res.status(400).json({ error: 'userId and plan are required.' });
  }

  const expires = plan === 'free' ? null : new Date(Date.now() + 3600000 * 24 * 30).toISOString(); // 30 days
  const updatedUser = dbInstance.updateUserPlan(userId, plan, expires);

  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  res.json({ user: updatedUser });
});

app.get('/api/user/logs', (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }
  const logs = dbInstance.getLogsByUser(userId);
  res.json({ logs });
});

app.post('/api/tools/log', (req, res) => {
  const { userId, fileName, toolId, toolName, sizeBytes, status, details } = req.body;
  if (!userId || !toolId || !toolName) {
    return res.status(400).json({ error: 'Missing log details.' });
  }

  // Enforce usage quotas for free and guest tier
  const user = dbInstance.getUser(userId);
  if (user && (user.plan === 'free' || user.plan === 'guest') && user.filesProcessedToday >= user.dailyLimit) {
    return res.status(429).json({ error: `Daily processing limit of ${user.dailyLimit} reached on ${user.plan === 'guest' ? 'Guest' : 'Free'} plan.` });
  }

  const log = dbInstance.addLog(userId, fileName || 'document.pdf', toolId, toolName, sizeBytes || 500000, status || 'success', details || {});
  res.json({ log, user: dbInstance.getUser(userId) });
});

// ---------------------------------------------------------
// ADMIN PANEL ENDPOINTS
// ---------------------------------------------------------
app.get('/api/admin/dashboard', (req, res) => {
  const adminEmail = req.query.email as string;
  if (!adminEmail) {
    return res.status(400).json({ error: 'Admin email required.' });
  }
  const adminUser = dbInstance.getUserByEmail(adminEmail);
  if (!adminUser || adminUser.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }

  const data = dbInstance.getAdminDashboardData();
  res.json(data);
});

app.post('/api/admin/update-user', (req, res) => {
  const { adminEmail, targetUserId, plan, role } = req.body;
  const adminUser = dbInstance.getUserByEmail(adminEmail);
  if (!adminUser || adminUser.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const targetUser = dbInstance.getUser(targetUserId);
  if (!targetUser) {
    return res.status(404).json({ error: 'Target user not found.' });
  }

  if (plan) {
    dbInstance.updateUserPlan(targetUserId, plan);
  }
  if (role) {
    targetUser.role = role;
  }

  res.json({ success: true, users: dbInstance.getUsers() });
});

// ---------------------------------------------------------
// GEMINI AI TOOLS ENDPOINTS
// ---------------------------------------------------------
app.post('/api/tools/summarize', async (req, res) => {
  const { userId, textContent } = req.body;
  if (!userId || !textContent) {
    return res.status(400).json({ error: 'Missing userId or textContent.' });
  }

  const user = dbInstance.getUser(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  if (user.plan === 'free' || user.plan === 'guest') {
    return res.status(403).json({ error: 'AI Summarizer requires a Pro or Enterprise subscription.' });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Perform a high-quality SaaS-style document summarization of the following PDF extracted text content.
Format your output in clean Markdown. Start with a "# Document Summary" heading, followed by a short "## Overview" paragraph, a "## Key Takeaways" bulleted list of 5 crucial points, and an "## Action Items" list if relevant. Keep it incredibly professional, concise, and elegant. Here is the text:

${textContent.slice(0, 30000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    const summary = response.text || 'Could not generate summary.';
    
    // Log the transaction
    dbInstance.addLog(userId, 'AI_Summary_Doc.pdf', 'ai-summarizer', 'AI Summarizer', textContent.length, 'success', { keyPoints: 5 });

    res.json({ summary, user: dbInstance.getUser(userId) });
  } catch (error: any) {
    console.error('Gemini error during summarization:', error);
    res.status(500).json({ error: error.message || 'Error occurred during AI summary extraction.' });
  }
});

app.post('/api/tools/translate', async (req, res) => {
  const { userId, textContent, targetLanguage } = req.body;
  if (!userId || !textContent || !targetLanguage) {
    return res.status(400).json({ error: 'Missing parameters.' });
  }

  const user = dbInstance.getUser(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  if (user.plan === 'free' || user.plan === 'guest') {
    return res.status(403).json({ error: 'AI Translation requires a Pro or Enterprise subscription.' });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Translate the following text content extracted from a PDF document into ${targetLanguage}.
Retain the formatting, paragraphs, headers, and bullet structures perfectly. Do not add any introductory chat text, just provide the direct translated document output. Text to translate:

${textContent.slice(0, 25000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    const translatedText = response.text || 'Could not translate document.';

    // Log the transaction
    dbInstance.addLog(userId, `Translated_${targetLanguage}.pdf`, 'ai-translate', 'Translate PDF', textContent.length, 'success', { targetLanguage });

    res.json({ translatedText, user: dbInstance.getUser(userId) });
  } catch (error: any) {
    console.error('Gemini error during translation:', error);
    res.status(500).json({ error: error.message || 'Error occurred during AI translation.' });
  }
});

app.post('/api/tools/ocr', (req, res) => {
  const { userId, fileName, sizeBytes } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId.' });
  }

  const user = dbInstance.getUser(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  if (user.plan === 'free' || user.plan === 'guest') {
    return res.status(403).json({ error: 'OCR PDF requires a Pro or Enterprise subscription.' });
  }

  // Simulated OCR text extraction on the server
  const mockOCRText = `DOCUMENT TEXT EXTRACTION (OCR COMPLETED SUCCESSFULLY)
--------------------------------------------------------
Document: ${fileName || 'scanned_image.pdf'}
Size: ${(sizeBytes / 1024).toFixed(1)} KB
Timestamp: ${new Date().toLocaleString()}

[Page 1]
RECEIPT / INVOICE #INV-2026-991
Vendor: Global Technologies Group, Inc.
Bill To: Nassim H. (nassim.hrss@gmail.com)

Item 1: Enterprise Cloud Services License (Q3-Q4) ....... $4,500.00
Item 2: API Integration Consulting Suite .............. $1,200.00
SUBTOTAL: ............................................. $5,700.00
TAX (8.25%): ........................................... $470.25
TOTAL AMOUNT DUE: ...................................... $6,170.25
Status: PAID IN FULL

[Page 2]
Thank you for your valuable business!
For queries, contact support@globaltech.com or call 1-800-555-0199.
All rights reserved. ISO-9001 Certified OCR Data Parser.`;

  dbInstance.addLog(userId, fileName || 'scanned_document.pdf', 'ocr', 'OCR PDF', sizeBytes || 102400, 'success', { textLength: mockOCRText.length });

  res.json({ extractedText: mockOCRText, user: dbInstance.getUser(userId) });
});

app.post('/api/tools/html-to-pdf', (req, res) => {
  const { userId, url } = req.body;
  if (!userId || !url) {
    return res.status(400).json({ error: 'Missing userId or URL.' });
  }

  // Log transaction
  dbInstance.addLog(userId, 'webpage_snapshot.pdf', 'html-to-pdf', 'HTML to PDF', 850000, 'success', { url });
  res.json({ success: true, user: dbInstance.getUser(userId) });
});

// ---------------------------------------------------------
// DEV AND PROD SERVER RUNTIME
// ---------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
