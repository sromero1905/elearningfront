import React from 'react';
import HelpCenter from '../components/helpcenter';
import Header from "../components/Header";
import ChatPanel from '../components/chat';

const HelpPage = () => {
  return (
    <main className="relative min-h-screen">
      <div className="relative z-50">
        <Header />
      </div>
      
      <div className="relative z-0">
        <HelpCenter />
      </div>
      
      <div className="relative z-40">
        <ChatPanel />
      </div>
    </main>
  );
};

export default HelpPage;