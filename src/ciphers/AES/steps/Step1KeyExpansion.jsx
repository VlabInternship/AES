import React, { useState, useEffect } from 'react';
import MatrixTable from '../../../components/MatrixTable';
import TooltipText from '../../../components/TooltipText';
import { rotWord, subWord } from '../../../shared/aes/keyExpansion';
import { RCON, SBOX, SBOX_INDEXED } from '../../../shared/aes/constants';
import { motion, AnimatePresence } from 'framer-motion';

const SBoxModal = ({ word, substituted, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
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
          <p><strong>Left Byte for Row Right Byte for Column</strong></p>

          <table className="sbox-table">
            <tbody>
              {SBOX_INDEXED.map((rowArr, i) => (
                <tr key={i}>
                  {rowArr.map((cell, j) => {
                    const val = cell;
                    const isHeader = i === 0 || j === 0;

                    const isMatch = !isHeader && substituted.some(b => b.toUpperCase() === val);

                    return (
                      <td
                        key={j}
                        style={{
                          backgroundColor: isMatch ? '#c1f0c1' : isHeader ? '#eee' : 'white',
                          fontWeight: isMatch ? 'bold' : 'normal',
                          textAlign: 'center',
                          padding: '6px',
                          border: '1px solid #ccc',
                          minWidth: '28px',
                          fontFamily: 'monospace'
                        }}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={onClose} style={{ marginTop: '1rem' }}>Close</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const WordExpansionBlock = ({ i, words }) => {
  const [showModal, setShowModal] = useState(false);
  const [word, setWord] = useState([]);
  const [substituted, setSubstituted] = useState([]);

  const wPrev = words[i - 1];
  const wPrev4 = words[i - 4];
  const rconVal = RCON[Math.floor(i / 4)].toString(16).toUpperCase().padStart(2, '0');
  const wCurrent = words[i]?.join(' ').toUpperCase();
  const rot = rotWord(wPrev);
  const handleSubwordClick = () => {
    <TooltipText tooltip="Each byte is substituted using S-Box">SubWord</TooltipText>
    const sub = subWord(rot);
    setWord(rot);
    setSubstituted(sub);
    setShowModal(true);
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
              style={{ textDecoration: 'underline dotted', color: '#0070f3', cursor: 'pointer' }}
            >
              Subword
            </span>
          </TooltipText>

        </div>
        <div className="arrow">⊕</div>

        <div className="step-block">
          <TooltipText tooltip="Round constant for this iteration">RCON</TooltipText>
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
      {showModal && (
        <SBoxModal
          word={word}
          substituted={substituted}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );

}
const Step1KeyExpansion = ({ roundKeys, words, currentStep }) => {
  const [expandedRounds, setExpandedRounds] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
      <h3>Step 1: Key Expansion</h3>

      <div className="step1-grid">
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
            <div key={round} className="step1-block">
              <h4 className="round-toggle" onClick={() => toggleRound(round)}>
                Round Key {round} (Click to {expandedRounds.includes(round) ? 'Collapse' : 'Expand'})
              </h4>

              <MatrixTable matrix={keyMatrix} highlightMap={highlightMap} tooltipMap={tooltipMap} />

              {expandedRounds.includes(round) && (
                <div className="step1-wblock">
                  {[0, 1, 2, 3].map((colIdx) => {
                    const i = round * 4 + colIdx;
                    if (!words || i >= words.length) return null;

                    if (i < 4) {
                      return (
                        <div key={i} className="word-line">
                          w[{i}] = [{words[i].join(' ').toUpperCase()}] ← Original Key Word
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

export default Step1KeyExpansion;
