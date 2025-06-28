import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Middleware untuk memverifikasi token JWT dan set req.user
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Cari user berdasarkan ID di token
      req.user = await User.findById(decoded.id).select('id name email role');

      if (!req.user) {
        return res.status(401).json({ message: 'User tidak ditemukan' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa' });
    }
  } else {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }
};

// Middleware otorisasi: hanya izinkan role tertentu
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak: Tidak memiliki izin' });
    }
    next();
  };
};
