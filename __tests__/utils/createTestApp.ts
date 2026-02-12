import express, { Express } from 'express';
import { setupApp } from '../../src/set-app';

export const createTestApp = (): Express => {
  const app = express();
  setupApp(app);
  return app;
};
