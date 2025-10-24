import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import serverless from 'serverless-http';
import { registerRoutes } from '../server/routes';

let handler: any = null;

async function getHandler() {
  if (!handler) {
    const app = express();
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    await registerRoutes(app, false);
    handler = serverless(app);
  }
  return handler;
}

export default async function (req: VercelRequest, res: VercelResponse) {
  const handler = await getHandler();
  return handler(req, res);
}