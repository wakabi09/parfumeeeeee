// src/pages/RegisterPage.jsx

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nama minimal 3 karakter';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await axios.post(
        'https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/auth/register',
        formData
      );

      const { token, name, email, role } = res.data;

      // Simpan ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name, email, role }));

      // Set ke context
      login({ name, email, role });

      // Redirect berdasarkan role
      if (role === 'owner' || role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }

      // Reset form
      setFormData({ name: '', email: '', password: '', adminCode: '' });

    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mendaftar';
      setErrors({ server: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="text-center mb-4"><strong>MAHA PARFUME</strong> Register</h4>

        {errors.server && (
          <div className="alert alert-danger">{errors.server}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nama</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Kode Admin (opsional)</label>
            <input
              type="password"
              name="adminCode"
              className="form-control"
              value={formData.adminCode}
              onChange={handleChange}
              disabled={loading}
            />
            <div className="form-text">Kosongkan jika daftar sebagai user biasa.</div>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Mendaftarkan...' : 'Daftar'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <small>
            Sudah punya akun? <Link to="/login">Login</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
