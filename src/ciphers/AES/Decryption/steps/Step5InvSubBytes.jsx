import React, { useState } from 'react';
import MatrixTable from '../../../../components/MatrixTable';
import { invSubBytes } from '../../../../shared/aes/invSubBytes';
import { INV_SBOX, INV_SBOX_INDEXED } from '../../../../shared/aes/constants';

const Step5InvSubBytes = ({ inputMatrix }) => {
  const [hoveredKey, setHoveredKey] = useState(null);
  const [pinnedKey, setPinnedKey] = useState(null);

  const resultMatrix = invSubBytes(inputMatrix);
  const tooltipMap = {};
  const highlightMap = {};

  const usedSubValues = new Set();

  inputMatrix.forEach((row, i) => {
    row.forEach((byte, j) => {
      const val = parseInt(byte, 16);
      const substituted = INV_SBOX[val] ?? 0x00;
      usedSubValues.add(substituted.toString(16).toUpperCase().padStart(2, '0'));

      const key = `${i}-${j}`;
      const resultVal = substituted.toString(16).toUpperCase().padStart(2, '0');
      tooltipMap[key] = `0x${byte.toUpperCase()} ⟶ S-Box[0x${byte.toUpperCase()}] = 0x${resultVal}`;
      highlightMap[key] = 'source';
    });
  });

  const formattedResultMatrix = resultMatrix.map((row, i) =>
    row.map((cell, j) => {
      const key = `${i}-${j}`;
      highlightMap[key] = 'result';
      return cell.toUpperCase().padStart(2, '0');
    })
  );

  const activeKey = hoveredKey || pinnedKey;

  let highlightVal = null;
  if (activeKey) {
    const [i, j] = activeKey.split('-').map(Number);
    const byte = inputMatrix[i][j];
    const val = parseInt(byte, 16);
    const substituted = INV_SBOX[val];
    highlightVal = substituted?.toString(16).toUpperCase().padStart(2, '0');
  }

  return (
    <div>
      <p className="explanation-box">
        <strong>Each byte in the state matrix is substituted using Rijndael's S-Box. The high nibble
        of the byte selects the row and the low nibble selects the column in the S-Box table.</strong>
      </p>

      <div className="step-row-grid">
        <div className="step-box" style={{ width: '400px' }}>
          <h4>State Before SubBytes (from Step 2):</h4>
          <MatrixTable
            matrix={inputMatrix}
            onCellHover={setHoveredKey}
          />
        </div>

        <div className="step-box" style={{ width: '400px' }}>
          <h4>State After SubBytes:</h4>
          <MatrixTable
            matrix={formattedResultMatrix}
            tooltipMap={tooltipMap}
            onCellHover={(key) => {
              setHoveredKey(key);
            }}
            onClick={(key) => setPinnedKey(pinnedKey === key ? null : key)}
          />
        </div>
      </div>

      {activeKey && (
        <div className="explanation-box">
          <strong>Explanation:</strong> <br />
          {tooltipMap[activeKey]}
        </div>
      )}

      <div className="sbox-scroll-wrapper">
        <h4>Substitution Box (S-Box)</h4>
        <p className="sbox-subtitle">
          🟨 Yellow = Used Substitution Value,&nbsp;
          🟩 Green = Currently Hovered Substitution Value
        </p>

        <table className="sbox-table">
          <tbody>
            {INV_SBOX_INDEXED.map((rowArr, i) => (
              <tr key={i}>
                {rowArr.map((cell, j) => {
                  const isHeader = i === 0 || j === 0;
                  const cellVal = cell.toUpperCase();

                  const isUsed = usedSubValues.has(cellVal);
                  const isActive = highlightVal === cellVal;

                  let backgroundColor = 'white';
                  if (isUsed) backgroundColor = '#fff3a3'; // yellow default
                  if (isActive) backgroundColor = '#c1f0c1'; // green overrides yellow

                  return (
                    <td
                      key={j}
                      style={{
                        backgroundColor: isHeader ? '#eee' : backgroundColor,
                        fontWeight: isActive ? 'bold' : 'normal',
                        textAlign: 'center',
                        padding: '6px',
                        border: '1px solid #ccc',
                        minWidth: '28px',
                        fontFamily: 'monospace'
                      }}
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
    </div>
  );
};

export default Step5InvSubBytes;
