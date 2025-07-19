// src/ciphers/DES/steps/Step1InputPreparation.jsx
import React, { useState } from 'react';
import MatrixTable from '../../../../components/MatrixTable';
import { motion } from 'framer-motion';

const Step1InputPreparation = ({ inputMatrix, keyMatrix }) => {
  // Hover state for plaintext matrix
  const [hoveredKey, setHoveredKey] = useState(null);

  // Highlight map for ciphertext and L0/R0
  const highlightMap = {};
  const l0HighlightMap = {};
  const r0HighlightMap = {};
  
  if (hoveredKey) {
    const [row, col] = hoveredKey.split('-').map(Number);
    // Highlight hovered bit in ciphertext as yellow (source)
    highlightMap[hoveredKey] = 'source';
    
    if (row < 4) {
      // L0: highlight corresponding bit in L0 as green (result)
      l0HighlightMap[`${row}-${col}`] = 'result';
    } else {
      // R0: highlight corresponding bit in R0 as green (result)
      r0HighlightMap[`${row-4}-${col}`] = 'result';
    }
  }

  return (
    <motion.div
      className="des-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="step-row-grid">
        <div className="step-box">
          <h4 className="title">Ciphertext (64-bit Binary)</h4>
          <MatrixTable
            matrix={inputMatrix}
            highlightMap={highlightMap}
            hoveredCell={hoveredKey}
            onCellHover={setHoveredKey}
          />
        </div>
        <div className="step-box">
          <h4 className="title">Key (64-bit Binary)</h4>
          <MatrixTable
            matrix={keyMatrix}
            highlightMap={{ __parity__: true }}
          />
        </div>
      </div>
      {/* L0 and R0 section */}
      <div className="step-row-grid">
        <div className="step-box">
          <h4>L₀ (Left 32 bits)</h4>
          <MatrixTable
            matrix={inputMatrix.slice(0, 4).map(row => row.slice(0, 8))}
            highlightMap={l0HighlightMap}
          />
        </div>
        <div className="step-box">
          <h4>R₀ (Right 32 bits)</h4>
          <MatrixTable
            matrix={inputMatrix.slice(4, 8).map(row => row.slice(0, 8))}
            highlightMap={r0HighlightMap}
          />
        </div>
      </div>
      <div className="legend-box" style={{ fontSize: '0.9rem', textAlign: 'center' }}>
        <span style={{ color: 'goldenrod' }}>🟨 Yellow = Hovered Bit in Ciphertext</span> &nbsp;|&nbsp;
        <span style={{ color: 'green' }}>🟩 Green = Corresponding Bit in L₀ or R₀</span> &nbsp;|&nbsp;
        <span>🔴 Red = Parity Bit (not used in encryption)</span>
      </div>
      <div className="explanation-box">
        <p>
          The ASCII ciphertext and key are converted into 64-bit binary, split into 8×8 matrices.
          These raw bits are what DES actually works with in all following steps.<br/>
          <strong>Hover over any bit in the ciphertext matrix to see if it belongs to L₀ or R₀.</strong>
        </p>
      </div>
    </motion.div>
  );
};

export default Step1InputPreparation;
