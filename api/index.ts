import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { setupApp } from '../src/set-app';

 const app = express();
  setupApp(app);

export default function handler(req: VercelRequest, res: VercelResponse) {
 
  // Прокидываем запрос в Express-приложение
  app(req as any, res as any);
}
