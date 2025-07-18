//Step7FinalPermutation.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import MatrixTable from '../../../../components/MatrixTable';
import { finalPermutation, getPermutationCoordinateMap } from '../../../../shared/des/finalPermutation';

const Step7FinalPermutation = ({ preOutputBits, onCiphertextCalculated }) => {
  const cipherBits = preOutputBits && preOutputBits.length === 64 ? finalPermutation(preOutputBits) : null;
  
  // Call the callback with the calculated ciphertext
  useEffect(() => {
    if (onCiphertextCalculated && cipherBits) {
      onCiphertextCalculated(cipherBits);
    }
  }, [cipherBits, onCiphertextCalculated]);
  
  // Show message when data is missing
  if (!preOutputBits || preOutputBits.length !== 64) {
    return (
      <motion.div
        className="des-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="explanation-box">
          <p><strong>Step 7: Final Permutation (IP⁻¹)</strong></p>
          <ul>
            <li>The 64-bit preoutput block (R₁₆‖L₁₆) is permuted using the IP⁻¹ table</li>
            <li>This produces the final ciphertext block</li>
          </ul>
        </div>
        
        <div style={{ color: 'orange', padding: '1rem', background: '#fff3cd', borderRadius: '4px' }}>
          <strong>Note:</strong> This step requires the final L₁₆ and R₁₆ values from previous steps. 
          Please complete Steps 5-6 first to see the final permutation.
          <br />
          <small>PreOutput: {preOutputBits?.length || 0}/64 bits</small>
        </div>
      </motion.div>
    );
  }
  
  const coordMap = getPermutationCoordinateMap();

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
        <p><strong>Step 7: Final Permutation (IP⁻¹)</strong></p>
        <ul>
          <li>The 64-bit preoutput block (R₁₆‖L₁₆) is permuted using the IP⁻¹ table</li>
          <li>This produces the final ciphertext block</li>
        </ul>
        <p style={{ fontSize: '0.9em', color: '#666' }}>
          Hovering over a bit in either matrix shows its mapping using the permutation coordinate map.
        </p>
      </div>

      <div className="step-row-grid">
        <div className="step-box">
          <h4>PreOutput: R₁₆‖L₁₆</h4>
          <MatrixTable matrix={toMatrix(preOutputBits)} />
        </div>
        <div className="step-box">
          <h4>Final Ciphertext (after IP⁻¹)</h4>
          <MatrixTable matrix={toMatrix(cipherBits)} />
        </div>
      </div>

      {/* Debug info - remove in production */}
      <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem', padding: '0.5rem', background: '#f5f5f5', borderRadius: '4px' }}>
        <strong>Debug:</strong> PreOutput length: {preOutputBits?.length || 'N/A'} bits. 
        Ciphertext length: {cipherBits?.length || 'N/A'} bits.
      </div>
    </motion.div>
  );
};

export default Step7FinalPermutation;