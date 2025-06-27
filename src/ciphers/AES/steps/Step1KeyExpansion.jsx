import React, { useState, useEffect } from 'react';
import MatrixTable from '../../../components/MatrixTable';
import TooltipText from '../../../components/TooltipText';
import { rotWord, subWord } from '../../../shared/aes/keyExpansion';
import { RCON, SBOX } from '../../../shared/aes/constants';
import { motion } from 'framer-motion';

const WordExpansionBlock = ({ i, words }) => {
  const wPrev = words[i - 1];
  const wPrev4 = words[i - 4];
  const rotated = rotWord(wPrev);
  const subbed = rotated.map(b => {
    const val = parseInt(b, 16);
    return SBOX[val]?.toString(16).toUpperCase().padStart(2, '0');
  });
  const rconVal = RCON[Math.floor(i / 4)].toString(16).toUpperCase().padStart(2, '0');
  const wCurrent = words[i]?.join(' ').toUpperCase();

  return (
    <motion.div className="expansion-diagram" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="step-block">
        <TooltipText tooltip="Last word from previous group of 4">w[{i - 1}]</TooltipText>
        <span>[{wPrev.join(' ').toUpperCase()}]</span>
      </div>
      <div className="arrow">→</div>

      <div className="step-block">
        <TooltipText tooltip="Rotate bytes left">RotWord</TooltipText>
        <span>[{rotated.join(' ').toUpperCase()}]</span>
      </div>
      <div className="arrow">→</div>

      <div className="step-block">
        <TooltipText tooltip="Each byte is substituted using S-Box">SubWord</TooltipText>
        <span>[{subbed.join(' ')}]</span>
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
  );
};

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
                        <WordExpansionBlock i={i} words={words} />
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
