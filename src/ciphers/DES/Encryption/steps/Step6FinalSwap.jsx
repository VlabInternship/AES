// src/ciphers/DES/steps/Step6FinalSwap.jsx
import React from 'react';
import { motion } from 'framer-motion';
import MatrixTable from '../../../../components/MatrixTable';

const Step6FinalSwap = ({ L16Bits, R16Bits }) => {
  if (!L16Bits || !R16Bits || L16Bits.length !== 32 || R16Bits.length !== 32) {
    return <div className="error-box">Invalid L₁₆ or R₁₆ input</div>;
  }

  const preOutput = R16Bits + L16Bits; // Swap before permutation

  const toMatrix = (bits) => {
    return Array.from({ length: 8 }, (_, i) => bits.slice(i * 8, i * 8 + 8).split(''));
  };

  return (
    <motion.div
      className="des-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="explanation-box">
        <p><strong>Step 6: Final Swap</strong></p>
        <ul>
          <li>After Round 16, the two halves are swapped: <strong>R₁₆‖L₁₆</strong></li>
          <li>This prepares the block for the final permutation (IP⁻¹)</li>
        </ul>
      </div>

      <div className="step-row-grid">
        <div className="step-box">
          <h4>L₁₆ (32 bits)</h4>
          <MatrixTable matrix={toMatrix(L16Bits)} />
        </div>
        <div className="step-box">
          <h4>R₁₆ (32 bits)</h4>
          <MatrixTable matrix={toMatrix(R16Bits)} />
        </div>
      </div>

      <div className="step-row-grid">
        <div className="step-box">
          <h4>PreOutput: R₁₆‖L₁₆ (64 bits)</h4>
          <MatrixTable matrix={toMatrix(preOutput)} />
        </div>
      </div>
    </motion.div>
  );
};

export default Step6FinalSwap;
