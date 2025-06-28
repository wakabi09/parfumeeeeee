import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './routes/AdminRoute';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './context/AuthProvider';
import useAuth from './hooks/useAuth';
import LoadingScreen from './components/LoadingScreen';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const LoginPage = lazy(() => import('./pages/AuthPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const TeamsPage = lazy(() => import('./pages/TeamsPage'));
const Thankyou = lazy(() => import('./pages/Thankyou'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const CareTipsPage = lazy(() => import('./pages/CareTipsPage'));
const AccessDeniedPage = lazy(() => import('./pages/AccessDeniedPage')); // ⬅️ Tambahan

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarComponent />

      <main className="flex-grow-1">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/thankyou" element={<Thankyou />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/care-tips" element={<CareTipsPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Route */}
            <Route
              path="/payment"
              element={
                <PrivateRoute>
                  <PaymentPage />
                </PrivateRoute>
              }
            />

            {/* Admin Area */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Access Denied */}
            <Route path="/access-denied" element={<AccessDeniedPage />} />

            {/* Not Found */}
            <Route
              path="*"
              element={
                <h2 className="text-center mt-5">
                  404 - Halaman Tidak Ditemukan
                </h2>
              }
            />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
