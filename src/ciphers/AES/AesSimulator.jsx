// src/ciphers/AES/AesSimulator.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HintBox from '../../components/HintBox';

import { asciiToHex } from '../../shared/aes/asciiToHex';
import { toMatrix } from '../../shared/aes/toMatrix';
import { padInput } from '../../shared/aes/padInput';
import { expandKey } from '../../shared/aes/keyExpansion';
import { addRoundKey } from '../../shared/aes/addRoundKey';
import Step0InputDisplay from './steps/Step0InputDisplay';
import Step1KeyExpansion from './steps/Step1KeyExpansion';
import Step2InitialRound from './steps/Step2InitialRound';
import Step3SubBytes from './steps/Step3SubBytes';
import StepNavigator from '../../components/StepNavigator';

const AesSimulator = () => {
  const [plainText, setPlainText] = useState('');
  const [keyText, setKeyText] = useState('');
  const [inputHex, setInputHex] = useState([]);
  const [keyHex, setKeyHex] = useState([]);
  const [inputMatrix, setInputMatrix] = useState([]);
  const [keyMatrix, setKeyMatrix] = useState([]);
  const [roundKeys, setRoundKeys] = useState([]);
  const [words, setWords] = useState([]);
  const [step, setStep] = useState(-1);
  const [stepStatus, setStepStatus] = useState(Array(11).fill(false)); // stepStatus[step] = true if unlocked

  const handleConvert = (e) => {
    e.preventDefault();
    try {
      const inputHexArr = asciiToHex(plainText);
      const keyHexArr = asciiToHex(keyText);
      const paddedInput = padInput(inputHexArr);
      const paddedKey = padInput(keyHexArr);

      const inputMatrixFormatted = toMatrix(paddedInput);
      const keyMatrixFormatted = toMatrix(paddedKey);
      const { roundKeys, words } = expandKey(paddedKey);

      setRoundKeys(roundKeys);
      setWords(words);
      setInputHex(paddedInput);
      setKeyHex(paddedKey);
      setInputMatrix(inputMatrixFormatted);
      setKeyMatrix(keyMatrixFormatted);
      setStep(0);

      const updated = [...stepStatus];
      updated[0] = true;
      setStepStatus(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    setStep(-1);
    setPlainText('');
    setKeyText('');
    setInputHex([]);
    setKeyHex([]);
    setInputMatrix([]);
    setKeyMatrix([]);
    setRoundKeys([]);
    setWords([]);
    setStepStatus(Array(11).fill(false));
  };

  // Call this after completing a step to unlock the next
  const unlockNextStep = () => {
    const next = step + 1;
    if (next < stepStatus.length && !stepStatus[next]) {
      const updated = [...stepStatus];
      updated[next] = true;
      setStepStatus(updated);
    }
  };

  return (
    <div>
      <h2>AES Input Preparation</h2>

      <form>
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Plaintext (16 characters):</strong></label><br />
          <input
            type="text"
            value={plainText}
            placeholder="e.g., Thats my Kung Fu"
            onChange={(e) => setPlainText(e.target.value)}
            maxLength={16}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label><strong>Key (16 characters):</strong></label><br />
          <input
            type="text"
            value={keyText}
            placeholder="e.g., Two One Nine Two"
            onChange={(e) => setKeyText(e.target.value)}
            maxLength={16}
          />
        </div>

        <button onClick={handleConvert}>Start</button>
        <button onClick={handleReset} style={{ marginLeft: '10px' }}>Reset</button>

        {inputHex.length > 0 && (
          <>
            <h4>Input HEX:</h4>
            <p>{inputHex.join(' ').toUpperCase()}</p>

            <h4>Key HEX:</h4>
            <p>{keyHex.join(' ').toUpperCase()}</p>
          </>
        )}
      </form>

      {step >= 0 && (
        <StepNavigator
          currentStep={step}
          totalSteps={11}
          onStepChange={(s) => setStep(s)}
          stepStatus={stepStatus}
        />
      )}

      <AnimatePresence mode="wait">
        {step === 0 && inputMatrix.length > 0 && keyMatrix.length > 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <HintBox step={0} />
            <Step0InputDisplay inputMatrix={inputMatrix} keyMatrix={keyMatrix} />
            <button onClick={() => { unlockNextStep(); setStep(1); }} style={{ marginTop: '1rem' }}>
              Next Step
            </button>
          </motion.div>
        )}

        {step === 1 && roundKeys.length > 0 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <HintBox step={1} />
            <Step1KeyExpansion roundKeys={roundKeys} words={words} currentStep={step} />
            <button onClick={() => { unlockNextStep(); setStep(2); }} style={{ marginTop: '1rem' }}>
              Next Step
            </button>
          </motion.div>
        )}

        {step === 2 && roundKeys.length > 0 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <HintBox step={2} />
            <Step2InitialRound inputMatrix={inputMatrix} roundKey0={roundKeys[0]} />
            <button onClick={() => { unlockNextStep(); setStep(3); }} style={{ marginTop: '1rem' }}>
              Next Step
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <HintBox step={3} />
            <Step3SubBytes inputMatrix={addRoundKey(inputMatrix, roundKeys[0])} />
            <button onClick={() => { unlockNextStep(); setStep(4); }} style={{ marginTop: '1rem' }}>
              Next Step
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}


export default AesSimulator;

