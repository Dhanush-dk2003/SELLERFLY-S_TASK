import express from 'express';
import { registerUser,loginUser,logoutUser, getAllSessions  } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/sessions', protect, getAllSessions);

export default router;
