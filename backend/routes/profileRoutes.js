import express from 'express';
import {
  getAllProfiles,
  getProfileById,
  updateProfile,
  deleteProfile
} from '../controllers/profileController.js';

const router = express.Router();

router.get('/', getAllProfiles);               // Admin: All profiles
router.get('/:employeeId', getProfileById);    // All roles: Get by ID
router.put('/:employeeId', updateProfile);     // Admin/Manager: Update
router.delete('/:employeeId', deleteProfile);  // Admin/Manager: Delete

export default router;
