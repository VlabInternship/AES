import React from 'react';
import MatrixTable from '../../../components/MatrixTable';
import { motion } from 'framer-motion';

const Step3SplitL0R0 = ({ permutedBits }) => {
  const bits = permutedBits?.split('') || [];

  const L0 = bits.slice(0, 32);
  const R0 = bits.slice(32, 64);

  const toMatrix = (bitArray) =>
    Array.from({ length: 4 }, (_, i) => bitArray.slice(i * 8, i * 8 + 8));

  return (
    <motion.div
      className="des-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h3>Step 3: Split into L₀ and R₀</h3>

      <div className="step-row-grid">
        <div className="step-box">
          <h4>L₀ (Left 32 bits)</h4>
          <MatrixTable matrix={toMatrix(L0)} />
        </div>
        <div className="step-box">
          <h4>R₀ (Right 32 bits)</h4>
          <MatrixTable matrix={toMatrix(R0)} />
        </div>
      </div>

      <div className="explanation-box">
        <p className="text-sm">
          After the Initial Permutation, the 64-bit block is divided into two 32-bit halves:
          L₀ and R₀. These will be used in the 16 DES rounds.
        </p>
      </div>
    </motion.div>
  );
};

export default Step3SplitL0R0;
