import { Router } from 'express';
import { register, login, getDetails } from '../controllers/auth';
import { protect } from '../controllers/utils';

const router = Router();

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/user', protect, getDetails);

export default router;
