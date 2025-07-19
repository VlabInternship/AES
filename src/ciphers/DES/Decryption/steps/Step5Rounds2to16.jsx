// src/ciphers/DES/steps/Step5Rounds2to16.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MatrixTable from '../../../../components/MatrixTable';
import { expandR0, xor48, applySBoxes, pboxPermute } from '../../../../shared/des/round1';

// Helper function for XOR operations of any length
const xorBits = (a, b) => {
  if (!a || !b || a.length !== b.length) {
    console.error('XOR: Invalid inputs', { a: a?.length, b: b?.length });
    return '';
  }
  return a.split('').map((bit, i) => bit ^ b[i]).join('');
};

const Step5Rounds2to16 = ({ L0Bits, R0Bits, roundKeys, onFinalValuesCalculated }) => {
  const [roundStates, setRoundStates] = useState([]);
  const [expandedRounds, setExpandedRounds] = useState([]);

  useEffect(() => {
    // If required data is missing, show error or calculate from available data
    if (!L0Bits || !R0Bits || !roundKeys || roundKeys.length < 16) {
      setRoundStates([]);
      return;
    }

    const rounds = [];
    let L = L0Bits;
    let R = R0Bits;

    for (let i = 1; i < 16; i++) {
      const K = roundKeys[i]; // roundKeys[i] is already a 48-bit binary string
      
      // Validate inputs
      if (!K || K.length !== 48) {
        console.error(`Invalid round key ${i}:`, K);
        continue;
      }
      
      const expandedR = expandR0(R);
      const xor = xor48(expandedR, K);
      const sbox = applySBoxes(xor);
      const pbox = pboxPermute(sbox);
      const newR = xorBits(L, pbox); // Use xorBits for 32-bit operation
      const newL = R;

      rounds.push({
        round: i + 1,
        L,
        R,
        K,
        expandedR,
        xor,
        sbox,
        pbox,
        newL,
        newR
      });

      L = newL;
      R = newR;
    }

    setRoundStates(rounds);

    // Call the callback with final L16 and R16 values
    if (onFinalValuesCalculated && rounds.length > 0) {
      const finalRound = rounds[rounds.length - 1];
      onFinalValuesCalculated(finalRound.newL, finalRound.newR);
    }
  }, [L0Bits, R0Bits, roundKeys, onFinalValuesCalculated]);

  const toggleRound = (round) => {
    setExpandedRounds((prev) =>
      prev.includes(round) ? prev.filter((r) => r !== round) : [...prev, round]
    );
  };

  const toMatrix = (bits, rowLength = 8) => {
    if (!bits) return [];
    return Array.from({ length: Math.ceil(bits.length / rowLength) }, (_, i) =>
      bits.slice(i * rowLength, i * rowLength + rowLength).split('')
    );
  };

  return (
    <motion.div
      className="des-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="explanation-box">
        <p>
          <strong>Rounds 2–16:</strong> Each round uses the Feistel function on R and K, then updates L and R.
          Click any round to expand/collapse the full transformation.
        </p>
      </div>

      {/* Show message when data is missing */}
      {(!L0Bits || !R0Bits || !roundKeys || roundKeys.length < 16) && (
        <div style={{ color: 'orange', padding: '1rem', background: '#fff3cd', borderRadius: '4px', marginBottom: '1rem' }}>
          <strong>Note:</strong> This step requires data from previous steps. Please complete Steps 2-4 first to see the round calculations.
          <br />
          <small>L₀: {L0Bits?.length || 0} bits, R₀: {R0Bits?.length || 0} bits, Round Keys: {roundKeys?.length || 0}/16</small>
        </div>
      )}

      {roundStates.length === 0 && roundKeys.length > 0 && (
        <div style={{ color: 'red', padding: '1rem', background: '#ffe6e6', borderRadius: '4px', marginBottom: '1rem' }}>
          <strong>Error:</strong> No rounds were generated. Check console for details.
        </div>
      )}

      <div className="step2-grid">
      {roundStates.map((state) => (
        <div key={state.round} className="step2-block">
          <h4 className="round-toggle" onClick={() => toggleRound(state.round)}>
            Round {state.round} (Click to {expandedRounds.includes(state.round) ? 'Collapse' : 'Expand'})
          </h4>

          <MatrixTable matrix={toMatrix(state.newR)} />

          {expandedRounds.includes(state.round) && (
            <div className="step2-block">
              <div className="step-row-grid">
                <div className="step-box">
                  <h5>L{state.round - 1}</h5>
                  <MatrixTable matrix={toMatrix(state.L)} />
                </div>
                <div className="step-box">
                  <h5>R{state.round - 1}</h5>
                  <MatrixTable matrix={toMatrix(state.R)} />
                </div>
              </div>

              <div className="step-row-grid">
                <div className="step-box">
                  <h5>Expanded R</h5>
                  <MatrixTable matrix={toMatrix(state.expandedR)} />
                </div>
                <div className="step-box">
                  <h5>Round Key K{state.round}</h5>
                  <MatrixTable matrix={toMatrix(state.K)} />
                </div>
              </div>

              <div className="step-row-grid">
                <div className="step-box">
                  <h5>Expanded R ⊕ K</h5>
                  <MatrixTable matrix={toMatrix(state.xor)} />
                </div>
                <div className="step-box">
                  <h5>S-Box Output</h5>
                  <MatrixTable matrix={toMatrix(state.sbox)} />
                </div>
                <div className="step-box">
                  <h5>P-Box Output</h5>
                  <MatrixTable matrix={toMatrix(state.pbox)} />
                </div>
              </div>

              <div className="step-row-grid">
                <div className="step-box">
                  <h5>L{state.round} = R{state.round - 1}</h5>
                  <MatrixTable matrix={toMatrix(state.newL)} />
                </div>
                <div className="step-box">
                  <h5>R{state.round} = L{state.round - 1} ⊕ f</h5>
                  <MatrixTable matrix={toMatrix(state.newR)} />
                </div>
              </div>
            </div>
          )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Step5Rounds2to16;
