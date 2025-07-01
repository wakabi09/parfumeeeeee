import React, { useState, useEffect } from 'react'; // Import useState dan useEffect
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import useAuth from '../hooks/useAuth';

const NavbarComponent = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const navigate = useNavigate();
  const location = useLocation(); // Inisialisasi useLocation

  const { user, logout } = useAuth();

  // State untuk mengontrol expanded/collapsed status navbar
  const [expanded, setExpanded] = useState(false);

  // Fungsi untuk menutup navbar collapse
  const closeNavbar = () => setExpanded(false);

  // Gunakan useEffect untuk menutup navbar saat lokasi berubah
  useEffect(() => {
    closeNavbar();
  }, [location]); // Bergantung pada 'location' agar efek berjalan setiap kali URL berubah

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeNavbar(); // Pastikan navbar juga tertutup saat logout
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm sticky-top" expanded={expanded} onToggle={() => setExpanded(!expanded)}>
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4" onClick={closeNavbar}>MAHA PARFUME</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* Setiap Nav.Link dan NavDropdown.Item harus memanggil closeNavbar */}
            <Nav.Link as={Link} to="/" onClick={closeNavbar}>Home</Nav.Link>
            <Nav.Link as={Link} to="/collection" onClick={closeNavbar}>Collection</Nav.Link>
            <Nav.Link as={Link} to="/teams" onClick={closeNavbar}>Teams</Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={closeNavbar}>About</Nav.Link>

            {user ? (
              <NavDropdown title={user.name || user.email} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/profile" onClick={closeNavbar}>Profil</NavDropdown.Item>

                {(user.role === 'admin' || user.role === 'owner') && (
                  <NavDropdown.Item as={Link} to="/admin/dashboard" onClick={closeNavbar}>
                    Admin Dashboard
                  </NavDropdown.Item>
                )}

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login" onClick={closeNavbar}>Login</Nav.Link>
            )}

            <Nav.Link as={Link} to="/cart" className="position-relative" onClick={closeNavbar}>
              <FaShoppingCart size={22} />
              {cartCount > 0 && (
                <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;