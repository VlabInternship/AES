// src/ciphers/AES/AesSimulator.jsx
import React, { useState } from 'react';
import { asciiToHex } from '../../shared/aes/asciiToHex';
import { toMatrix } from '../../shared/aes/toMatrix';
import { padInput } from '../../shared/aes/padInput';
import { expandKey } from '../../shared/aes/keyExpansion';
import Step0InputDisplay from './steps/Step0InputDisplay';
import Step1KeyExpansion from './steps/Step1KeyExpansion';
import Step2InitialRound from './steps/Step2InitialRound';
import StepNavigator from '../../components/StepNavigator'; // ✅ new

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

  const handleConvert = (e) => {
    e.preventDefault();
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
    setStep(0); // Start at Step 0
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

      {/* Step Navigator UI */}
      {step >= 0 && (
        <StepNavigator
          currentStep={step}
          totalSteps={11}
          onStepChange={(s) => setStep(s)}
        />
      )}

      {/* Step Rendering */}
      {step === 0 && inputMatrix.length > 0 && keyMatrix.length > 0 && (
        <Step0InputDisplay inputMatrix={inputMatrix} keyMatrix={keyMatrix} />
      )}

      {step === 1 && roundKeys.length > 0 && (
        <Step1KeyExpansion roundKeys={roundKeys} words={words} />
      )}

      {step === 2 && roundKeys.length > 0 && (
        <Step2InitialRound inputMatrix={inputMatrix} roundKey0={roundKeys[0]} />
      )}

      {/* Future: Add step === 3 to 10 here */}
    </div>
  );
};

export default AesSimulator;
