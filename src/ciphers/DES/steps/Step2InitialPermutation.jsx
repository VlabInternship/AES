import React, { useState } from 'react';
import MatrixTable from '../../../components/MatrixTable';
import { motion } from 'framer-motion';
import { getPermutationCoordinateMap } from '../../../shared/des/initialPermutation';

const Step2InitialPermutation = ({ inputBits, permutedBits }) => {
  const bits = inputBits?.split('') || [];
  const permuted = permutedBits?.split('') || [];

  const toMatrix = (bitArray) =>
    Array.from({ length: 8 }, (_, i) => bitArray.slice(i * 8, i * 8 + 8));

  const [hoveredKey, setHoveredKey] = useState(null);

  
  const coordMap = getPermutationCoordinateMap();

  const sourceHighlightMap = {};
const resultHighlightMap = {};

if (hoveredKey && coordMap[hoveredKey] !== undefined) {
  sourceHighlightMap[hoveredKey] = 'source';
  resultHighlightMap[coordMap[hoveredKey]] = 'result';
}
  
  if (hoveredKey) {
  console.log("Hovered:", hoveredKey);
  console.log("Maps to:", coordMap[hoveredKey]);
}

  return (
    <motion.div
      className="des-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h3>Step 2: Initial Permutation (IP)</h3>

      <div className="step-row-grid">
        <div className="step-box">
          <h4>Original Plaintext (64 bits)</h4>
          <MatrixTable
  matrix={toMatrix(bits)}
  highlightMap={sourceHighlightMap}
  hoveredCell={hoveredKey}
  onCellHover={setHoveredKey}
/>
          
        </div>
        <div className="step-box">
          <h4>Permuted Plaintext (After Initial Permutation)</h4>
          <MatrixTable
  matrix={toMatrix(permuted)}
  highlightMap={resultHighlightMap}
  hoveredCell={null}
  onCellHover={() => {}}
/>
        </div>
      </div>

      <div className="explanation-box">
        <p className="text-sm">
          Hover a bit in the original plaintext matrix to see where it moves in the permuted matrix.<br />
          Yellow = original bit, Green = its final position after Initial Permutation.
        </p>
      </div>
    </motion.div>
  );
  
};

export default Step2InitialPermutation;
