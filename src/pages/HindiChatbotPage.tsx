
import React from 'react';
import ChatContainer from '@/components/chat/ChatContainer';

const HindiChatbotPage = () => {
  return (
    <ChatContainer 
      title="हिंदी चैटबॉट (Hindi Chatbot)" 
      storageKey="hindi-chatbot" 
      processingFunction={async (message) => {
        // This is a placeholder. In a real app, this would call an API to process Hindi messages
        return `आपका संदेश मिला: ${message}`;
      }}
    />
  );
};

export default HindiChatbotPage;
