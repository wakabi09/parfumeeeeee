// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Setup __dirname untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config();

// Inisialisasi Express
const app = express();

// ===========================
// ✅ CORS Configuration
// ===========================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net',
];

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||                                       // allow tools seperti Postman
      allowedOrigins.includes(origin) ||               // allow origin resmi
      origin.startsWith('http://localhost') ||         // allow semua localhost (5173, 5000, dll)
      origin.includes('.scm.azurewebsites.net')        // allow Kudu (Azure)
    ) {
      callback(null, true);
    } else {
      callback(new Error('CORS tidak diizinkan dari origin ini: ' + origin));
    }
  },
  credentials: true,
}));


// ===========================
// ✅ Middleware
// ===========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===========================
// ✅ Serve Static Upload Folder
// ===========================
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// ===========================
// ✅ API Routes
// ===========================
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/auth', authRoutes);

// ===========================
// ✅ Serve React Client (Vite build in /client/dist)
// ===========================
const clientBuildPath = path.join(__dirname, 'client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// ===========================
// ✅ Global Error Handler
// ===========================
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan di server' });
});

// ===========================
// ✅ MongoDB Connection
// ===========================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // clean version
    console.log(`✅ MongoDB Connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// ===========================
// ✅ Jalankan Server
// ===========================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
});
