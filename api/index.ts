import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import serverless from 'serverless-http';

type JsonRecord = Record<string, unknown>;

let legacyHandler: any = null;

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');
}

function readBody(req: VercelRequest): JsonRecord {
  if (req.body && typeof req.body === 'object') return req.body as JsonRecord;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as JsonRecord;
    } catch {
      return {};
    }
  }
  return {};
}

function numberValue(body: JsonRecord, key: string) {
  return Number(body[key]);
}

function publicCatalog() {
  const base = 'https://bmo-toools-three.vercel.app';
  return {
    name: 'BMO Tools API',
    version: '1',
    free: true,
    tools: [
      { slug: 'catalog', name: 'فهرس الأدوات', description: 'قائمة الأدوات ومساراتها العامة.', url: `${base}/api/v1/catalog`, free: true },
      { slug: 'percentage', name: 'حساب النسبة المئوية', description: 'حساب نسبة من قيمة.', url: `${base}/api/v1/calculate/percentage`, free: true },
      { slug: 'loan', name: 'حساب القسط الشهري', description: 'حساب القسط والفائدة والإجمالي.', url: `${base}/api/v1/calculate/loan`, free: true },
    ],
  };
}

async function handlePublicApi(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const pathname = new URL(req.url || '/', `https://${req.headers.host || 'bmo-toools-three.vercel.app'}`).pathname;
  if ((pathname === '/api/v1/catalog' || pathname === '/api/v1/tools') && req.method === 'GET') {
    return res.status(200).json(publicCatalog());
  }

  const body = readBody(req);
  if (pathname === '/api/v1/calculate/percentage' && req.method === 'POST') {
    const value = numberValue(body, 'value');
    const percent = numberValue(body, 'percent');
    if (!Number.isFinite(value) || !Number.isFinite(percent)) {
      return res.status(400).json({ error: 'أرسل value و percent كأرقام صحيحة.' });
    }
    return res.status(200).json({ value, percent, result: value * percent / 100 });
  }

  if (pathname === '/api/v1/calculate/loan' && req.method === 'POST') {
    const principal = numberValue(body, 'principal');
    const annualRate = numberValue(body, 'annualRate');
    const months = numberValue(body, 'months');
    if (!Number.isFinite(principal) || !Number.isFinite(annualRate) || !Number.isFinite(months) || principal <= 0 || months <= 0) {
      return res.status(400).json({ error: 'أرسل principal و annualRate و months بقيم موجبة.' });
    }
    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment = monthlyRate === 0
      ? principal / months
      : principal * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1);
    return res.status(200).json({
      principal,
      annualRate,
      months,
      monthlyPayment,
      totalPayment: monthlyPayment * months,
      totalInterest: monthlyPayment * months - principal,
    });
  }

  return null;
}

async function getLegacyHandler() {
  if (!legacyHandler) {
    const { registerRoutes } = await import('../server/routes.js');
    const app = express();
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    await registerRoutes(app, false);
    legacyHandler = serverless(app);
  }
  return legacyHandler;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const handled = await handlePublicApi(req, res);
  if (handled) return handled;
  const legacy = await getLegacyHandler();
  return legacy(req, res);
}
