import React from 'react';
import CourseProfile from '../components/MyProfile';
import Header from '../components/Header';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <Header />
      <main className="relative">
        <CourseProfile />
      </main>
    </div>
  );
};

export default ProfilePage;