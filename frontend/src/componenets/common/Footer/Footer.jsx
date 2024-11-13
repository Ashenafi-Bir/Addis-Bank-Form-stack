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
        {/* <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Forms</a></li>
            <li><a href="#">Report</a></li>
            <li><a href="#">Create</a></li>
          </ul>
        </div> */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@addisbank.com</p>
          <p>Phone: +251 11 123 4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Addis Bank. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
