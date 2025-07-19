// src/ciphers/DES/steps/DecryptStep0DesRoundFlow.jsx
import React from 'react';

const Step0DesRoundFlow = () => {
  return (
    <div className="aes-container">
      {/* INPUTS + IP */}
      <div className="aes10-section">
        <div className="aes10-input-row">
          <div className="aes10-box">64-bit Ciphertext</div>
          <div className="aes10-box">56-bit Cipher Key</div>
        </div>
        <div className="aes10-arrow">↓</div>
        <div className="aes10-box-wide">Initial Permutation (IP)</div>
        <div className="aes10-arrow">↓</div>
        <div className="aes10-box-round">Split into L₀ and R₀</div>
      </div>

      {/* KEY GENERATOR */}
      <div className="aes10-section">
        <div className="aes10-box-wide">Key Generator → K₁₆ to K₁ (48-bit)</div>
      </div>

      {/* ROUND 1 EXPANDED DIAGRAM */}
      <div className="aes10-section">
        <div className="aes10-arrow">↓</div>
        <div className="aes10-box-round">Round 1 (K₁₆)</div>

        <div className="aes10-step-row">
          {/* FUNCTION block */}
          <div className="aes10-box-column">
            <div className="aes10-box-sm">Function f(R₀, K₁₆)</div>
            <div className="aes10-nested-row">
              <div className="aes10-box-sm nested">Expand R₀ (32 → 48)</div>
              <div className="aes10-box-sm nested">⊕ K₁₆</div>
              <div className="aes10-box-sm nested">S-Boxes (×8)</div>
              <div className="aes10-box-sm nested">P-Box</div>
            </div>
          </div>

          {/* MIXER block */}
          <div className="aes10-box-column">
            <div className="aes10-box-sm">Mixer</div>
            <div className="aes10-nested-row">
              <div className="aes10-box-sm nested">L₀ ⊕ f(R₀, K₁₆)</div>
            </div>
          </div>

          {/* SWAPPER block */}
          <div className="aes10-box-column">
            <div className="aes10-box-sm">Swapper</div>
            <div className="aes10-nested-row">
              <div className="aes10-box-sm nested">L₁ = R₀</div>
              <div className="aes10-box-sm nested">R₁ = Mixer Output</div>
            </div>
          </div>
        </div>
      </div>

      {/* REMAINING ROUNDS (unexpanded) */}
      {Array.from({ length: 15 }, (_, i) => (
        <div key={i + 2} className="aes10-section">
          <div className="aes10-arrow">↓</div>
          <div className="aes10-box-round">Round {i + 2} (K{16 - i - 1})</div>
          <div className="aes10-step-row">
            <div className="aes10-box-sm">Function</div>
            <div className="aes10-box-sm">Mixer</div>
            <div className="aes10-box-sm">Swapper</div>
          </div>
        </div>
      ))}

      {/* FINAL STEPS */}
      <div className="aes10-section">
        <div className="aes10-arrow">↓</div>
        <div className="aes10-box-round">Final Swap (R₁₆ || L₁₆)</div>
        <div className="aes10-arrow">↓</div>
        <div className="aes10-box-wide">Final Permutation (IP⁻¹)</div>
        <div className="aes10-arrow">↓</div>
        <div className="aes10-box">64-bit Plaintext Output</div>
      </div>
    </div>
  );
};

export default Step0DesRoundFlow;
