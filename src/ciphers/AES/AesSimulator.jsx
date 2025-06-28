// src/ciphers/AES/AesSimulator.jsx
import React, { useState } from 'react';
import '../../styles/aes.css';
import { asciiToHex } from '../../shared/aes/asciiToHex';
import { toMatrix } from '../../shared/aes/toMatrix';
import { padInput } from '../../shared/aes/padInput';
import { expandKey } from '../../shared/aes/keyExpansion';
import { addRoundKey } from '../../shared/aes/addRoundKey';
import { subBytes } from '../../shared/aes/subBytes';
import { shiftRows } from '../../shared/aes/shiftRows';
import { mixColumns } from '../../shared/aes/mixColumns';

import Step0InputDisplay from './steps/Step0InputDisplay';
import Step1KeyExpansion from './steps/Step1KeyExpansion';
import Step2InitialRound from './steps/Step2InitialRound';
import Step3SubBytes from './steps/Step3SubBytes';
import Step4ShiftRows from './steps/Step4ShiftRows';
import Step5MixColumns from './steps/Step5MixColumns';
import Step6AddRoundKey from './steps/Step6AddRoundKey';

import StepNavigator from '../../components/StepNavigator';
import HintBox from '../../components/HintBox';

import { motion, AnimatePresence } from 'framer-motion';

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
  const [stepStatus, setStepStatus] = useState(Array(11).fill(false));

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

  const unlockNextStep = () => {
    const next = step + 1;
    if (next < stepStatus.length && !stepStatus[next]) {
      const updated = [...stepStatus];
      updated[next] = true;
      setStepStatus(updated);
    }
  };

  const round0Output =
    inputMatrix.length === 4 && roundKeys[0]?.length === 4
      ? addRoundKey(inputMatrix, roundKeys[0])
      : [];

  const subBytesOutput =
    round0Output.length === 4 ? subBytes(round0Output) : [];

  const shiftRowsOutput =
    subBytesOutput.length === 4 ? shiftRows(subBytesOutput) : [];

  const mixColumnsOutput =
    shiftRowsOutput.length === 4 ? mixColumns(shiftRowsOutput) : [];

  const addRoundKeyOutput = roundKeys.length > 1 ? addRoundKey(mixColumnsOutput, roundKeys[1]) : [];
  return (
    <div className="aes-container">
      <h2 style={{ textAlign: 'center' }}>
        AES Encryption
      </h2>

      <form onSubmit={handleConvert}>
        <div className="form-grid">
          <div className="form-left">
            <div>
              <label>Plaintext</label>
              <input
                type="text"
                value={plainText}
                placeholder="e.g., Thats my Kung Fu"
                onChange={(e) => setPlainText(e.target.value)}
                maxLength={16}
              />
            </div>
            <div>
              <label>Key</label>
              <input
                type="text"
                value={keyText}
                placeholder="e.g., Two One Nine Two"
                onChange={(e) => setKeyText(e.target.value)}
                maxLength={16}
              />
            </div>
          </div>

          <div className="form-right">
            <div>
              <label>Input HEX</label>
              <div className="hex-output">
                {inputHex.join(' ').toUpperCase()}
              </div>
            </div>
            <div>
              <label>Key HEX</label>
              <div className="hex-output">
                {keyHex.join(' ').toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="aes-button-row">
          <button type="submit">Start</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
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
          <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <HintBox step={0} />
            <Step0InputDisplay inputMatrix={inputMatrix} keyMatrix={keyMatrix} />
            <button onClick={() => { unlockNextStep(); setStep(1); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}

        {step === 1 && roundKeys.length > 0 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <HintBox step={1} />
            <Step1KeyExpansion roundKeys={roundKeys} words={words} currentStep={step} />
            <button onClick={() => { unlockNextStep(); setStep(2); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}

        {step === 2 && roundKeys.length > 0 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <HintBox step={2} />
            <Step2InitialRound inputMatrix={inputMatrix} roundKey0={roundKeys[0]} />
            <button onClick={() => { unlockNextStep(); setStep(3); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <HintBox step={3} />
            <Step3SubBytes inputMatrix={round0Output} />
            <button onClick={() => { unlockNextStep(); setStep(4); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <HintBox step={4} />
            <Step4ShiftRows inputMatrix={subBytesOutput} />
            <button onClick={() => { unlockNextStep(); setStep(5); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}
        {step === 5 && (
  <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
    <HintBox step={5} />
    <Step5MixColumns inputMatrix={shiftRowsOutput} />
    <button onClick={() => { unlockNextStep(); setStep(6); }} style={{ marginTop: '1rem' }}>Next Step</button>
  </motion.div>
)}
{step === 6 && (
  <motion.div key="step6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
    <HintBox step={6} />
    <Step6AddRoundKey
      inputMatrix={mixColumnsOutput}
      roundKey={roundKeys[1]}
    />
    <button onClick={() => { unlockNextStep(); setStep(7); }} style={{ marginTop: '1rem' }}>
      Next Step
    </button>
  </motion.div>
)}


      </AnimatePresence>
    </div>
  );

};



export default AesSimulator;
