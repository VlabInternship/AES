// src/ciphers/AES/steps/Step6AddRoundKey.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatrixTable from '../../../components/MatrixTable';
import { addRoundKey } from '../../../shared/aes/addRoundKey';

const Step6AddRoundKey = ({ inputMatrix, roundKey }) => {
  const [hoveredKey, setHoveredKey] = useState(null);
  const outputMatrix = addRoundKey(inputMatrix, roundKey);
  const tooltipMap = {};

  inputMatrix.forEach((row, i) => {
    row.forEach((val, j) => {
      const stateVal = val?.toUpperCase?.() || '--';
      const keyVal = roundKey[i]?.[j]?.toUpperCase?.() || '--';
      const resultVal = outputMatrix[i]?.[j]?.toUpperCase?.() || '--';
      const key = `${i}-${j}`;
      tooltipMap[key] = `0x${stateVal} ⊕ 0x${keyVal} = 0x${resultVal}`;
    });
  });

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key="step6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="step2-layout"
        >
          {/* Top: Input and Key */}
          <div className="step2-top-row">
            <div>
              <h4>Input State (Before):</h4>
              <MatrixTable matrix={inputMatrix} />
            </div>
            <div>
              <h4>RoundKey [1]:</h4>
              <MatrixTable matrix={roundKey} />
            </div>
          </div>

          <div className="step2-center">
            <div className="xor-circle">⊕</div>
          </div>

          {/* Bottom: Output */}
          <div className="step2-bottom">
            <h4>State After AddRoundKey (Input ⊕ RoundKey[1]):</h4>
            <MatrixTable
              matrix={outputMatrix}
              tooltipMap={tooltipMap}
              hoveredCell={hoveredKey}
              onCellHover={setHoveredKey}
            />
          </div>

          {hoveredKey && (
            <div className="explanation-box">{tooltipMap[hoveredKey]}</div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Step6AddRoundKey;
