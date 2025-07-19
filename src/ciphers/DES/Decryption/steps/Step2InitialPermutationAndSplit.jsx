import React, { useState } from 'react';
import MatrixTable from '../../../../components/MatrixTable';
import { motion } from 'framer-motion';
import { getPermutationCoordinateMap } from '../../../../shared/des/initialPermutation';

const Step2InitialPermutationAndSplit = ({ inputBits, permutedBits }) => {
  const bits = inputBits?.split('') || [];
  const permuted = permutedBits?.split('') || [];

  const L0 = permuted.slice(0, 32);
  const R0 = permuted.slice(32, 64);

  const toMatrix = (bitArray) =>
    Array.from({ length: 8 }, (_, i) => bitArray.slice(i * 8, i * 8 + 8));

  const toMatrix4x8 = (bitArray) =>
    Array.from({ length: 4 }, (_, i) => bitArray.slice(i * 8, i * 8 + 8));

  const [hoveredKey, setHoveredKey] = useState(null);

  const coordMap = getPermutationCoordinateMap();

  const sourceHighlightMap = {};
  const resultHighlightMap = {};
  const l0HighlightMap = {};
  const r0HighlightMap = {};

  if (hoveredKey && coordMap[hoveredKey] !== undefined) {
    sourceHighlightMap[hoveredKey] = 'source';
    resultHighlightMap[coordMap[hoveredKey]] = 'result';

    // Calculate which half the permuted bit belongs to
    const permutedIndex = coordMap[hoveredKey];

    if (permutedIndex < 32) {
      // Bit goes to L₀
      const permutedRow = Math.floor(permutedIndex / 8);
      const permutedCol = permutedIndex % 8;
      l0HighlightMap[`${permutedRow}-${permutedCol}`] = 'result';
    } else {
      // Bit goes to R₀
      const r0Index = permutedIndex - 32;
      const r0Row = Math.floor(r0Index / 8);
      const r0Col = r0Index % 8;
      r0HighlightMap[`${r0Row}-${r0Col}`] = 'result';
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

      <div className="explanation-box">
        <p>
          <strong>Initial Permutation (IP):</strong> The 64-bit ciphertext block is permuted according to the IP table.
          This rearranges the bits to prepare them for the Feistel network.
        </p>
        <p>
          <strong>Split into Halves:</strong> After permutation, the 64-bit block is divided into two 32-bit halves:
          L₀ (left half) and R₀ (right half). These will be processed separately in the 16 DES rounds.
        </p>
        <p style={{ fontSize: '0.9em', color: '#666' }}>
          <strong>Hover over any bit in the original ciphertext to see:</strong>
          <br />
          • Where it moves in the permuted matrix (green highlight)
          <br />
          • Which half (L₀ or R₀) it belongs to (green highlight)
        </p>
      </div>

      {/* Initial Permutation Section */}
      <div className="step-row-grid">
        <div className="step-box">
          <h4 className="title">Original Ciphertext (64 bits)</h4>
          <MatrixTable
            matrix={toMatrix(bits)}
            highlightMap={sourceHighlightMap}
            hoveredCell={hoveredKey}
            onCellHover={setHoveredKey}
          />
        </div>
        <div className="step-box">
          <h4 className="title">After Initial Permutation (64 bits)</h4>
          <MatrixTable
            matrix={toMatrix(permuted)}
            highlightMap={resultHighlightMap}
            hoveredCell={null}
            onCellHover={() => { }}
          />
        </div>
      </div>
      <div className="legend-box" style={{ fontSize: '0.9rem', textAlign: 'center' }}>
        <span style={{ color: 'goldenrod' }}>🟨 Yellow = Hovered bit in original ciphertext</span> &nbsp;|&nbsp;
        <span style={{ color: 'green' }}>🟩 Green = Corresponding bit after permutation and in L₀/R₀</span>
      </div>
      {/* Split into L₀ and R₀ Section */}
      <div className="step-row-grid">
        <div className="step-box">
          <h4 className="title">L₀ (Left 32 bits)</h4>
          <MatrixTable
            matrix={toMatrix4x8(L0)}
            highlightMap={l0HighlightMap}
          />
        </div>
        <div className="step-box">
          <h4 className="title">R₀ (Right 32 bits)</h4>
          <MatrixTable
            matrix={toMatrix4x8(R0)}
            highlightMap={r0HighlightMap}
          />
        </div>
      </div>


    </motion.div>
  );
};

export default Step2InitialPermutationAndSplit; 