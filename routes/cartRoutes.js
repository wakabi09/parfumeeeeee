import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // 1. Import middleware otentikasi
import {
  getUserCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  mergeGuestCart,
  clearUserCart,
} from '../controllers/cartController.js'; // 2. Kita akan menggunakan fungsi controller baru

const router = express.Router();

// Semua route di bawah ini sekarang diproteksi, hanya bisa diakses oleh user yang login
router.use(protect);

// Route untuk mendapatkan keranjang milik user yang sedang login
// GET /api/cart/
router.get('/', getUserCart);

// Route untuk menggabungkan keranjang tamu setelah login
// POST /api/cart/merge
router.post('/merge', mergeGuestCart);

// Route untuk mengosongkan keranjang milik user yang sedang login
// DELETE /api/cart/clear
router.delete('/clear', clearUserCart);

// Route untuk menambah item baru ke keranjang
// POST /api/cart/item
router.post('/item', addItemToCart);

// Route untuk menghapus satu item dari keranjang
// DELETE /api/cart/item/:productId
router.delete('/item/:productId', removeItemFromCart);

// Route untuk mengubah jumlah satu item di keranjang
// PUT /api/cart/item/:productId
router.put('/item/:productId', updateItemQuantity);


export default router;