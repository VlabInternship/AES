import React, { useState, useEffect } from 'react';
import MatrixTable from '../../../components/MatrixTable';
import { rotWord, subWord } from '../../../shared/aes/keyExpansion';
import { RCON } from '../../../shared/aes/constants';
import TooltipText from '../../../components/TooltipText';

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

              <MatrixTable
                matrix={keyMatrix}
                highlightMap={highlightMap}
                tooltipMap={tooltipMap}
              />

              {expandedRounds.includes(round) && (
                <div className="step1-wblock">
                  {[0, 1, 2, 3].map((colIdx) => {
                    const i = round * 4 + colIdx;
                    if (!words || i >= words.length) return null;

                    const wordStr = words[i]?.join(' ')?.toUpperCase();
                    const rot = i >= 4 ? rotWord(words[i - 1]).join(' ').toUpperCase() : '';
                    const sub = i >= 4 ? subWord(rotWord(words[i - 1])).join(' ').toUpperCase() : '';
                    const rconIndex = Math.floor(i / 4);
                    const rconVal = RCON[rconIndex]
                      ? RCON[rconIndex].toString(16).padStart(2, '0').toUpperCase()
                      : '';

                    return (
                      <div
                        key={i}
                        className="word-line"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {i < 4 ? (
                          <div>
                            w[{i}] = [{wordStr}] ← Original Key Word
                          </div>
                        ) : (
                          <div>
                            w[{i}] = [{wordStr}] = w[{i - 4}] ⊕{' '}
                            <TooltipText tooltip={`[${rot}]`}>
                              RotWord(w[{i - 1}])
                            </TooltipText>{' '}
                            →{' '}
                            <TooltipText tooltip={`[${sub}]`}>
                              SubWord(...)
                            </TooltipText>{' '}
                            ⊕{' '}
                            <TooltipText tooltip={`Rcon Value: ${rconVal}`}>
                              Rcon[{rconIndex}]
                            </TooltipText>
                          </div>
                        )}
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
