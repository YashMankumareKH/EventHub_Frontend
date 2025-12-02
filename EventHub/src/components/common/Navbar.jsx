import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Calendar, User, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Calendar size={28} />
          <span>EventHub</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            <Home size={18} />
            Home
          </Link>
          <Link to="/events" className="navbar-link">
            <Calendar size={18} />
            Events
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link">
                <User size={18} />
                Dashboard
              </Link>
              <div className="navbar-user">
                <span>{user.firstName} {user.lastName}</span>
                <span className="user-role">{user.role.replace('ROLE_', '')}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-logout">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;