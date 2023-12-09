import React, { useState, useEffect }  from 'react';
import './App.css';
import ChatBox from './ChatBox.js';
import VoiceToText from './components/VoiceToText.jsx';

function App() {

  const [sentence, setSentence] = useState('');

  return (
    <div className="App">
      <p>test</p>
      <ChatBox sentence={sentence} />
      <VoiceToText sentence={sentence} setSentence={setSentence} />
    </div>
  );
}

export default App;
