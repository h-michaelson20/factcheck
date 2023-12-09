import React, { useState, useEffect } from 'react';
import axios from 'axios';

//require('dotenv').config();

const ChatBox = ({ sentence }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const initialContext = 'what kind of sentence is this: ' + sentence + 'RESPOND WITH ONE OF THE FOLLOWING AND NOTHING ELSE: [OPINION, FACT/FIGURE, QUOTE/REFERENCE, TRANSITION]';

  useEffect(() => {
    setNewMessage(initialContext);
  }, [sentence]);

  useEffect(() => {
    if(newMessage.includes('what kind of')){
        handleSendMessage();
    }
  }, [newMessage]);

  const handleSendMessage = async () => {
    console.log('Bearer ' + process.env.REACT_APP_OPENAI_API_KEY);
    try {
      // Send user message to the OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          messages: [
            {
              role: 'user',
              content: newMessage,
            },
          ],
          max_tokens: 50,
          model: 'gpt-3.5-turbo',
        },
        {
          headers: {
            Authorization: 'Bearer ' + process.env.REACT_APP_OPENAI_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      // Extract the AI response from the API response
      const responseText = response.data.choices[0].message.content;
      console.log(responseText);

      checkForTypeOfSentence(responseText);

      // Update the chat interface
      setMessages([...messages, { text: newMessage, user: true }, { text: responseText, user: false }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message to OpenAI API:', error.response.status, error.response.data);
      // Handle the error as needed (e.g., show an error message to the user)
    }
  };

  function checkForTypeOfSentence(response) {
    if (response.includes('OPINION')) {
      console.log('dont call');
    }

    if (
      response.toLowerCase().includes('fact') ||
      response.toLowerCase().includes('figure') ||
      response.toLowerCase().includes('quote') ||
      response.toLowerCase().includes('reference')
    ) {
      console.log('needs bing call');
    }
  }

  return (
    <div>
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={message.user ? 'user-message' : 'ai-message'}>
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => {
            setNewMessage(e.target.value);
          }
        }
      />
      <button className="chat-button" onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
};

export default ChatBox;