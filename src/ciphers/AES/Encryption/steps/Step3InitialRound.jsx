// src/ciphers/AES/steps/Step3InitialRound.jsx
import React, { useState } from "react";
import MatrixTable from "../../../../components/MatrixTable";
import { addRoundKey } from "../../../../shared/aes/addRoundKey";
import { AnimatePresence } from "framer-motion";

const Step3InitialRound = ({ inputMatrix, roundKey, round }) => {
  const [hoveredKey, setHoveredKey] = useState(null);
  const resultMatrix = addRoundKey(inputMatrix, roundKey);
  const tooltipMap = {};

  inputMatrix.forEach((row, i) => {
    row.forEach((val, j) => {
      const stateVal = val.toUpperCase();
      const keyVal = roundKey[i][j].toUpperCase();
      const resultVal = resultMatrix[i][j].toUpperCase();
      const key = `${i}-${j}`;
      tooltipMap[key] = `0x${stateVal} ⊕ 0x${keyVal} = 0x${resultVal}`;
    });
  });

  return (
    <div className="aes-container">
      <AnimatePresence mode="wait">
        <>
          <div className="step-row-grid">
            <div className="step-box">
              <h4 className="title">Input State (Before)</h4>
              <div>
                <MatrixTable matrix={inputMatrix} />
              </div>
            </div>
            <div className="step-box">
              <h4>RoundKey [{round}]:</h4>
              <MatrixTable matrix={roundKey} />
            </div>
          </div>
          <div className="xor-wrapper">                 
            <div className="xor-circle">
              ⊕
            </div>
          </div>

          <div className="step-row-grid">
            <div className="step-box">
              <h4>State After AddRoundKey (Input ⊕ RoundKey[{round}]):</h4>
              <MatrixTable matrix={resultMatrix} tooltipMap={tooltipMap} onCellHover={(k) => setHoveredKey(k)} />
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

export default Step3InitialRound;
