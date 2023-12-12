import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBox.css';

//require('dotenv').config();

const ChatBox = ({ sentence }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  let transcriptRef = useRef('');
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [factCheck, setFactCheck] = useState('');

  useEffect(() => {
    transcriptRef.current += sentence + ' ';
    const MAX_LENGTH = 800; // character limit for transcript
    if (transcriptRef.current.length > MAX_LENGTH) {
        transcriptRef.current = transcriptRef.current.substring(transcriptRef.current.length - MAX_LENGTH);
    }
    console.log(startTime);
    console.log(new Date().getTime());
    if(new Date().getTime() - 60000 > startTime){
        handleSendMessageTo4();
        setStartTime(startTime + 60000);
    }
  //  const allSentences = breakUpSentences();
  //  for (let i = 0; i < allSentences.length; i++) {
  //      console.log(allSentences[i]);
       // handleSendMessage('what kind of sentence is this: ' + allSentences[i] + 'RESPOND WITH ONE OF THE FOLLOWING AND NOTHING ELSE: [OPINION, FACT/FIGURE, QUOTE/REFERENCE, TRANSITION]');
  //  }
  }, [sentence]);

  const handleSendMessageTo4 = async () => {
    console.log('Bearer ' + process.env.REACT_APP_OPENAI_API_KEY);
    console.log(transcriptRef.current);
    try {
        // Send user message to the OpenAI API
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            messages: [
              {
                role: 'user',
                content: 'summarize this in TWO SENTENCES and then, given that you already know this is donald trump speaking in december 2023: ' +
                         'give one FALSE STATEMENT from this transcript and ONLY IN THIS FOLLOWING TRANSCRIPT if any' +
                         '. HERE IS THE TRANSCRIPT: "' + transcriptRef.current +
                         '\nformatting should look like this example - \n' +
                         'Summary:\nFalse statement:' +
                         '\nif there is no false statement, do NOT say that there is no false statement, just leave that part out'
              },
            ],
            max_tokens: 100,
            model: 'gpt-4',
            temperature: 0.7,
        /*    functions: [{
              name: "lookUpStatement",
              description: "get validity of statement",
              parameters: {
                 type: "object",
                 properties: {
                    statement: {
                       type: "string",a
                       description: "The statement to be searched on the internet."
                    }
                 },
              required: ["statement"]
              }
            }]*/
          },
          {
            headers: {
              Authorization: 'Bearer ' + process.env.REACT_APP_OPENAI_API_KEY,
              'Content-Type': 'application/json',
            },
          }
        );
      // Extract the AI response from the API response
      const responseChoice = response.data.choices[0];
if (responseChoice && responseChoice.message) {
  const responseText = responseChoice.message.content;
  if (responseText.toLowerCase().includes("false statement:")) {
    const startIndex = responseText.toLowerCase().indexOf("false statement:") + "false statement:".length;
    const substringAfterFalseStatement = responseText.substring(startIndex);
    const substringOfSummary = responseText.substring(0, startIndex - "false statement:".length);
    setFactCheck(factCheck + '\n\n' + substringAfterFalseStatement); // need image here too
  }
} else {
  console.error("Invalid response structure: Unable to extract AI response");
}
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
      handleSendMessageTo4(sentence);
    }
  }

  function breakUpSentences(){
    const punctuationRegex = /[.!?]/;
    const sentences = sentence.split(punctuationRegex);
    const nonEmptySentences = sentences.filter((s) => s.trim() !== '');
    return nonEmptySentences;
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
      <div className="transcript-container">
        <h2>Transcript:</h2>
        <p>{transcriptRef.current}</p>
        <h2>Fact Check:</h2>
        <p>{factCheck}</p>
      </div>
    </div>
  );
};

export default ChatBox;