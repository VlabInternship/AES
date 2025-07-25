// src/ciphers/AES/AesSimulator.jsx
import React, { useState } from 'react';
import '../../../styles/aes.css';
import { asciiToHex } from '../../../shared/aes/asciiToHex';
import { toMatrix } from '../../../shared/aes/toMatrix';
import { expandKey } from '../../../shared/aes/keyExpansion';
import { addRoundKey } from '../../../shared/aes/addRoundKey';
import { subBytes } from '../../../shared/aes/subBytes';
import { shiftRows } from '../../../shared/aes/shiftRows';
import { mixColumns } from '../../../shared/aes/mixColumns';

import Step0AesEncryptRoundFlow from './steps/Step0AesEncryptRoundFlow';
import Step1InputDisplay from './steps/Step1InputDisplay';
import Step2KeyExpansion from './steps/Step2KeyExpansion';
import Step3InitialRound from './steps/Step3InitialRound';
import Step4SubBytes from './steps/Step4SubBytes';
import Step5ShiftRows from './steps/Step5ShiftRows';
import Step6MixColumns from './steps/Step6MixColumns';
import Step11CiphertextOutput from './steps/Step11CiphertextOutput';

import StepNavigator from '../../../components/StepNavigator';
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
      let inputHexArr, keyHexArr;

      if (inputMode === 'ascii') {
        inputHexArr = asciiToHex(plainText);
        keyHexArr = asciiToHex(keyText);
      } else {
        // Hex input mode - validate and split
        if (!/^[0-9a-fA-F]{32}$/.test(plainText) || !/^[0-9a-fA-F]{32}$/.test(keyText)) {
          throw new Error("HEX input must be 32 valid hex characters (16 bytes).");
        }
        inputHexArr = plainText.match(/.{2}/g).map(h => h.toUpperCase());
        keyHexArr = keyText.match(/.{2}/g).map(h => h.toUpperCase());
      }

      const inputMatrixFormatted = toMatrix(inputHexArr);
      const keyMatrixFormatted = toMatrix(keyHexArr);
      const { roundKeys, words } = expandKey(keyHexArr);

      setRoundKeys(roundKeys);
      setWords(words);
      setInputHex(inputHexArr);
      setKeyHex(keyHexArr);
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

  const round0Output = inputMatrix.length === 4 && roundKeys[0]?.length === 4 ? addRoundKey(inputMatrix, roundKeys[0]) : [];
  const subBytesOutput = round0Output.length === 4 ? subBytes(round0Output) : [];
  const shiftRowsOutput = subBytesOutput.length === 4 ? shiftRows(subBytesOutput) : [];
  const mixColumnsOutput = shiftRowsOutput.length === 4 ? mixColumns(shiftRowsOutput) : [];
  const addRoundKeyOutput = roundKeys.length > 1 ? addRoundKey(mixColumnsOutput, roundKeys[1]) : [];
  const subBytesRound2Input = addRoundKeyOutput.length === 4 ? subBytes(addRoundKeyOutput) : [];
  const shiftRowsRound2Output = subBytesRound2Input.length === 4 ? shiftRows(subBytesRound2Input) : [];

  const [inputMode, setInputMode] = useState('ascii'); // 'ascii' or 'hex'

  return (
    <div className="aes-container">
      <h2 style={{ textAlign: 'center' }}>
        AES Encryption
      </h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="radio"
            name="inputMode"
            value="ascii"
            checked={inputMode === 'ascii'}
            onChange={() => setInputMode('ascii')}
          />
          ASCII Mode
        </label>
        <label style={{ marginLeft: '1rem' }}>
          <input
            type="radio"
            name="inputMode"
            value="hex"
            checked={inputMode === 'hex'}
            onChange={() => setInputMode('hex')}
          />
          HEX Mode
        </label>
      </div>


      <form onSubmit={handleConvert}>
        <div className="form-grid">
          <div className="form-left">
            <div>
              <label>Plaintext</label>
              <input
                type="text"
                value={plainText}
                placeholder={inputMode === 'ascii' ? "Enter 16 ASCII characters" : "Enter 32 hex digits"}
                onChange={(e) => setPlainText(e.target.value)}
                pattern={inputMode === 'ascii' ? ".{16}" : "[0-9A-Fa-f]{32}"}
                maxLength={inputMode === 'ascii' ? 16 : 32}
                required
                title={inputMode === 'ascii'
                  ? "Plaintext must be exactly 16 ASCII characters"
                  : "Plaintext must be 32 hexadecimal characters (16 bytes)"}
              />


            </div>
            <div>
              <label>Key</label>
              <input
                type="text"
                value={keyText}
                placeholder={inputMode === 'ascii' ? "Enter 16 ASCII characters" : "Enter 32 hex digits"}
                onChange={(e) => setKeyText(e.target.value)}
                pattern={inputMode === 'ascii' ? ".{16}" : "[0-9A-Fa-f]{32}"}
                maxLength={inputMode === 'ascii' ? 16 : 32}
                required
                title={inputMode === 'ascii'
                  ? "Plaintext must be exactly 16 ASCII characters"
                  : "Plaintext must be 32 hexadecimal characters (16 bytes)"}
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
      <div className='step-navigator'>
        {step >= 0 && (
          <StepNavigator
            currentStep={step}
            totalSteps={12}
            onStepChange={(s) => setStep(s)}
            stepStatus={stepStatus}
          />
        )}

      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <h3>Step 0 : AES-128 Round Structure (Compact Overview)</h3>
            <Step0AesEncryptRoundFlow />
            <button onClick={() => { unlockNextStep(); setStep(1); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}
        {step === 1 && inputMatrix.length > 0 && keyMatrix.length > 0 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <h3>Step 1: Input Preparation</h3>
            <Step1InputDisplay inputMatrix={inputMatrix} keyMatrix={keyMatrix} />
            <button onClick={() => { unlockNextStep(); setStep(2); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}

        {step === 2 && roundKeys.length > 0 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <h3>Step 2: Key Expansion </h3>
            <Step2KeyExpansion roundKeys={roundKeys} words={words} currentStep={step} />
            <button onClick={() => { unlockNextStep(); setStep(3); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}

        {step === 3 && roundKeys.length > 0 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <h3>Step 3: Round 0 - AddRoundKey</h3>
            <Step3InitialRound inputMatrix={inputMatrix} roundKey={roundKeys[0]} round={0} />
            <button onClick={() => { unlockNextStep(); setStep(4); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <h3>Step 4: Round 1 Subbytes</h3>
            <Step4SubBytes inputMatrix={round0Output} />
            <button onClick={() => { unlockNextStep(); setStep(5); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <h3 className="title">Step 5: Round 1 - ShiftRows</h3>
            <Step5ShiftRows inputMatrix={subBytesOutput} />
            <button onClick={() => { unlockNextStep(); setStep(6); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}
        {step === 6 && (
          <motion.div key="step6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <h3 className="title">Step 6: Round 1 - MixColumns</h3>
            <Step6MixColumns inputMatrix={shiftRowsOutput} />
            <button onClick={() => { unlockNextStep(); setStep(7); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}
        {step === 7 && (
          <motion.div key="step7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <h3 className="title">Step 7: Round 1 - AddRoundKey</h3>
            <Step3InitialRound inputMatrix={mixColumnsOutput} roundKey={roundKeys[1]} round={1} />
            <button onClick={() => { unlockNextStep(); setStep(8); }} style={{ marginTop: '1rem' }}>
              Next Step
            </button>
          </motion.div>
        )}
        {step === 8 && (
          <motion.div key="step8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <h3 className="title">Step 8: Round 2 - SubBytes</h3>
            <Step4SubBytes inputMatrix={addRoundKeyOutput} />
            <button onClick={() => { unlockNextStep(); setStep(9); }} style={{ marginTop: '1rem' }}>
              Next Step
            </button>
          </motion.div>
        )}
        {step === 9 && (
          <motion.div key="step9" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <h3 className="title">Step 9: Round 2 - ShiftRows </h3>
            <Step5ShiftRows inputMatrix={subBytesRound2Input} />
            <button onClick={() => { unlockNextStep(); setStep(10); }} style={{ marginTop: '1rem' }}>
              Next Step
            </button>
          </motion.div>
        )}
        {step === 10 && (
          <motion.div key="step10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <h3 className="title">Step 10: Round 2 - MixColumns</h3>
            <Step6MixColumns inputMatrix={shiftRowsRound2Output} />
            <button onClick={() => { unlockNextStep(); setStep(11); }} style={{ marginTop: '1rem' }}>
              Next Step
            </button>
          </motion.div>
        )}
        {step === 11 && (
          <motion.div key="step11" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <h3 className="title">Final Ciphertext</h3>
            <Step11CiphertextOutput inputHex={inputHex} keyHex={keyHex} />
            <button onClick={handleReset} style={{ marginTop: '1rem' }}>
              Reset Simulator
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );

};



export default AesSimulator;
