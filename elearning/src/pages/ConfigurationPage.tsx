import React from 'react';
import Configuration from '../components/Configuration';
import Header from '../components/Header';

const ConfigurationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <Header />
      <main className="relative">
        <Configuration />
      </main>
    </div>
  );
};

export default ConfigurationPage;