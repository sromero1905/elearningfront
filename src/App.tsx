// App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import HomePage from './pages/HomePage';
import HelpPage from './pages/HelpPage';
import ConfigurationPage from './pages/ConfigurationPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      <Route path="/home/:id" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      <Route path="/help" element={
        <ProtectedRoute>
          <HelpPage />
        </ProtectedRoute>
      } />
      <Route path="/configuration" element={
        <ProtectedRoute>
          <ConfigurationPage />
        </ProtectedRoute>
      } />
      <Route path="/my-profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      {/* Ruta de fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;