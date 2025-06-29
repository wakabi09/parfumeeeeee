import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await axios.post(
        'https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/auth/login',
        { email, password }
      );

      const { token, name, email: userEmail, role } = res.data;

      // ✅ Simpan ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name, email: userEmail, role }));

      // ✅ Update context
      login({ name, email: userEmail, role });

      // ✅ Redirect berdasarkan role
      if (role === 'owner' || role === 'admin') {
  navigate('/admin/dashboard', { replace: true });
} else {
  navigate(from, { replace: true });
}

    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

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
