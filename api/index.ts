import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../src/settings';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Прокидываем запрос в Express-приложение
  app(req as any, res as any);
}
