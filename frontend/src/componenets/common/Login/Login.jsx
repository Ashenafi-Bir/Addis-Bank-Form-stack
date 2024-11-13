// components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../../assets/general/logo12.png';
import { login } from '../../../services/userService'; // Import the login function from userService

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(username, password); // Use the login function from userService
    if (result.success) {
      localStorage.setItem('token', result.token);
      navigate('/manage');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={logo} alt="Company Logo" />
          <div className='tit'>
            <h1>Addis Bank S.C</h1>
            <h2>Form Stack System</h2>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
