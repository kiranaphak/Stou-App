import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Security Headers Middleware
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Body parser with strict limit
app.use(express.json({ limit: '64kb' }));

// In-Memory Simple Rate Limiter for Lead Submissions (protect against spam/flooding)
interface RateLimitRecord {
  count: number;
  firstRequestTime: number;
}
const leadSubmissionRateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 15;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = leadSubmissionRateLimitMap.get(ip);

  if (!record) {
    leadSubmissionRateLimitMap.set(ip, { count: 1, firstRequestTime: now });
    return false;
  }

  if (now - record.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
    leadSubmissionRateLimitMap.set(ip, { count: 1, firstRequestTime: now });
    return false;
  }

  record.count += 1;
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

// Clean up stale rate limit entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of leadSubmissionRateLimitMap.entries()) {
    if (now - record.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
      leadSubmissionRateLimitMap.delete(ip);
    }
  }
}, 15 * 60 * 1000);

/**
 * Sanitize string to prevent injection, remove raw HTML tags, control chars,
 * and prevent Spreadsheet/CSV formula injection (e.g. =, +, -, @ triggers).
 */
function sanitizeInput(val: unknown, maxLength = 200): string {
  if (typeof val !== 'string') {
    return '';
  }
  let clean = val
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Strip control characters
    .trim()
    .slice(0, maxLength);

  // Prevent Spreadsheet Formula Injection: neutralize leading =, +, -, @, \t, \r
  if (/^[=+\-@\t\r]/.test(clean)) {
    clean = `'${clean}`;
  }

  return clean;
}

/**
 * Generate a unique non-repeating Lead ID
 * Format: STOU-YYYY-XXXXX (e.g. STOU-2026-K9LX4-8B2A)
 */
function generateLeadId(): string {
  const year = new Date().getFullYear();
  const timePart = Date.now().toString(36).toUpperCase().slice(-5);
  const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `STOU-${year}-${timePart}-${randPart}`;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * POST /api/leads
 * Server-side endpoint to receive lead data, validate, sanitize, and securely proxy to Google Apps Script
 */
app.post('/api/leads', async (req, res) => {
  try {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    // Rate Limiting Check
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        success: false,
        error: 'มีการส่งข้อมูลบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง หรือติดต่อเจ้าหน้าที่ประจำบูธ มสธ.',
      });
    }

    const rawBody = req.body || {};

    const fullName = sanitizeInput(rawBody.full_name, 120);
    const rawContactType = sanitizeInput(rawBody.contact_type, 20).toLowerCase();
    const contactValue = sanitizeInput(rawBody.contact_value, 150);
    const consentInfo = rawBody.consent_info === true;
    const consentNews = rawBody.consent_news === true;

    // Strict Validation: Required fields
    if (!fullName || fullName.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'กรุณากรอกชื่อ-นามสกุลให้ถูกต้อง (อย่างน้อย 2 ตัวอักษร)',
      });
    }

    const validContactTypes = ['phone', 'line', 'email'];
    const contactType = validContactTypes.includes(rawContactType) ? rawContactType : 'phone';

    if (!contactValue) {
      return res.status(400).json({
        success: false,
        error: 'กรุณากรอกข้อมูลช่องทางการติดต่อ (เบอร์โทรศัพท์, LINE ID หรืออีเมล)',
      });
    }

    // Format validation based on contact type
    if (contactType === 'phone') {
      const cleanDigits = contactValue.replace(/\D/g, '');
      if (cleanDigits.length < 9 || cleanDigits.length > 10) {
        return res.status(400).json({
          success: false,
          error: 'กรุณากรอกหมายเลขโทรศัพท์ 9-10 หลักให้ถูกต้อง',
        });
      }
    } else if (contactType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactValue.replace(/^'/, ''))) {
        return res.status(400).json({
          success: false,
          error: 'กรุณากรอกรูปแบบอีเมลให้ถูกต้อง',
        });
      }
    }

    // PDPA Mandatory Consent Check
    if (!consentInfo) {
      return res.status(400).json({
        success: false,
        error: 'กรุณาให้ความยินยอมให้เจ้าหน้าที่ มสธ. ติดต่อกลับเพื่อให้คำปรึกษาตามหลัก PDPA',
      });
    }

    // Metadata creation
    const leadId = generateLeadId();
    const createdAt = new Date().toISOString();
    const eventName = sanitizeInput(rawBody.event_name, 100) || 'STOU Open House / EdFair 2026';
    const sourceQr = sanitizeInput(rawBody.source_qr, 100) || 'web-app';
    const quizRecommendations = sanitizeInput(rawBody.quiz_recommendations, 500) || '-';
    const interestTopics = sanitizeInput(rawBody.interest_topics, 500) || '-';
    const contactRequest = sanitizeInput(rawBody.contact_request, 1000) || '-';
    const privacyVersion = sanitizeInput(rawBody.privacy_version, 30) || 'v1.0-2026';

    const leadRecord = {
      lead_id: leadId,
      created_at: createdAt,
      event_name: eventName,
      source_qr: sourceQr,
      quiz_recommendations: quizRecommendations,
      full_name: fullName,
      contact_type: contactType,
      contact_value: contactValue,
      interest_topics: interestTopics,
      contact_request: contactRequest,
      consent_info: consentInfo,
      consent_news: consentNews,
      privacy_version: privacyVersion,
    };

    const appsScriptUrl = process.env.LEAD_API_URL;

    if (appsScriptUrl && appsScriptUrl.trim().startsWith('http')) {
      // Forward to Google Apps Script Web App
      try {
        const response = await fetch(appsScriptUrl.trim(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadRecord),
          redirect: 'follow',
        });

        if (!response.ok) {
          // Log only non-PII operational event
          console.error(`[Lead API] Apps Script responded with HTTP status ${response.status} for lead_id: ${leadId}`);
          return res.status(502).json({
            success: false,
            error: 'ไม่สามารถบันทึกข้อมูลไปยังระบบได้ กรุณาติดต่อเจ้าหน้าที่ประจำบูธ มสธ. หรือโทร Call Center',
          });
        }

        const textResponse = await response.text();
        let parsedResult: any = null;
        try {
          parsedResult = JSON.parse(textResponse);
        } catch {
          // Non-JSON response but HTTP 200 is acceptable
        }

        if (parsedResult && parsedResult.status === 'error') {
          console.error(`[Lead API] Apps Script returned application error for lead_id: ${leadId}`);
          return res.status(502).json({
            success: false,
            error: 'ระบบจัดเก็บข้อมูลขัดข้องชั่วคราว กรุณาติดต่อเจ้าหน้าที่ประจำบูธ มสธ.',
          });
        }

        // Anonymized operational log without PII
        console.log(`[Lead API] Successfully persisted lead_id: ${leadId} via Google Apps Script`);
        return res.status(200).json({
          success: true,
          lead_id: leadId,
          message: 'บันทึกข้อมูลเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด',
        });
      } catch (fetchError: any) {
        // Operational log without PII
        console.error(`[Lead API] Connection failure to Apps Script for lead_id: ${leadId}`, fetchError?.message);
        return res.status(502).json({
          success: false,
          error: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาติดต่อเจ้าหน้าที่ประจำบูธ มสธ.',
        });
      }
    } else {
      // In development/preview environment when LEAD_API_URL is not yet supplied in .env
      console.log(`[Lead API] LEAD_API_URL not configured. Running in preview/demo mode. Created lead_id: ${leadId}`);
      return res.status(200).json({
        success: true,
        lead_id: leadId,
        message: 'บันทึกข้อมูลเรียบร้อยแล้ว (โหมดพรีวิว - กรุณากำหนดค่า LEAD_API_URL เพื่อส่งข้อมูลลง Google Sheets)',
        preview_mode: true,
      });
    }
  } catch (error: any) {
    console.error('[Lead API] Unexpected error processing lead request', error?.message);
    return res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในระบบ กรุณาติดต่อเจ้าหน้าที่ประจำบูธ มสธ.',
    });
  }
});

// Vite middleware & Static serving
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
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`STOU Application server running on http://localhost:${PORT}`);
  });
}

startServer();
