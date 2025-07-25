import { Router } from 'express';
import localFileRouter from '../local_files/localFile.routes.js';

const router = Router();

// API Health Check
router.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

// Modular Routes
router.use('/files', localFileRouter);


export default router;
