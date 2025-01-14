import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import HelpPage from './pages/HelpPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home/:id" element={<HomePage />} />
      <Route path="/course" element={<CoursePage />} />
      <Route path="/help" element={<HelpPage />} />
    
    </Routes>
  );
};

export default App;