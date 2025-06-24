// src/ciphers/AES/steps/Step4ShiftRows.jsx
import React, { useState } from 'react';
import MatrixTable from '../../../components/MatrixTable';
import { shiftRows } from '../../../shared/aes/shiftRows';

const Step4ShiftRows = ({ inputMatrix }) => {
  const [hoveredKey, setHoveredKey] = useState(null);
  const resultMatrix = shiftRows(inputMatrix);

  const tooltipMap = {};

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      let originalCol;

      if (row === 0) {
        tooltipMap[`${row}-${col}`] = 'Row 0 is unchanged';
        continue;
      }

      // Reverse shift to find where the value came from
      originalCol = (col + row) % 4;
      tooltipMap[`${row}-${col}`] =
        `Row ${row} shifted left by ${row} ⇒ [${row}][${originalCol}] → [${row}][${col}]`;
    }
  }

  return (
    <div>
      <h3>Step 4: Round 1 - ShiftRows</h3>
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div>
          <h4>State Before ShiftRows:</h4>
          <MatrixTable matrix={inputMatrix} />
        </div>
        <div>
          <h4>State After ShiftRows:</h4>
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

export default Step4ShiftRows;
