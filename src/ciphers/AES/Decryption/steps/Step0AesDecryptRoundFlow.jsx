import React from 'react';
import '../../../../styles/aes.css';

const Step0AesDecryptRoundFlow = () => {
  const rounds = Array.from({ length: 11 }, (_, i) => i);
  const roundsReversed = rounds.slice(2, 11).reverse();

  return (
    <div className="aes-container">
      <div className="aes10-section">
        <h4 className="aes10-box-round">AES-128 Decryption Round Flow</h4>
        <div className="aes10-input-row">
          <div className="aes10-box">Input Ciphertext</div>
          <div className="aes10-box">Cipher Key</div>
        </div>
        <div className="aes10-arrow">↓</div>

        <div className="aes10-box-wide">Key Expansion → Generates K10 to K0</div>
        <div className="aes10-arrow">↓</div>

        <div className="aes10-box-round">Initial Round</div>
        <div className="aes10-box">AddRoundKey (K10)</div>
        
        {roundsReversed.map((r) => (
        <div key={r} className="aes10-section">
          <div className="aes10-arrow">↓</div>
          <div className="aes10-box-round">Round {r}</div>
          <div className="aes10-step-row">
            <div className="aes10-box-sm">InvShiftRows</div>
            <div className="aes10-box-sm">InvSubBytes</div>
            <div className="aes10-box-sm">InvMixColumns</div>
            <div className="aes10-box-sm">AddRoundKey (K{r-1})</div>
          </div>
        </div>
      ))}

      <div className="aes10-section">
        <div className="aes10-arrow">↓</div>
        <div className="aes10-box-round">Final Round (Round 1)</div>
        <div className="aes10-step-row">
          <div className="aes10-box-sm">InvShiftRows</div>
          <div className="aes10-box-sm">InvSubBytes</div>
          <div className="aes10-box-sm no-mix">⛔ No InvMixColumns</div>
          <div className="aes10-box-sm">AddRoundKey (K0)</div>
        </div>
        <div className="aes10-arrow">↓</div>
          <div className="aes10-box-wide final">Plaintext</div>
      </div>
    </div>
    </div>
  );
};
export default Step0AesDecryptRoundFlow;
