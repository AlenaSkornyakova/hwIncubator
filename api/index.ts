import express from 'express';
import { setupApp } from '../src/set-app';

const app = express();
setupApp(app);

export default app;