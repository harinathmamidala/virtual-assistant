import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import './styles/header.css'
import './styles/Switch.css'
import './styles/App.css'
import './styles/VoiceAssistant.css'
import './styles/savebutton.css'
import './styles/conversations.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);