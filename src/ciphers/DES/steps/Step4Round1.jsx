import React from 'react';
import { motion } from 'framer-motion';
import MatrixTable from '../../../components/MatrixTable';

const Step4Round1 = ({ L0Bits, R0Bits, K1Bits, expandedR, xorWithKey, sboxOutput, pboxOutput, R1Bits }) => {
  const isValidBits = (bits, length) =>
    typeof bits === 'string' && bits.length === length;

  const toMatrix = (bits, rowLength) => {
    if (!isValidBits(bits, bits?.length)) return [];
    return Array.from({ length: Math.ceil(bits.length / rowLength) }, (_, i) =>
      bits.slice(i * rowLength, i * rowLength + rowLength).split('')
    );
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
        <p><strong>DES Round 1:</strong> The first round uses R₀ and K₁ to compute f(R₀, K₁), which is then XORed with L₀. L₁ = R₀ and R₁ = L₀ ⊕ f(R₀, K₁).</p>
      </div>

      <div className="step-row-grid">
        {isValidBits(R0Bits, 32) && (
          <div className="step-box">
            <h4>R₀ (32 bits)</h4>
            <MatrixTable matrix={toMatrix(R0Bits, 8)} />
          </div>
        )}
        {isValidBits(expandedR, 48) && (
          <div className="step-box">
            <h4>Expanded R₀ (48 bits)</h4>
            <MatrixTable matrix={toMatrix(expandedR, 8)} />
          </div>
        )}
      </div>

      <div className="step-row-grid">
        {isValidBits(K1Bits, 48) && (
          <div className="step-box">
            <h4>Round Key K₁ (48 bits)</h4>
            <MatrixTable matrix={toMatrix(K1Bits, 8)} />
          </div>
        )}
        {isValidBits(xorWithKey, 48) && (
          <div className="step-box">
            <h4>Expanded R₀ ⊕ K₁</h4>
            <MatrixTable matrix={toMatrix(xorWithKey, 8)} />
          </div>
        )}
      </div>

      <div className="step-row-grid">
        {isValidBits(sboxOutput, 32) && (
          <div className="step-box">
            <h4>S-Box Output (32 bits)</h4>
            <MatrixTable matrix={toMatrix(sboxOutput, 8)} />
          </div>
        )}
        {isValidBits(pboxOutput, 32) && (
          <div className="step-box">
            <h4>P-Box Permutation</h4>
            <MatrixTable matrix={toMatrix(pboxOutput, 8)} />
          </div>
        )}
      </div>

      <div className="step-row-grid">
        {isValidBits(R0Bits, 32) && (
          <div className="step-box">
            <h4>L₁ = R₀</h4>
            <MatrixTable matrix={toMatrix(R0Bits, 8)} />
          </div>
        )}
        {isValidBits(R1Bits, 32) && (
          <div className="step-box">
            <h4>R₁ = L₀ ⊕ f(R₀, K₁)</h4>
            <MatrixTable matrix={toMatrix(R1Bits, 8)} />
          </div>
        )}
      </div>

      <div className="legend-box" style={{ fontSize: '0.9rem', textAlign: 'center' }}>
        <span style={{ color: 'goldenrod' }}>f(R₀, K₁): Expansion → XOR → S-Box → P-Box</span> &nbsp;|&nbsp;
        <span style={{ color: 'green' }}>L₁ = R₀, R₁ = L₀ ⊕ f</span>
      </div>
    </motion.div>
  );
};

export default Step4Round1;
