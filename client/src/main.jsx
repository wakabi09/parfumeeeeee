import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; 
import { BrowserRouter } from 'react-router-dom';

// --- PERUBAHAN DIMULAI DI SINI ---
import AuthProvider from './context/AuthProvider.jsx';      // 1. Tambah import ini
import CartProvider from './context/CartContext.jsx';      // 2. Ubah cara import ini (tanpa {})
// --- PERUBAHAN SELESAI DI SINI ---


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* --- PERUBAHAN DIMULAI DI SINI --- */}
      <AuthProvider> {/* 3. Tambah wrapper ini */}
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
      {/* --- PERUBAHAN SELESAI DI SINI --- */}
    </BrowserRouter>
  </React.StrictMode>
);