// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';

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
// ✅ Helmet + CSP Configuration (Pasang lebih awal!)
// ===========================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "'unsafe-inline'",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://fonts.googleapis.com",
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
      ],
      connectSrc: [
        "'self'",
        "https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net",
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
      ],
      objectSrc: ["'none'"],
    },
  },
}));

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
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.startsWith('http://localhost') ||
      origin.includes('.scm.azurewebsites.net')
    ) {
      callback(null, true);
    } else {
      callback(new Error('CORS tidak diizinkan dari origin ini: ' + origin));
    }
  },
  credentials: true,
}));
app.options('*', cors());

// ===========================
// ✅ Middleware Parsing Body
// ===========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===========================
// ✅ Static Folder Upload
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
// ✅ Serve React Build
// ===========================
const clientBuildPath = path.join(__dirname, 'client/dist');
app.use(express.static(clientBuildPath));

app.get('/*', (req, res) => {
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
    await mongoose.connect(process.env.MONGO_URI);
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
