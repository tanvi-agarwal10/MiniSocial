import React, { useContext } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = ({ onCreateClick }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="dark" data-bs-theme="dark" sticky="top">
      <Container>
        <BootstrapNavbar.Brand onClick={() => navigate('/feed')} className="cursor-pointer">
          📱 Mini Social
        </BootstrapNavbar.Brand>
        <Nav className="ms-auto align-items-center">
          {user && (
            <>
              <span className="text-white me-3">Welcome, {user.username}!</span>
              <Button
                variant="outline-light"
                size="sm"
                className="me-2"
                onClick={onCreateClick}
              >
                + Create Post
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
