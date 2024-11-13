import React from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/general/logo12.png';

function Header() {
  const navigate = useNavigate(); // For programmatic navigation

  // Logout function to remove token and redirect to login page
  const handleLogout = () => {
    // Clear the token from localStorage to log out
    localStorage.removeItem('token');
    
    // Redirect the user to the login page
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/manage">
          <img src={logo} alt="Addis Bank" className="footer-logo" />
        </Link>
        <h1>Addis Bank Questioner Stack </h1>
      </div>
      
      {/* Add Logout button */}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </header>
  );
}

export default Header;
