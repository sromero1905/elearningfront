import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home/:id" element={<HomePage />} />
      <Route path="/course" element={<CoursePage />} />
    </Routes>
  );
};

export default App;