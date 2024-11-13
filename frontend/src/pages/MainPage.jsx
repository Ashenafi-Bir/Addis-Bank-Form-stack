import React from 'react';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import AdminFormCreator from './AdminFormCreator';
import AdminFormList from './AdminFormList';
import AdminFormEditor from './AdminFormEditor';
import ManagerExport from './ManagerExport';
import Header from '../componenets/common/Header/Header';
import Footer from '../componenets/common/Footer/Footer';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const MainPage = () => {
  return (
    <>
      <Header/>
      <Routes>
      {/* Protected Routes */}
                <Route path="/manage" element={<PrivateRoute><HomePage/></PrivateRoute>} />
                <Route path="/create-form" element={<PrivateRoute><AdminFormCreator /></PrivateRoute>} />
                <Route path="/admin/forms" element={<PrivateRoute><AdminFormList /></PrivateRoute>} />
                <Route path="/admin/form/:formId" element={<PrivateRoute><AdminFormEditor /></PrivateRoute>} />
                <Route path="/export" element={<PrivateRoute><ManagerExport /></PrivateRoute>} />
      
      </Routes>
      <Footer />
    </>
  );
};

export default MainPage;
