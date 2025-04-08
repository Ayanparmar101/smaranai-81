
import React from 'react';
import ChatContainer from '@/components/chat/ChatContainer';

const HindiChatbotPage = () => {
  return (
    <ChatContainer 
      title="हिंदी चैटबॉट (Hindi Chatbot)" 
      storageKey="hindi-chatbot" 
      processingFunction={async (message, imageUrl) => {
        // This is a placeholder. In a real app, this would call an API to process Hindi messages and images
        let response = `आपका संदेश मिला: ${message}`;
        
        if (imageUrl) {
          response += '\n\nआपने एक छवि भी भेजी है। (You have also sent an image.)';
        }
        
        return response;
      }}
    />
  );
};

export default HindiChatbotPage;
