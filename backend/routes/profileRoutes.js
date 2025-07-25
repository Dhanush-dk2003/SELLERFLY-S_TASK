import express from 'express';
import {
  getAllProfiles,
  getProfileById,
  updateProfile,
  deleteProfile
} from '../controllers/profileController.js';

import upload from '../middleware/upload.js'; // ✅ ADD THIS LINE

const router = express.Router();

router.get('/', getAllProfiles);               // Admin: All profiles
router.get('/:employeeId', getProfileById);    // All roles: Get by ID
router.put('/:employeeId', upload.single("profilePic"), updateProfile); // ✅ only this one needed
router.delete('/:employeeId', deleteProfile);  // Admin/Manager: Delete

export default router;
