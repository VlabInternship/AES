// src/ciphers/AES/steps/Step3AddRoundKeyDecrypt.jsx
import React, { useState, useEffect } from "react";
import MatrixTable from "../../../../components/MatrixTable";
import { addRoundKey } from "../../../../shared/aes/addRoundKey";
import { AnimatePresence } from "framer-motion";

const Step3AddRoundKeyDecrypt = ({ inputMatrix, roundKey, round = 10, onOutput }) => {
  const [hoveredKey, setHoveredKey] = useState(null);
  const [resultMatrix, setResultMatrix] = useState([]);
  

  useEffect(() => {
    if (inputMatrix?.length === 4 && roundKey?.length === 4) {
      const result = addRoundKey(inputMatrix, roundKey);
      setResultMatrix(result);
      if (typeof onOutput === 'function') {
        onOutput(result); // ✅ emit result to parent
      }
    }
  }, [inputMatrix, roundKey, onOutput]);

  const tooltipMap = {};
  if (inputMatrix?.length === 4 && roundKey?.length === 4 && resultMatrix.length === 4) {
    inputMatrix.forEach((row, i) => {
      row.forEach((val, j) => {
        const stateVal = val.toUpperCase();
        const keyVal = roundKey[i][j].toUpperCase();
        const resultVal = resultMatrix[i][j].toUpperCase();
        const key = `${i}-${j}`;
        tooltipMap[key] = `0x${stateVal} ⊕ 0x${keyVal} = 0x${resultVal}`;
      });
    });
  }

  return (
    <div className="aes-container">
      <AnimatePresence mode="wait">
        <>
          <div className="step-row-grid">
            <div className="step-box">
              <h4 className="title">Input State (Before)</h4>
              <MatrixTable matrix={inputMatrix} />
            </div>
            <div className="step-box">
              <h4>RoundKey [{round}]:</h4>
              <MatrixTable matrix={roundKey} />
            </div>
          </div>

          <div className="xor-wrapper">
            <div className="xor-circle">⊕</div>
          </div>

          <div className="step-row-grid">
            <div className="step-box">
              <h4>State After AddRoundKey (Input ⊕ RoundKey[{round}]):</h4>
              <MatrixTable
                matrix={resultMatrix}
                tooltipMap={tooltipMap}
                onCellHover={(k) => setHoveredKey(k)}
              />
            </div>
          </div>

          {hoveredKey && (
            <div className="explanation-box">
              {tooltipMap[hoveredKey]}
            </div>
          )}
        </>
      </AnimatePresence>
    </div>
  );
};

export default Step3AddRoundKeyDecrypt;
