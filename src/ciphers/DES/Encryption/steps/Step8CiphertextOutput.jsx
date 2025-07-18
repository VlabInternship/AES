//Step8CiphertextOutput.jsx
import React from 'react';
import { motion } from 'framer-motion';
import MatrixTable from '../../../../components/MatrixTable';

const Step8CiphertextOutput = ({ inputBits, cipherBits, keyBits, asciiOutput }) => {
  const toMatrix = (bits) =>
    Array.from({ length: 8 }, (_, i) => bits.slice(i * 8, i * 8 + 8).split(''));

  return (
    <motion.div
      className="des-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="explanation-box">
        <p><strong>Step 8: Ciphertext Output</strong></p>
        <ul>
          <li>This is the result of the final permutation (IP⁻¹) after all 16 DES rounds.</li>
          <li>The output is the 64-bit DES ciphertext ready for transmission or storage.</li>
        </ul>
      </div>

      <div className="step-row-grid">
        {inputBits && (
          <div className="step-box">
            <h4>Padded Input (64 bits)</h4>
            <MatrixTable matrix={toMatrix(inputBits)} />
          </div>
        )}
        {keyBits && (
          <div className="step-box">
            <h4>Padded Key (64 bits)</h4>
            <MatrixTable matrix={toMatrix(keyBits)} />
          </div>
        )}
        {cipherBits && (
          <div className="step-box">
            <h4>Ciphertext Matrix (64 bits)</h4>
            <MatrixTable matrix={toMatrix(cipherBits)} />
          </div>
        )}
      </div>

      {asciiOutput && (
        <div className="step-row-grid">
          <div className="step-box">
            <h4>Ciphertext (ASCII)</h4>
            <p className="ascii-output">{asciiOutput}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Step8CiphertextOutput;
