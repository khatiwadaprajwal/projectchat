import express from 'express';
import { getChatHistory, getAdminStats,getAllUsers } from '../controllers/chatController.js';
import { isLoggedIn, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.use(isLoggedIn);


router.get('/messages', getChatHistory);

router.get('/admin/users', isAdmin, getAllUsers);

router.get('/admin/stats', isAdmin, getAdminStats);

export default router;