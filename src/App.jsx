// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import AesEncryptor from './ciphers/AES/Encryption/AesEncryptor';
import AesDecryptor from './ciphers/AES/Decryption/AesDecryptor';
import DesEncryptor from './ciphers/DES/Encryption/DesEncryptor';
import DesDecryptor from './ciphers/DES/Decryption/DesDecryptor';
import CipherSelector from './components/CipherSelector';

function App() {
  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<CipherSelector />} />
          <Route path="/aes/encrypt" element={<AesEncryptor />} />
          <Route path="/aes/decrypt" element={<AesDecryptor />} />
          <Route path="/des/encrypt" element={<DesEncryptor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
