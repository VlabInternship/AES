import React, { useState } from 'react';
import MatrixTable from '../../../../components/MatrixTable';
import { invShiftRows } from '../../../../shared/aes/invShiftRows';
import { motion, AnimatePresence } from 'framer-motion';

const Step4InvShiftRows = ({ inputMatrix }) => {
  const [hoveredKey, setHoveredKey] = useState(null);
  const resultMatrix = invShiftRows(inputMatrix);

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
  const shiftedRowLabels = ['Row 0 ', 'Row 1 ', 'Row 2', 'Row 3 ']

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          className="step-row-grid"
          key="step5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <div className="step-box">
            <h4 className="title">State Before ShiftRows:</h4>
            <MatrixTable matrix={inputMatrix} />
          </div>

          <div className="step-box">
            <h4 className="title">State After ShiftRows:</h4>
            <MatrixTable
              tooltipMap={tooltipMap}

              matrix={resultMatrix}
              onCellHover={setHoveredKey}
            />
          </div>
        </motion.div>
        <motion.div key="step5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <div className="step-box">
            <h4 className="title">Row-wise Shifts:</h4>
            {hoveredKey && (
            <div className="explanation-box">
              {tooltipMap[hoveredKey]}
            </div>
          )}
            {inputMatrix.map((_, row) => (
              <div className="step4-row" key={row} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h5>{rowLabels[row]}</h5>
                  <table><tbody><tr>
                    {inputMatrix[row].map((val, col) => (
                      <td key={col}>{val.toUpperCase()}</td>
                    ))}
                  </tr></tbody></table>
                </div>
                <div className="arrow" style={{ margin: '0 10px' }}>→</div>
                <div>
                  <table><tbody><h5>{shiftedRowLabels[row]}</h5>
                    <tr>
                      {resultMatrix[row].map((val, col) => {
                        const key = `${row}-${col}`;
                        return (
                          <motion.td
                            key ={col}
                            initial={{ x: -40 * row, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4 + row * 0.1 }}
                            style={{
                              position: 'relative',
                              backgroundColor: 'var(--background-light)',
                              fontFamily: 'var(--font-mono)',
                              padding: '10px',
                              minWidth: '40px',
                              textAlign: 'center'
                            }}

                          >
                            {val.toUpperCase()}
                          </motion.td>
                        );
                      })}
                    </tr></tbody></table>
                </div>
              </div>
            ))}
          </div>
          
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Step4InvShiftRows;
