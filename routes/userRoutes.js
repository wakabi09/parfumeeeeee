import express from 'express';
import {
  registerUser,
  loginUser,
} from '../controllers/userController.js';

import {
  getAllUsers,     // 🆕 Ambil semua user untuk admin
  deleteUser,      // 🆕 (Opsional) Hapus user
  updateUserRole   // 🆕 (Opsional) Ubah role user
} from '../controllers/userController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin-only user management
router.get('/', protect, authorize('owner'), getAllUsers);        // GET /api/users
router.delete('/:id', protect, authorize('owner'), deleteUser);   // DELETE /api/users/:id
router.put('/:id/role', protect, authorize('owner'), updateUserRole); // PUT /api/users/:id/role

export default router;
