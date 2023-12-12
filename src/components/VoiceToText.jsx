import React, { useState, useRef, useEffect } from 'react';

const VoiceToText = ({ sentence, setSentence }) => {
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isListening) {
      startRecognition();
    } else {
      stopRecognition();
    }

    return () => {
      stopRecognition();
    };
  }, [isListening]);

  const startRecognition = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
      }

      recognitionRef.current.onstart = () => console.log('Recognition started');
      recognitionRef.current.onresult = handleSpeechResult;

      recognitionRef.current.onerror = (event) => {
        console.error('Error occurred in recognition:', event.error);
        stopRecognition();
      };

      recognitionRef.current.start();
    } else {
      alert('Your browser does not support the Web Speech API. Please try a different browser.');
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.stop();
    }
  };

  const handleSpeechResult = (event) => {
    for (let i = 0; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const spokenSentence = event.results[i][0].transcript;
        //console.log('Spoken Sentence:', spokenSentence);
        setSentence(spokenSentence);
      }
    }
  };

  const toggleListening = () => {
    setIsListening((prevIsListening) => !prevIsListening);
  };

  return (
    <div>
      <button onClick={toggleListening}>{isListening ? 'Stop Listening' : 'Start Listening'}</button>
    </div>
  );
};

export default VoiceToText;
