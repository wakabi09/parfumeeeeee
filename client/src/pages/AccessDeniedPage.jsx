import React from 'react';
import { Link } from 'react-router-dom';

const AccessDeniedPage = () => {
  return (
    <div className="text-center mt-5">
      <h2>Akses Ditolak</h2>
      <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default AccessDeniedPage;
