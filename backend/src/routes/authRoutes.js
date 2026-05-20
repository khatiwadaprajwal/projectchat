import express from 'express';
import { registerUser, loginUser, promoteToAdmin} from '../controllers/authController.js';
import { isLoggedIn, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/promote', isLoggedIn, isAdmin, promoteToAdmin);
export default router;