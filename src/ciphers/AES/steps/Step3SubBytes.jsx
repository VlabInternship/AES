// src/ciphers/AES/steps/Step3SubBytes.jsx
import React, { useState } from 'react';
import MatrixTable from '../../../components/MatrixTable';
import { SBOX } from '../../../shared/aes/constants';
import { subBytes } from '../../../shared/aes/subBytes';

const Step3SubBytes = ({ inputMatrix }) => {
  const [hoveredKey, setHoveredKey] = useState(null);

  // Step 3 transformation
  const resultMatrix = subBytes(inputMatrix);

  // Tooltip map only for result (right side)
  const tooltipMap = {};
  inputMatrix.forEach((row, i) => {
    row.forEach((byte, j) => {
      const val = parseInt(byte, 16);
      const substituted = SBOX[val] ?? 0x00;
      const key = `${i}-${j}`;
      tooltipMap[key] = `0x${byte.toUpperCase()} ⟶ S-Box[0x${byte.toUpperCase()}] = 0x${substituted.toString(16).toUpperCase().padStart(2, '0')}`;
    });
  });

  return (
    <div>
      <h3>Step 2: Round 1 - Subbytes </h3>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div>
          <h4>State After AddRoundKey (from Step 2):</h4>
          <MatrixTable matrix={inputMatrix} />
        </div>

        <div>
          <h4>State After SubBytes:</h4>
          <MatrixTable
            matrix={resultMatrix}
            tooltipMap={tooltipMap}
            onCellHover={(key) => setHoveredKey(key)}
          />
        </div>
      </div>

      {hoveredKey && (
        <div className="explanation-box" style={{ marginTop: '1rem' }}>
          {tooltipMap[hoveredKey]}
        </div>
      )}
    </div>
  );
};

export default Step3SubBytes;
