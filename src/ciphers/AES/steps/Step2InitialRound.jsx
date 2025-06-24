// src/ciphers/AES/steps/Step2InitialRound.jsx
import React, { useState } from "react";
import MatrixTable from "../../../components/MatrixTable";
import { addRoundKey } from "../../../shared/aes/addRoundKey";

const Step2InitialRound = ({ inputMatrix, roundKey0 }) => {
  const [hoveredKey, setHoveredKey] = useState(null);

  const resultMatrix = addRoundKey(inputMatrix, roundKey0);
  const tooltipMap = {};

  inputMatrix.forEach((row, i) => {
    row.forEach((val, j) => {
      const stateVal = val.toUpperCase();
      const keyVal = roundKey0[i][j].toUpperCase();
      const resultVal = resultMatrix[i][j].toUpperCase();
      const key = `${i}-${j}`;
      tooltipMap[key] = `0x${stateVal} ⊕ 0x${keyVal} = 0x${resultVal}`;
    });
  });

  return (
    <div>
      <h3>Step 2: Intial Round - AddRoundKey</h3>

      <div style={{ marginBottom: "1.5rem" }}>
        <h4>Input State (Before AddRoundKey):</h4>
        <MatrixTable matrix={inputMatrix} />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <h4>Round Key [0]:</h4>
        <MatrixTable matrix={roundKey0} />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <h4>State After AddRoundKey:</h4>
        <MatrixTable
          matrix={resultMatrix}
          tooltipMap={tooltipMap}
          onCellHover={(key) => setHoveredKey(key)}
        />
      </div>

      {hoveredKey && (
        <div className="explanation-box" style={{ marginTop: '1rem' }}>
          {tooltipMap[hoveredKey]}
        </div>
      )}
    </div>
  );
};

export default Step2InitialRound;
