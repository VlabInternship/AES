import React, { useState } from 'react';
import MatrixTable from '../../../components/MatrixTable';
import { shiftRows } from '../../../shared/aes/shiftRows';
import { motion, AnimatePresence } from 'framer-motion';

const Step4ShiftRows = ({ inputMatrix }) => {
  const [hoveredKey, setHoveredKey] = useState(null);
  const resultMatrix = shiftRows(inputMatrix);

  const tooltipMap = {};
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (row === 0) {
        tooltipMap[`${row}-${col}`] = 'Row 0 is unchanged';
      } else {
        const originalCol = (col + row) % 4;
        tooltipMap[`${row}-${col}`] =
          `Row ${row} shifted left by ${row} ⇒ [${row}][${originalCol}] → [${row}][${col}]`;
      }
    }
  }

  const rowLabels = ['Row 0 (no shift)', 'Row 1 (←1)', 'Row 2 (←2)', 'Row 3 (←3)'];

  return (
    <div>



      <AnimatePresence mode='wait'>
        <motion.div
          className="step4-grid"
          key="step4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <div className="step4-box">
            <h4 className="title">State Before ShiftRows:</h4>
            <MatrixTable matrix={inputMatrix} />
          </div>
          <div className="explanation-box">
            {inputMatrix.map((_, row) => (
              <div className="step4-row" key={row}>
                <div>
                  <h4>{rowLabels[row]}</h4>
                  <table><tbody><tr>
                    {inputMatrix[row].map((val, col) => (
                      <td key={col}>{val.toUpperCase()}</td>
                    ))}
                  </tr></tbody></table>
                </div>
                <div className="arrow">→</div>
                <div className="motion-table">
                  <table><tbody><tr>
                    {resultMatrix[row].map((val, col) => {
                      const key = `${row}-${col}`;
                      return (
                        <motion.td
                          key={col}
                          initial={{ x: -40 * row, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.4 + row * 0.1 }}
                          style={{
                            position: 'relative',
                            cursor: tooltipMap[key] ? 'help' : 'default',
                            backgroundColor: 'var(--background-light)',
                            fontFamily: 'var(--font-mono)',
                            padding: '10px',
                            minWidth: '40px',
                            textAlign: 'center'
                          }}
                          onMouseEnter={() => setHoveredKey(key)}
                          onMouseLeave={() => setHoveredKey(null)}
                        >
                          {val.toUpperCase()}
                        </motion.td>
                      );
                    })}
                  </tr></tbody></table>
                </div>
              </div>
            ))}

            {hoveredKey && (
              <div className="explanation-box">
                {tooltipMap[hoveredKey]}
              </div>
            )}
            </div>
            <div className="step4-box">
            <h4 className="title">State After ShiftRows:</h4>
            <MatrixTable matrix={resultMatrix} />
          </div>
          </motion.div>
      </AnimatePresence>
    </div>

  );
};

export default Step4ShiftRows;
