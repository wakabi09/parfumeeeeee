import express from 'express';
import {
  registerUser,
  loginUser,
} from '../controllers/userControllers.js';

import {
  getAllUsers,     // 🆕 Ambil semua user untuk admin
  deleteUser,      // 🆕 (Opsional) Hapus user
  updateUserRole   // 🆕 (Opsional) Ubah role user
} from '../controllers/userControllers.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin-only user management
router.get('/', protect, authorize('owner'), getAllUsers);        
router.delete('/:id', protect, authorize('owner'), deleteUser);   
router.put('/:id/role', protect, authorize('owner'), updateUserRole); 

export default router;
