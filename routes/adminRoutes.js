import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getAllUsers, deleteUser, updateUserRole } from '../controllers/userController.js';

const router = express.Router();

// Dashboard utama (tes akses admin/owner)
router.get(
  '/dashboard',
  protect,
  authorize('owner', 'admin'), // lebih aman jika 'owner' prioritas tertinggi
  (req, res) => {
    res.json({ message: 'Selamat datang di dashboard admin', user: req.user });
  }
);

// Manajemen user (hanya untuk owner)
router.get('/users', protect, authorize('owner'), getAllUsers);
router.delete('/users/:id', protect, authorize('owner'), deleteUser);
router.put('/users/:id/role', protect, authorize('owner'), updateUserRole);

export default router;
