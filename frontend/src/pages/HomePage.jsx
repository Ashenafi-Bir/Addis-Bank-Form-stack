import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to Addis Bank Form Stack </h1>
        <p className="hero-description">A complete system to manage, create, and view forms easily.</p>
      </div>

      <div className="button-container">
        <Link to="/create-form" className="home-button">Create Questioner</Link>
        {/* <Link to="/admin/forms" className="home-button">Admin Form List</Link> */}
        <Link to="/export" className="home-button">Export Data</Link>
      </div>
    </div>
  );
}

export default HomePage;
