// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import AesSimulator from './ciphers/AES/AesSimulator';
import DesSimulator from './ciphers/DES/DesSimulator'; // Make sure this file exists
import CipherSelector from './components/CipherSelector';

function App() {
  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <CipherSelector />
        <Routes>
          <Route path="/aes" element={<AesSimulator />} />   
          <Route path="/des" element={<DesSimulator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
