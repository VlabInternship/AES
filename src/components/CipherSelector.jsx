// src/pages/Landing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CipherSelector = () => {
  const [cipher, setCipher] = useState('AES');
  const [mode, setMode] = useState('encrypt');
  const navigate = useNavigate();

  const handleStart = () => {
    if (cipher === 'AES' && mode === 'encrypt') navigate('/aes/encrypt');
    if (cipher === 'AES' && mode === 'decrypt') navigate('/aes/decrypt');
    if (cipher === 'DES' && mode === 'encrypt') navigate('/des/encrypt');
    if (cipher === 'DES' && mode === 'decrypt') navigate('/des/decrypt');
  };

  return (
    <div className="landing-container">
      <h1 className="title">Welcome to CryptoVLab</h1>
      <p className="subtitle">Visualize Step-by-Step Cipher Operations</p>

      <div className="form-grid">
        <div>
          <label>Choose Cipher</label>
          <select value={cipher} onChange={(e) => setCipher(e.target.value)}>
            <option value="AES">AES</option>
            <option value="DES">DES</option>
          </select>
        </div>

        <div>
          <label>Operation</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="encrypt">Encryption</option>
            <option value="decrypt">Decryption</option>
          </select>
        </div>
      </div>

      <button onClick={handleStart} className="start-button">
        Start Simulation →
      </button>
    </div>
  );
};

export default CipherSelector;
