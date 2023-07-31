import VoiceAssistant from './components/VoiceAssistant'
import Conversations from './components/Conversations'
import Conversation from './components/Conversation'
import About from './components/About'
import {
  Routes,
  Route,
  Link
} from "react-router-dom";
import { useState } from 'react';

function App() {
  const [conversations,setConversations] = useState([
    {"role": "system", "content": "You are a helpful assistant. You can hear and speak through texts. You give only short answers"},
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hello, how can I help you?"},
  ])
    
  return (
    <div className='App'>
      <h2> ChatGPT Voice-Powered Assistant </h2>
      <div className='header'>
        <Link to='/' className='li'> Home </Link> 
        <Link to='/conversations' className='li'> Saved </Link>
        <Link to='/about' className='li'> About </Link>
      </div>      
      <Routes>
        <Route exact path='/' element={<VoiceAssistant conversations={conversations} setConversations={setConversations}/>}/>
        <Route exact path="/conversations" element={<Conversations/>} />
        <Route exact path="/conversations/:conversation_id" element={<Conversation/>} />
        <Route exact path="/about" element={<About/>} />
      </Routes>
    </div>
  );

}

export default App;

