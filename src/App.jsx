// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AesSimulator from './ciphers/AES/AesSimulator';
import CipherSelector from './components/CipherSelector';

function App() {
  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <CipherSelector />
        <Routes>
          <Route path="/" element={<AesSimulator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
