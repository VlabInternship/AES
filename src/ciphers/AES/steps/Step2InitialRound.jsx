import React, { useState } from "react";
import MatrixTable from "../../../components/MatrixTable";
import { addRoundKey } from "../../../shared/aes/addRoundKey";

const Step2InitialRound = ({ inputMatrix, roundKey0 }) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const resultMatrix = addRoundKey(inputMatrix, roundKey0);
  const highlightMap = {};
  const tooltipMap = {};

  inputMatrix.forEach((row, i) => {
    row.forEach((val, j) => {
      const key = `${i}-${j}`;
      const inputVal = val;
      const keyVal = roundKey0[i][j];
      const resultVal = resultMatrix[i][j];

      highlightMap[key] = 'result';
      tooltipMap[key] = `${inputVal.toUpperCase()} ⊕ ${keyVal.toUpperCase()} = ${resultVal.toUpperCase()}`;
    });
  });

  return (
    <div>
      <h3>Step 2: Round 0 — Initial AddRoundKey</h3>

      <div style={{ marginBottom: "1.5rem" }}>
        <h4>Input State (Before AddRoundKey):</h4>
        <MatrixTable matrix={inputMatrix} />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <h4>Round Key [0]:</h4>
        <MatrixTable matrix={roundKey0} />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <h4>State After AddRoundKey (Input ⊕ RoundKey[0]):</h4>
        <MatrixTable
          matrix={resultMatrix}
          highlightMap={highlightMap}
          tooltipMap={tooltipMap}
        />
      </div>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        <input
          type="checkbox"
          checked={showExplanation}
          onChange={() => setShowExplanation((prev) => !prev)}
        />{" "}
        Show Detailed Explanation
      </label>

      {showExplanation && (
        <div className="explanation-box">
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <div key={`${row}-${col}`}>
                state[{row}][{col}] = {inputMatrix[row][col].toUpperCase()} ⊕{" "}
                {roundKey0[row][col].toUpperCase()} ={" "}
                {resultMatrix[row][col].toUpperCase()}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Step2InitialRound;
