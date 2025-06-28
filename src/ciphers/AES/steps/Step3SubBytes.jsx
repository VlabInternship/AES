import React, { useState } from 'react';
import MatrixTable from '../../../components/MatrixTable';
import { SBOX, SBOX_INDEXED } from '../../../shared/aes/constants';
import { subBytes } from '../../../shared/aes/subBytes';

const Step3SubBytes = ({ inputMatrix }) => {
  const [hoveredKey, setHoveredKey] = useState(null);
  const resultMatrix = subBytes(inputMatrix);
  const tooltipMap = {};
  const highlightMap = {};

  inputMatrix.forEach((row, i) => {
    row.forEach((byte, j) => {
      const val = parseInt(byte, 16);
      const substituted = SBOX[val] ?? 0x00;
      const key = `${i}-${j}`;
      const resultVal = substituted.toString(16).toUpperCase().padStart(2, '0');
      tooltipMap[key] = `0x${byte.toUpperCase()} ⟶ S-Box[0x${byte.toUpperCase()}] = 0x${resultVal}`;
    });
  });

  const formattedResultMatrix = resultMatrix.map(row =>
    row.map(cell => cell.toUpperCase().padStart(2, '0'))
  );

  // Get highlighted S-Box cell from hovered key
  let sboxRow = null;
  let sboxCol = null;
  if (hoveredKey) {
    const [i, j] = hoveredKey.split('-').map(Number);
    const byte = inputMatrix[i][j];
    const val = parseInt(byte, 16);
    sboxRow = (val >> 4) + 1;
    sboxCol = (val & 0x0f) + 1;
  }

return(
  <div>
  <h3>Step 3: Round 1 - SubBytes</h3>

  <div className="subbytes-grid">
    <div>
      <h4>State Before SubBytes (from Step 2):</h4>
      <MatrixTable matrix={inputMatrix} />
    </div>

    <div>
      <h4>State After SubBytes:</h4>
      <MatrixTable
        matrix={formattedResultMatrix}
        tooltipMap={tooltipMap}
        onCellHover={(key) => setHoveredKey(key)}
      />
    </div>
  </div>

  <div className="sbox-scroll-wrapper">
    <h4>Substitution Box (S-Box)</h4>
    <p className="sbox-subtitle">
      Highlighted cell shows the mapping for the currently hovered byte
    </p>
    <table className="sbox-table">
      <tbody>
        {SBOX_INDEXED.map((rowArr, i) => (
          <tr key={i}>
            {rowArr.map((cell, j) => {
              const isHeader = i === 0 || j === 0;
              const isMatch = i === sboxRow && j === sboxCol;

              return (
                <td
                  key={j}
                  className={`${isHeader ? 'header' : ''} ${isMatch ? 'highlight' : ''}`}
                >
                  {cell}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {hoveredKey && (
    <div className="explanation-box">
      {tooltipMap[hoveredKey]}
    </div>
  )}
</div>
)
};

export default Step3SubBytes;
