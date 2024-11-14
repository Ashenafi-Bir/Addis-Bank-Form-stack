import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>Addis Bank</h2>
          <p>Questioner Stack System</p>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@addisbanksc.com</p>
          <p>Phone: +251 11 557 0523</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Addis Bank. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
