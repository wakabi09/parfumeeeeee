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

      if (token) {
        try {
          // Set header otorisasi untuk semua request axios setelah ini
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const { data } = await axios.get(
            'https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/users/profile'
          );

          setUser(data); // Jika sukses, pakai data dari server

        } catch (error) {
          console.error("❌ Gagal mengambil profil user dari token:", error);
          
          // Token tidak valid, hapus dari storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  // ✅ Fungsi login — dipanggil dari LoginPage.jsx
  const login = async (email, password) => {
    try {
      // Menggunakan 'email' karena 'username' menyebabkan error 400
      const { data } = await axios.post(
        'https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/auth/login',
        { 
          email: email, 
          password: password 
        }
      );

      if (data.token) {
        const userToStore = {
          name: data.name,
          email: data.email,
          role: data.role,
        };

        // Simpan token dan user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userToStore));
        
        // Set header otorisasi untuk semua request axios selanjutnya
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        setUser(userToStore);

        return { success: true, user: userToStore };
      } else {
        throw new Error('Login gagal, token tidak ditemukan');
      }
    } catch (error) {
      console.error("❌ Error saat login:", error.response ? error.response.data : error.message);
      // Lempar error agar bisa ditangkap di komponen Login
      throw error;
    }
  };

  // 🔓 Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Hapus header otorisasi dari axios
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}