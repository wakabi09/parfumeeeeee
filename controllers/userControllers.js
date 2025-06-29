import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Pastikan ini ada di atas

// 🔐 Token Generator
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// 📧 Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// 📩 Email Template untuk Owner
const ownerEmailTemplate = (name, email) => `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
      <div style="background-color: #212529; padding: 20px; text-align: center;">
        <img src="${process.env.APP_LOGO_URL}" alt="MAHA PARFUME" style="height: 50px; margin-bottom: 10px;" />
        <h2 style="color: #ffffff; margin: 0;">MAHA PARFUME</h2>
      </div>
      <div style="padding: 30px;">
        <h3 style="color: #4CAF50;">Selamat Datang, ${name}!</h3>
        <p>Anda telah berhasil mendaftar sebagai <strong>Owner</strong>.</p>
        <p>Untuk mengakses dashboard admin, klik tombol di bawah ini:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://mahaparfum.site/admin/dashboard" style="background-color: #4CAF50; color: #fff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">Buka Dashboard Admin</a>
        </div>
        <p style="font-size: 13px; color: #777;">Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
      </div>
      <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        &copy; ${new Date().getFullYear()} MAHA PARFUME. All rights reserved.
      </div>
    </div>
  </div>
`;

// 📩 Email Notifikasi ke Admin
const adminNotificationTemplate = (name, email) => `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #fdfdfd; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 10px rgba(0,0,0,0.08);">
      <div style="background-color: #343a40; padding: 20px; text-align: center;">
        <img src="${process.env.APP_LOGO_URL}" alt="MAHA PARFUME" style="height: 50px;" />
        <h2 style="color: #fff; margin: 10px 0 0;">Notifikasi Owner Baru</h2>
      </div>
      <div style="padding: 30px;">
        <p>Telah terjadi pendaftaran <strong>Owner</strong> baru:</p>
        <ul>
          <li><strong>Nama:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
        </ul>
      </div>
    </div>
  </div>
`;

// ✅ Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = adminCode === process.env.ADMIN_CODE ? 'owner' : 'user';

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    // Kirim email jika owner
    if (role === 'owner') {
      await transporter.sendMail({
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: 'Akun Owner Anda Berhasil Didaftarkan',
        html: ownerEmailTemplate(name, email),
      });

      await transporter.sendMail({
        from: process.env.EMAIL_SENDER,
        to: process.env.ADMIN_NOTIFICATION_EMAIL,
        subject: `Owner Baru: ${name}`,
        html: adminNotificationTemplate(name, email),
      });
    }

    const token = generateToken(newUser._id, newUser.role);
    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    res.status(500).json({ message: 'Registrasi gagal', error: error.message });
  }
};

// ✅ Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Email tidak terdaftar' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Password salah' });

    const token = generateToken(user._id, user.role);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ message: 'Login gagal', error: err.message });
  }
};

// ✅ Ambil Semua User
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Hapus User
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus user', error: error.message });
  }
};

// ✅ Ubah Role User
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json({ message: 'Role berhasil diperbarui', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Gagal update role', error: error.message });
  }
};

