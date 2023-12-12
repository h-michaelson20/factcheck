import React, { useState } from 'react';
import './App.css';
import ChatBox from './ChatBox.js';
import VoiceToText from './components/VoiceToText.jsx';

function App() {
  const [sentence, setSentence] = useState('');

  return (
    <div className="App">
      <header>
        <h1>Live Speech Fact Checker</h1>
      </header>
      <main>
        <div className="video-container">
          {/* Replace 'YOUTUBE_VIDEO_ID' with the actual video ID from your YouTube link */}
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/vm-v5fkNXqk?si=pODhRjuHg_Zya2vv"
            title="YouTube Video"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
        <div className="chat-container">
          <VoiceToText sentence={sentence} setSentence={setSentence} />
          <ChatBox sentence={sentence} />
        </div>
      </main>
    </div>
  );
}

export default App;