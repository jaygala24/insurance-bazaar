import { Router } from 'express';
import {
  register,
  login,
  getDetails,
  updateDetails,
} from '../controllers/auth';
import { protect } from '../controllers/utils';
import {
  getPolicies,
  buyHealthPolicy,
  buyVehiclePolicy,
  buyLifePolicy,
  buyTravelPolicy,
  requestClaim,
  getClaimDetails,
} from '../controllers/policy';

const router = Router();

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/user', protect, getDetails);
router.post('/auth/user', protect, updateDetails);

// Policy Routes
router.get('/policies', getPolicies);
router.get('/policy/health', protect, buyHealthPolicy);
router.post('/policy/life', protect, buyLifePolicy);
router.post('/policy/vehicle', protect, buyVehiclePolicy);
router.post('/policy/travel', protect, buyTravelPolicy);
router.post('/policy/claim', protect, requestClaim);
router.get('/policy/claim', protect, getClaimDetails);

export default router;
