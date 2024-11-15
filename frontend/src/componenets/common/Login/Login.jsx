import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../../assets/general/new.png';
import image2 from '../../../assets/Images/bg.jfif';
import { login } from '../../../services/userService';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      localStorage.setItem('token', result.token);
      navigate('/manage');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="image-section" style={{ backgroundImage: `url(${image2})` }}></div>
      <div className="form-section">
        <div className="login-header">
          <img src={logo} alt="Company Logo" />
          <h1>Welcome to Addis Bank S.C</h1>
          <h2>Questionnaire Stack System</h2>
        </div>
        <form onSubmit={handleLogin}>
          {error && <p className="error">{error}</p>}
          <div className="input-group">
            <i className="fa fa-user" aria-hidden="true"></i>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <i className="fa fa-lock" aria-hidden="true"></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className='log'>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
