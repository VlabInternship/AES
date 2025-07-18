import React, { useState, useEffect } from 'react';
import MatrixTable from '../../../../components/MatrixTable';
import TooltipText from '../../../../components/TooltipText';
import { rotWord, subWord } from '../../../../shared/aes/keyExpansion';
import { RCON, SBOX_INDEXED } from '../../../../shared/aes/constants';
import { motion, AnimatePresence } from 'framer-motion';

const SBoxModal = ({ word, substituted, onClose }) => {
  const usedSubValues = new Set(
    substituted.map(b => b.toUpperCase())
  );

  return (
    <AnimatePresence>
        <motion.div
          className="modal-content"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <h3>S-Box Substitution</h3>
          <p><strong>Input Word:</strong> {word.map(b => b.toUpperCase()).join(' ')}</p>
          <p><strong>After S-Box:</strong> {substituted.map(b => b.toUpperCase()).join(' ')}</p>
          <p className='explanation-box'><strong>The high nibble of the byte selects the row and the low nibble selects the column in the S-Box table.</strong></p>

          <p className="sbox-subtitle">
            <span style={{ backgroundColor: '#fff3a3', padding: '2px 6px', border: '1px solid #ccc', marginRight: '8px' }}>Yellow</span>
            = Substituted Values
          </p>

          <table className="sbox-table">
            <tbody>
              {SBOX_INDEXED.map((rowArr, i) => (
                <tr key={i}>
                  {rowArr.map((cell, j) => {
                    const val = cell.toUpperCase();
                    const isHeader = i === 0 || j === 0;
                    const isUsed = !isHeader && usedSubValues.has(val);

                    return (
                      <td
                        key={j}
                        style={{
                          backgroundColor: isUsed ? '#fff3a3' : isHeader ? '#eee' : 'white',
                          fontWeight: isUsed ? 'bold' : 'normal',
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
          <button onClick={onClose} style={{ marginTop: '1rem' }}>Close</button>
        </motion.div>
    </AnimatePresence>
  );
};

const RconModal = ({ rcon, onClose }) => {
  return (
    <AnimatePresence>
        <motion.div
          className="modal-content"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <h3>RCON Value</h3>
          <p><strong>RCON:</strong> {rcon.join(' ').toUpperCase()}</p>
          <p className='explanation-box'><strong>This value is used in the key expansion process to derive new round keys</strong></p>
          <h4 style={{ marginTop: '1rem' }}>All RCON Values (Hex)</h4>
          <table className="rcon-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>RCON</th>
              </tr>
            </thead>
            <tbody>
              {RCON.map((val, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center' }}>RCON[{idx}]</td>
                  <td><code>{val.toString(16).toUpperCase().padStart(2, '0')} 00 00 00</code></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={onClose} style={{ marginTop: '1rem' }}>Close</button>
        </motion.div>
    </AnimatePresence>
  );
};

const WordExpansionBlock = ({ i, words }) => {
  const [word, setWord] = useState([]);
  const [substituted, setSubstituted] = useState([]);
  const [modalType, setModalType] = useState(null); // 'sbox' or 'rcon'
  const rcon = RCON[Math.floor(i / 4)];

  const wPrev = words[i - 1];
  const wPrev4 = words[i - 4];
  if (!wPrev || !wPrev4) return null; // Ensure previous words exist

  const subWordVal = subWord(rotWord(wPrev)).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
  const rconVal = RCON[Math.floor(i / 4)].toString(16).toUpperCase().padStart(2, '0');
  const wCurrent = words[i]?.join(' ').toUpperCase();
  const rot = rotWord(wPrev);
  const handleSubwordClick = () => {
    const sub = subWord(rot);
    setWord(rot);
    setSubstituted(sub);
    setModalType('sbox');
  };

  const handleRconClick = () => {
    setWord([rcon.toString(16).padStart(2, '0')]); // convert number to hex
    setSubstituted([]);
    setModalType('rcon');
  };


  return (
    <>
      <motion.div className="expansion-diagram" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="step-block">
          <TooltipText tooltip="Last word from previous group of 4">w[{i - 1}]</TooltipText>
          <span>[{wPrev.join(' ').toUpperCase()}]</span>
        </div>
        <div className="arrow">→</div>

        <div className="step-block">
          <TooltipText tooltip="Rotate bytes left">RotWord</TooltipText>
          <span>[{rot.join(' ').toUpperCase()}]</span>
        </div>
        <div className="arrow">→</div>

        <div className="step-block">
          <TooltipText tooltip="Each byte is substituted using S-Box">
            <span
              onClick={handleSubwordClick}
              style={{  color: '#0070f3', cursor: 'pointer' }}
            >
              Subword
            </span>

          </TooltipText>
          <span>[{subWordVal}]</span>

        </div>
        <div className="arrow">⊕</div>

        <div className="step-block">
          <TooltipText tooltip="Round constant for this iteration">
            <span
              onClick={handleRconClick}
              style={{color: '#0070f3', cursor: 'pointer' }}
            >
              RCON[{Math.floor(i / 4)}]
            </span>

          </TooltipText>
          <span>[{rconVal} 00 00 00]</span>
        </div>
        <div className="arrow">⊕</div>

        <div className="step-block">
          <TooltipText tooltip="Word from 4 steps back (w[i-4])">w[{i - 4}]</TooltipText>
          <span>[{wPrev4.join(' ').toUpperCase()}]</span>
        </div>
        <div className="arrow">=</div>

        <div className="step-block result">
          <TooltipText tooltip="Final derived word after all XORs">w[{i}]</TooltipText>
          <span className="final-result">[{wCurrent}]</span>
        </div>
      </motion.div>

      {/* rest of blocks: ⊕ RCON, w[i-4], result */}

      {/* ✅ INSERT THIS JUST BELOW motion.div */}
      {modalType === 'sbox' && (
        <SBoxModal
          word={word}
          substituted={substituted}
          onClose={() => setModalType(null)}
        />
      )}

      {modalType === 'rcon' && (
        <RconModal
          rcon={word}
          onClose={() => setModalType(null)}
        />
      )}

    </>
  );

}
const Step2KeyExpansion = ({ roundKeys, words, currentStep }) => {
  const [expandedRounds, setExpandedRounds] = useState([]);
  const [hoveredIndex] = useState(null);

  useEffect(() => {
    if (currentStep === 1 && !expandedRounds.includes(0)) {
      setExpandedRounds((prev) => [...prev, 0]);
    }
  }, [currentStep]);

  const toggleRound = (round) => {
    setExpandedRounds((prev) =>
      prev.includes(round) ? prev.filter((r) => r !== round) : [...prev, round]
    );
  };

  return (
    <div>
      <div className="step2-grid">
        {roundKeys.map((keyMatrix, round) => {
          const highlightMap = {};
          const tooltipMap = {};

          if (hoveredIndex !== null) {
            const resultIndex = hoveredIndex;
            const source1Index = resultIndex >= 4 ? resultIndex - 4 : null;
            const source2Index = resultIndex >= 4 ? resultIndex - 1 : null;

            if (Math.floor(resultIndex / 4) === round) {
              const col = resultIndex % 4;
              for (let row = 0; row < 4; row++) {
                highlightMap[`${row}-${col}`] = 'result';
              }
            }
            if (source1Index !== null && Math.floor(source1Index / 4) === round) {
              const col = source1Index % 4;
              for (let row = 0; row < 4; row++) {
                highlightMap[`${row}-${col}`] = 'source';
              }
            }
            if (source2Index !== null && Math.floor(source2Index / 4) === round) {
              const col = source2Index % 4;
              for (let row = 0; row < 4; row++) {
                highlightMap[`${row}-${col}`] = 'source';
              }
            }
          }

          return (
            <div key={round} className="step2-block">
              <h4 className="round-toggle" onClick={() => toggleRound(round)}>
                Round Key {round} (Click to {expandedRounds.includes(round) ? 'Collapse' : 'Expand'})
              </h4>

              <MatrixTable matrix={keyMatrix} highlightMap={highlightMap} tooltipMap={tooltipMap} />

              {expandedRounds.includes(round) && (
                <div className="step-wblock">
                  {round === 0 && (
  <p className='explanation-box'><strong>Original Key given by User is used as Round0 Key.</strong></p>
)}

                  {[0, 1, 2, 3].map((colIdx) => {
                    const i = round * 4 + colIdx;

                    if (!words || i >= words.length) return null;

                    if (i < 4) {
                      return (
                        <div>
                          <div key={i} className="expansion-diagram">
                            <div className='step-block'>
                              <span>w[{i}]</span>
                            </div>
                            <div className='arrow'>=</div>
                            <div className='step-block result'>
                              <TooltipText tooltip="Original Key Word">
                                <span className='final-result'> [{words[i].join(' ').toUpperCase()}]</span>
                              </TooltipText>
                            </div>



                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={i}>
                        <WordExpansionBlock
                          i={i}
                          words={words}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Step2KeyExpansion;
