import React from 'react';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import useAuth from '../hooks/useAuth'; // ✅ ambil dari custom hook AuthContext

const NavbarComponent = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const navigate = useNavigate();

  const { user, logout } = useAuth(); // ✅ gunakan context global

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm sticky-top">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">MAHA PARFUME</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/collection">Collection</Nav.Link>
            <Nav.Link as={Link} to="/teams">Teams</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>

            {user ? (
              <NavDropdown title={user.name || user.email} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/profile">Profil</NavDropdown.Item>

                {(user.role === 'admin' || user.role === 'owner') && (
                  <NavDropdown.Item as={Link} to="/admin/dashboard">
                    Admin Dashboard
                  </NavDropdown.Item>
                )}

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}

            <Nav.Link as={Link} to="/cart" className="position-relative">
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
