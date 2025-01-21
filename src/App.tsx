import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import HomePage from './pages/HomePage';
import HelpPage from './pages/HelpPage'
import ConfigurationPage from './pages/ConfigurationPage';
import ProfilePage from './pages/ProfilePage';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home/:id" element={<HomePage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/configuration" element={<ConfigurationPage />} />
      <Route path="/my-profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default App;