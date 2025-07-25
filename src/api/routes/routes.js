// src/api/routes/index.ts
import { Router } from 'express';
import authRoutes from '../auth/auth.route';
import userRoutes from '../user/user.route';
// import more routes...

const router = Router();

// API Health Check
router.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

// Modular Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
// router.use('/payments', ...);

export default router;
