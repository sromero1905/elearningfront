import React from 'react';
import HelpCenter from '../components/helpcenter';
import Header from "../components/Header";
import ChatPanel from '../components/chat';
const HelpPage = () => {
  return (
    <main className="">
      <div className="">
        <HelpCenter />
        <ChatPanel/>
      </div>
    </main>
  );
};

export default HelpPage;