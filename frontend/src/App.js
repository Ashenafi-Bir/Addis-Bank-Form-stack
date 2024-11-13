import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage'; // Layout component with Header and Footer
import UserForm from './pages/UserForm'; // Public route (accessible without authentication)
import Login from './componenets/common/Login/Login';

// Redirect route for "/"
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/form/:formId" element={<UserForm />} />
        <Route path="/*" element={<MainPage />} />
      </Routes>
    </Router>
  );
};

export default App;
