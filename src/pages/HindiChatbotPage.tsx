
import React from 'react';
import ChatContainer from '@/components/chat/ChatContainer';
import { openaiService } from '@/services/openai';

const HindiChatbotPage = () => {
  return (
    <ChatContainer 
      title="हिंदी चैटबॉट (Hindi Chatbot)" 
      storageKey="hindi-chatbot" 
      processingFunction={async (message, imageUrl) => {
        try {
          // Use OpenAI API to process the message
          const systemPrompt = "You are a helpful Hindi chatbot. Always respond in Hindi script. If the user sends a message in English, translate it to Hindi and then respond in Hindi. Be polite, helpful, and engaging.";
          
          let userPrompt = message;
          
          // If an image was uploaded, include that information in the prompt
          if (imageUrl) {
            userPrompt += "\n\nUser has uploaded an image. Please acknowledge that in your response.";
          }
          
          const response = await openaiService.createCompletion(systemPrompt, userPrompt);
          return response;
        } catch (error) {
          console.error("Error processing message:", error);
          return "क्षमा करें, प्रतिक्रिया देने में त्रुटि हुई है। कृपया पुनः प्रयास करें। (Sorry, there was an error. Please try again.)";
        }
      }}
    />
  );
};

export default HindiChatbotPage;
