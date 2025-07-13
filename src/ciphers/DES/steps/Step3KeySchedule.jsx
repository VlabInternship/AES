// ✅ Integrate PC-1 and C0/D0 visualization into Step 4's round 0 expand block
import React, { useEffect, useState } from 'react';
import MatrixTable from '../../../components/MatrixTable';
import { motion } from 'framer-motion';
import { prepareKeyScheduleMatrix, getCDHalvesPerRound, applyPC1WithTrace, getBeforePC1PerRound, applyPC2WithTrace } from '../../../shared/des/keyScheduleHelper';

const Step3KeySchedule = ({ keyBits, onKeysGenerated }) => {
  const [roundKeys, setRoundKeys] = useState([]);
  const [expandedRounds, setExpandedRounds] = useState([]);
  const [cdHalves, setCdHalves] = useState([]);
  const [pc1Matrix, setPc1Matrix] = useState([]);
  const [highlightMap, setHighlightMap] = useState({});
  const [originalMatrix, setOriginalMatrix] = useState([]);
  const [C0, setC0] = useState([]);
  const [D0, setD0] = useState([]);
  const [beforePC1PerRound, setBeforePC1PerRound] = useState([]);
  const [afterPC1PerRound, setAfterPC1PerRound] = useState([]);
  const [pc2DataPerRound, setPc2DataPerRound] = useState([]);
  const [pc2HighlightMaps, setPc2HighlightMaps] = useState([]);
  const [pc1HighlightMaps, setPc1HighlightMaps] = useState([]);
  
  

  useEffect(() => {
    if (keyBits?.length === 64) {
      const keys = prepareKeyScheduleMatrix(keyBits);
      const cd = getCDHalvesPerRound(keyBits);
      const { permuted56Bit, traceMap, droppedParityBitIndices } = applyPC1WithTrace(keyBits);
      const original = Array.from({ length: 8 }, (_, i) =>
        keyBits.slice(i * 8, i * 8 + 8).split('')
      );
      const pc1 = Array.from({ length: 8 }, (_, i) =>
        permuted56Bit.slice(i * 7, i * 7 + 7).split('')
      );

      const origMap = {};
      droppedParityBitIndices.forEach((i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        origMap[`${row}-${col}`] = 'parity';
      });

      const permMap = {};
      Object.entries(traceMap).forEach(([fromIdx, toIdx]) => {
        const fromRow = Math.floor(fromIdx / 8);
        const fromCol = fromIdx % 8;
        const toRow = Math.floor(toIdx / 7);
        const toCol = toIdx % 7;
        origMap[`${fromRow}-${fromCol}`] = 'source';
        permMap[`${toRow}-${toCol}`] = 'result';
      });

      const C0bits = permuted56Bit.slice(0, 28);
      const D0bits = permuted56Bit.slice(28);
      const toMatrix = (bitStr) =>
        Array.from({ length: 4 }, (_, i) => bitStr.slice(i * 7, i * 7 + 7).split(''));

      // Get before PC-1 and after PC-1 states for each round
      const beforePC1States = getBeforePC1PerRound(keyBits);
      const afterPC1States = cd.map(round => round.C + round.D);

      // Create PC-1 highlight maps for each round
      const pc1Highlights = beforePC1States.map((beforePC1State, roundIndex) => {
        const { traceMap: roundTraceMap, droppedParityBitIndices: roundDroppedBits } = applyPC1WithTrace(beforePC1State);
        
        const inputMap = {};
        const outputMap = {};
        
        // Mark dropped parity bits
        roundDroppedBits.forEach((i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          inputMap[`${row}-${col}`] = 'dropped';
        });

        // Mark mapped bits
        Object.entries(roundTraceMap).forEach(([fromIdx, toIdx]) => {
          const fromRow = Math.floor(fromIdx / 8);
          const fromCol = fromIdx % 8;
          const toRow = Math.floor(toIdx / 7);
          const toCol = toIdx % 7;
          inputMap[`${fromRow}-${fromCol}`] = 'source';
          outputMap[`${toRow}-${toCol}`] = 'result';
        });

        return { input: inputMap, output: outputMap };
      });

      // Get PC-2 data for each round
      const pc2Data = cd.map(round => {
        const cdCombined = round.C + round.D;
        return applyPC2WithTrace(cdCombined);
      });

      // Create PC-2 highlight maps for each round
      const pc2Highlights = pc2Data.map(pc2Result => {
        const inputMap = {};
        const outputMap = {};
        
        // Mark dropped bits
        pc2Result.droppedBitIndices.forEach((i) => {
          const row = Math.floor(i / 7);
          const col = i % 7;
          inputMap[`${row}-${col}`] = 'dropped';
        });

        // Mark mapped bits
        Object.entries(pc2Result.traceMap).forEach(([fromIdx, toIdx]) => {
          const fromRow = Math.floor(fromIdx / 7);
          const fromCol = fromIdx % 7;
          const toRow = Math.floor(toIdx / 8);
          const toCol = toIdx % 8;
          inputMap[`${fromRow}-${fromCol}`] = 'source';
          outputMap[`${toRow}-${toCol}`] = 'result';
        });

        return { input: inputMap, output: outputMap };
      });

      setRoundKeys(keys);
      setCdHalves(cd);
      setOriginalMatrix(original);
      setPc1Matrix(pc1);
      setHighlightMap({ original: origMap, permuted: permMap });
      setC0(toMatrix(C0bits));
      setD0(toMatrix(D0bits));
      setBeforePC1PerRound(beforePC1States);
      setAfterPC1PerRound(afterPC1States);
      setPc2DataPerRound(pc2Data);
      setPc2HighlightMaps(pc2Highlights);
      setPc1HighlightMaps(pc1Highlights);
      if (typeof onKeysGenerated === 'function') {
        onKeysGenerated(keys);
      }
    }
  }, [keyBits]);

  const toggleRound = (round) => {
    setExpandedRounds(prev =>
      prev.includes(round)
        ? prev.filter(r => r !== round)
        : [...prev, round]
    );
  };

  const toMatrix = (bitStr) =>
    Array.from({ length: 4 }, (_, i) => bitStr.slice(i * 7, i * 7 + 7).padEnd(7, ' ').split(''));

  const to64BitMatrix = (bitStr) =>
    Array.from({ length: 8 }, (_, i) => bitStr.slice(i * 8, i * 8 + 8).split(''));

  const to56BitMatrix = (bitStr) =>
    Array.from({ length: 8 }, (_, i) => bitStr.slice(i * 7, i * 7 + 7).split(''));

  const to48BitMatrix = (bitStr) =>
    Array.from({ length: 6 }, (_, i) => bitStr.slice(i * 8, i * 8 + 8).split(''));

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
          <strong>Key Schedule Overview:</strong> The DES key schedule generates 16 unique 48-bit round keys from the original 64-bit key.
          Each round key is used in the Feistel network to encrypt the plaintext.
        </p>
        <p>
          <strong>Key Schedule Process:</strong>
        </p>
        <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
          <li><strong>PC-1 Permutation:</strong> 64-bit key → 56-bit key (removes 8 parity bits)</li>
          <li><strong>Split:</strong> 56-bit key → C₀ (28 bits) + D₀ (28 bits)</li>
          <li><strong>Left Shifts:</strong> Each round applies 1 or 2 left shifts to C and D</li>
          <li><strong>PC-2 Permutation:</strong> 56-bit (C+D) → 48-bit round key</li>
        </ul>
        <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
          <strong>Shift Schedule:</strong> Rounds 1,2,9,16 use 1 shift; all others use 2 shifts
        </p>
        <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
          <strong>Click on any round below to expand and see the detailed transformation process.</strong>
        </p>
      </div>

      <div className="legend-box" style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '1rem' }}>
        <span style={{ color: 'goldenrod' }}>🟨 Yellow = Source bits (original positions)</span> &nbsp;|&nbsp;
        <span style={{ color: 'green' }}>🟩 Green = Result bits (new positions after permutation)</span> &nbsp;|&nbsp;
        <span style={{ color: 'red' }}>🔴 Red = Dropped bits (parity bits in PC-1, selected bits in PC-2)</span>
      </div>

      <div className="step2-grid">
        {roundKeys.map((matrix, round) => (
          <div key={round} className="step2-block" >
            <h4 className="round-toggle" onClick={() => toggleRound(round)}>
              Round {round + 1} (Click to {expandedRounds.includes(round) ? 'Collapse' : 'Expand'})
            </h4>
            <MatrixTable matrix={matrix} />

            {expandedRounds.includes(round) && (
              <div className="step-wblock">
                {pc1HighlightMaps[round] && (
                  <>
                    <p className="explanation-box">
                      <strong>PC-1 Permutation (Permuted Choice 1):</strong> This step transforms the 64-bit key into a 56-bit key by:
                      <br />
                      • Removing the 8 parity bits (bits 8, 16, 24, 32, 40, 48, 56, 64)
                      <br />
                      • Permuting the remaining 56 bits according to the PC-1 table
                      <br />
                      <span style={{ fontSize: '0.9em', color: '#666' }}>
                        • <span style={{ backgroundColor: '#ffeeba' }}>Yellow</span> = Source bits • <span style={{ backgroundColor: '#c1f0c1' }}>Green</span> = Result bits • <span style={{ backgroundColor: '#ffcccc' }}>Red</span> = Dropped parity bits
                      </span>
                    </p>
                    <div className="step-row-grid">
                      <div className="step-box">
                        <h5>Before PC-1 (64 bits) - Round {round + 1}</h5>
                        <MatrixTable 
                          matrix={to64BitMatrix(beforePC1PerRound[round])} 
                          highlightMap={pc1HighlightMaps[round].input}
                        />
                      </div>
                      <div className="step-box">
                        <h5>After PC-1 (56 bits) - Round {round + 1}</h5>
                        <MatrixTable 
                          matrix={to56BitMatrix(afterPC1PerRound[round])} 
                          highlightMap={pc1HighlightMaps[round].output}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {cdHalves[round] && (
                  <>
                    <p className="explanation-box">
                      <strong>C{round + 1} and D{round + 1} Halves:</strong> After PC-1, the 56-bit key is split into two 28-bit halves:
                      <br />
                      • <strong>C{round + 1}:</strong> Left 28 bits (shown above)
                      <br />
                      • <strong>D{round + 1}:</strong> Right 28 bits (shown above)
                      <br />
                      These halves are created by applying left shifts to the previous round's C and D values.
                      The number of shifts depends on the round: 1 shift for rounds 1,2,9,16; 2 shifts for all others.
                    </p>
                    <div className="step-row-grid">
                      <div className="step-box">
                        <h5>C{round + 1}</h5>
                        <MatrixTable matrix={toMatrix(cdHalves[round].C)} />
                      </div>
                      <div className="step-box">
                        <h5>D{round + 1}</h5>
                        <MatrixTable matrix={toMatrix(cdHalves[round].D)} />
                      </div>
                    </div>
                  </>
                )}

                {pc2DataPerRound[round] && pc2HighlightMaps[round] && (
                  <>
                    <p className="explanation-box">
                      <strong>PC-2 Permutation (Permuted Choice 2):</strong> This final step creates the 48-bit round key by:
                      <br />
                      • Combining C{round + 1} + D{round + 1} into a 56-bit string
                      <br />
                      • Permuting and selecting 48 bits according to the PC-2 table
                      <br />
                      • Dropping 8 bits (positions 9, 18, 22, 25, 35, 38, 43, 54)
                      <br />
                      The resulting 48-bit key (K{round + 1}) is used in the Feistel network for this round.
                      <br />
                      <span style={{ fontSize: '0.9em', color: '#666' }}>
                        • <span style={{ backgroundColor: '#ffeeba' }}>Yellow</span> = Source bits • <span style={{ backgroundColor: '#c1f0c1' }}>Green</span> = Result bits • <span style={{ backgroundColor: '#ffcccc' }}>Red</span> = Dropped bits
                      </span>
                    </p>
                    <div className="step-row-grid">
                      <div className="step-box">
                        <h5>Before PC-2 (56 bits) - C{round + 1} + D{round + 1}</h5>
                        <MatrixTable 
                          matrix={to56BitMatrix(afterPC1PerRound[round])} 
                          highlightMap={pc2HighlightMaps[round].input}
                        />
                      </div>
                        <div className="step-box">
                        <h5>After PC-2 (48 bits) - Round Key K{round + 1}</h5>
                        <MatrixTable 
                          matrix={to48BitMatrix(pc2DataPerRound[round].permuted48Bit)} 
                          highlightMap={pc2HighlightMaps[round].output}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Step3KeySchedule;