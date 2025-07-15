// src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Cek token dan user dari localStorage saat pertama kali App dimuat
  useEffect(() => {
    const loadUserFromStorage = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token) {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.get(
            'https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/users/profile',
            config
          );

          setUser(data); // jika sukses, pakai dari server

        } catch (error) {
          console.error("❌ Gagal mengambil profil user dari token:", error);

          if (savedUser) {
            setUser(JSON.parse(savedUser)); // fallback ke localStorage
            console.warn("⚠️ Menggunakan user dari localStorage");
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      }

      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  // ✅ Fungsi login — dipanggil dari LoginPage.jsx
  const login = async (email, password) => {
    const { data } = await axios.post(
      'https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/auth/login',
      { email, password }
    );

    if (data.token) {
      const userToStore = {
        name: data.name,
        email: data.email,
        role: data.role,
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userToStore)); // penting!
      setUser(userToStore);

      return { ...data, user: userToStore };
    } else {
      throw new Error('Login gagal, token tidak ditemukan');
    }
  };

  // 🔓 Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, token: localStorage.getItem('token') }}>
      {!loading && children}
    </AuthContext.Provider>
  );
  
}
