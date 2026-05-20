import express from 'express';
import authRoutes from './authRoutes.js';
import chatRoutes from './chatRoutes.js'
const router = express.Router();

router.use('/chat', chatRoutes)
router.use('/auth', authRoutes);



export default router;