import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Pastikan path ini benar
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // --- HANYA BAGIAN INI YANG BERUBAH ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // 1. Panggil fungsi login dari context. Tidak ada lagi axios di sini.
      const loggedInData = await login(email, password);

      if (loggedInData && loggedInData.user) {
        const { role } = loggedInData.user;
        
        // 2. Navigasi berdasarkan role dari data yang dikembalikan
        if (role === 'owner' || role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        // Pengaman jika login berhasil tapi tidak ada data user
        navigate(from, { replace: true });
      }

    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login gagal, periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };
  // --- AKHIR DARI BAGIAN YANG BERUBAH ---

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="text-center mb-4"><strong>MAHA PARFUME</strong> Login</h4>
        {errorMsg && (
          <div className="alert alert-danger" role="alert">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleLogin}>
          {/* ... Isi form Anda tidak berubah ... */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <div className="mt-3 text-center">
          <small>
            Belum punya akun? <Link to="/register">Register</Link>
          </small><br />
          <small>
            <Link to="/forgot-password">Lupa password?</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;