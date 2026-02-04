import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../src/set-app';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Прокидываем запрос в Express-приложение
  app(req as any, res as any);
}
