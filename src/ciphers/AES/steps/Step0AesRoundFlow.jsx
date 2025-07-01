// src/ciphers/AES/steps/Step10AesRoundFlow.jsx
import React from 'react';

const Step10AesRoundFlow = () => {
  const rounds = Array.from({ length: 11 }, (_, i) => i);

  return (
    <>
      <div className="aes-container">
      <div className="aes10-section">
        <div className="aes10-input-row">
          <div className="aes10-box">Plaintext</div>
          <div className="aes10-box">Cipher Key</div>
        </div>
        <div className="aes10-arrow">↓</div>

        <div className="aes10-box-wide">Key Expansion → Generates K₀ to K₁₀</div>
        <div className="aes10-arrow">↓</div>

        <div className="aes10-box-round">Initial Round</div>
        <div className="aes10-box">AddRoundKey (K₀)</div>
      </div>

      {rounds.slice(1, 10).map((r) => (
        <div key={r} className="aes10-section">
          <div className="aes10-arrow">↓</div>
          <div className="aes10-box-round">Round {r}</div>
          <div className="aes10-step-row">
            <div className="aes10-box-sm">SubBytes</div>
            <div className="aes10-box-sm">ShiftRows</div>
            <div className="aes10-box-sm">MixColumns</div>
            <div className="aes10-box-sm">AddRoundKey (K{r})</div>
          </div>
        </div>
      ))}

      <div className="aes10-section">
        <div className="aes10-arrow">↓</div>
        <div className="aes10-box-round">Final Round (Round 10)</div>
        <div className="aes10-step-row">
          <div className="aes10-box-sm">SubBytes</div>
          <div className="aes10-box-sm">ShiftRows</div>
          <div className="aes10-box-sm no-mix">⛔ No MixColumns</div>
          <div className="aes10-box-sm">AddRoundKey (K₁₀)</div>
        </div>
        <div className="aes10-arrow">↓</div>
        <div className="aes10-box-wide final">Ciphertext</div>
      </div>
    </div>
    
</>
  );
};

export default Step10AesRoundFlow;
