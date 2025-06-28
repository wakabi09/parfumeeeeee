import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner" />
      <p>Memuat halaman...</p>
    </div>
  );
};

export default LoadingScreen;
