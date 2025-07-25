// src/ciphers/AES/AesSimulator.jsx
import { useState } from 'react';
import '../../../styles/aes.css';
import { asciiToHex } from '../../../shared/aes/asciiToHex';
import { toMatrix } from '../../../shared/aes/toMatrix';
import { expandKey } from '../../../shared/aes/keyExpansion';
import { addRoundKey } from '../../../shared/aes/addRoundKey';
import { invSubBytes } from '../../../shared/aes/invSubBytes';
import { invShiftRows } from '../../../shared/aes/invShiftRows';
import { invMixColumns } from '../../../shared/aes/invMixColumns';
import { compute9to2 } from '../../../components/AesDecryption';

import Step0AesDecryptRoundFlow from './steps/Step0AesDecryptRoundFlow';
import Step1InputDisplay from './steps/Step1InputDisplay';
import Step2KeyExpansion from './steps/Step2KeyExpansion';
import Step3AddRoundKeyDecrypt from './steps/Step3AddRoundKeyDecrypt';
import Step4InvShiftRows from './steps/Step4InvShiftRows';
import Step5InvSubBytes from './steps/Step5InvSubBytes';
import Step6InvMixColumns from './steps/Step6InvMixColumns';
import Step11PlaintextOutput from './steps/Step11PlaintextOutput';

import StepNavigator from '../../../components/StepNavigator';
import { motion, AnimatePresence } from 'framer-motion';

const AesDecryptor = () => {
  const [cipherText, setCipherText] = useState('');
  const [keyText, setKeyText] = useState('');
  const [inputHex, setInputHex] = useState([]);
  const [keyHex, setKeyHex] = useState([]);
  const [inputMatrix, setInputMatrix] = useState([]);
  const [keyMatrix, setKeyMatrix] = useState([]);
  const [roundKeys, setRoundKeys] = useState([]);
  const [words, setWords] = useState([]);
  const [step, setStep] = useState(-1);
  const [setStep7Output] = useState([]);
  const [stepStatus, setStepStatus] = useState(Array(10).fill(false));
  const [inputMode, setInputMode] = useState('ascii'); // 'ascii' or 'hex'

  const handleConvert = (e) => {
    e.preventDefault();
    try {
      let inputHexArr, keyHexArr;

      if (inputMode === 'ascii') {
        inputHexArr = asciiToHex(cipherText);
        keyHexArr = asciiToHex(keyText);
      } else {
        // Hex input mode - validate and split
        if (!/^[0-9a-fA-F]{32}$/.test(cipherText) || !/^[0-9a-fA-F]{32}$/.test(keyText)) {
          throw new Error("HEX input must be 32 valid hex characters (16 bytes).");
        }
        inputHexArr = cipherText.match(/.{2}/g).map(h => h.toUpperCase());
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
    setCipherText('');
    setKeyText('');
    setInputHex([]);
    setKeyHex([]);
    setInputMatrix([]);
    setKeyMatrix([]);
    setRoundKeys([]);
    setWords([]);
    setStepStatus(Array(12).fill(false));
  };

  const unlockNextStep = () => {
    const next = step + 1;
    if (next < stepStatus.length && !stepStatus[next]) {
      const updated = [...stepStatus];
      updated[next] = true;
      setStepStatus(updated);
    }
  };

  const step3Output = inputMatrix.length === 4 && roundKeys[10]?.length === 4 ? addRoundKey(inputMatrix, roundKeys[10]) : [];
  const step4Output = step3Output.length === 4 ? invShiftRows(step3Output) : [];
  const step5Output = step4Output.length === 4 ? invSubBytes(step4Output) : [];
  const step6Output = step5Output.length === 4 ? invMixColumns(step5Output) : [];
  const step7Output = addRoundKey(step6Output, roundKeys[9]);
  const step8Input = compute9to2(step7Output, roundKeys[1], roundKeys); // ← result after round 1 AddRoundKey
  const step8Output = invShiftRows(step8Input);               // Step 8
  const step9Output = invSubBytes(step8Output);       // Step 9
  const step10Output = addRoundKey(step9Output, roundKeys[0]); // Step 10

  return (
    <div className="aes-container">
      <h2 style={{ textAlign: 'center' }}>
        AES Decryption
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
              <label>Ciphertext</label>
              <input
                type="text"
                value={cipherText}
                placeholder={inputMode === 'ascii' ? "Enter 16 ASCII characters" : "Enter 32 hex digits"}
                onChange={(e) => setCipherText(e.target.value)}
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
                  ? "Key must be exactly 16 ASCII characters"
                  : "Key must be 32 hexadecimal characters (16 bytes)"}
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
        {step === 0 && inputMatrix.length > 0 && keyMatrix.length > 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h3>Step 0: AES-128 Decryption Round Structure</h3>
            <Step0AesDecryptRoundFlow />
            <button onClick={() => { unlockNextStep(); setStep(1); }} style={{ marginTop: '1rem' }}>
              Next Step
            </button>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h3>Step 1: Input Preparation</h3>
            <Step1InputDisplay inputMatrix={inputMatrix} keyMatrix={keyMatrix} />
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
            <h3>Step 2: Key Expansion</h3>

            <Step2KeyExpansion roundKeys={roundKeys} words={words} currentStep={step} />
            <button onClick={() => { unlockNextStep(); setStep(3); }} style={{ marginTop: '1rem' }}>
              Next Step
            </button>
          </motion.div>
        )}
        {step === 3 && roundKeys.length > 0 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}>
            <h3>Step 3: Initial Round</h3>

            <Step3AddRoundKeyDecrypt inputMatrix={inputMatrix} roundKey={roundKeys[10]} />
            <button onClick={() => { unlockNextStep(); setStep(4); }} style={{ marginTop: '1rem' }}>
              Next Step
            </button>
          </motion.div>
        )}
        {step === 4 && roundKeys.length > 0 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}>
            <h3>Step 4: Round 10 - InvShiftRows</h3>

            <Step4InvShiftRows inputMatrix={step3Output} />
            <button onClick={() => { unlockNextStep(); setStep(5); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}
        {step === 5 && roundKeys.length > 0 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}>
            <h3>Step 5: Round 10 - InvSubBytes</h3>

            <Step5InvSubBytes inputMatrix={step4Output} />
            <button onClick={() => { unlockNextStep(); setStep(6); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}
        {step === 6 && roundKeys.length > 0 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}>
            <h3>Step 6: Round 10 - InvMixColumns</h3>

            <Step6InvMixColumns inputMatrix={step5Output} />
            <button onClick={() => { unlockNextStep(); setStep(7); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}

        {step === 7 && roundKeys.length > 0 && (
          <motion.div
            key="step7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}>
            <h3>Step 7: Round 10- AddRoundKey</h3>

            <Step3AddRoundKeyDecrypt inputMatrix={step6Output} roundKey={roundKeys[9]} round={9} onOutput={setStep7Output} />
            <button onClick={() => { unlockNextStep(); setStep(8); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}
        {step === 8 && roundKeys.length > 0 && (
          <motion.div
            key="step8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}>
            <h3>Step 8: Round 1- InvShiftRows</h3>

            <Step4InvShiftRows inputMatrix={step8Input} />
            <button onClick={() => { unlockNextStep(); setStep(9); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}
        {step === 9 && roundKeys.length > 0 && (
          <motion.div
            key="step9"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}>
            <h3>Step 9: Round 1- InvSubBytes</h3>

            <Step5InvSubBytes inputMatrix={step8Output} />
            <button onClick={() => { unlockNextStep(); setStep(10); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}
        {step === 10 && roundKeys.length > 0 && (
          <motion.div
            key="step10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}>
            <h3>Step 10: Round 1- AddRoundKey</h3>

            <Step3AddRoundKeyDecrypt inputMatrix={step9Output} roundKey={roundKeys[0]} round={1} />
            <button onClick={() => { unlockNextStep(); setStep(11); }} style={{ marginTop: '1rem' }}>
              Next Step
            </button>
          </motion.div>
        )}
        {step === 11 && roundKeys.length > 0 && (
          <motion.div
            key="step11"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}>
            <h3>Step 11: Final Plaintext Output</h3>

            <Step11PlaintextOutput
              ciphertextMatrix={toMatrix(inputHex)}
              keyMatrix={toMatrix(keyHex)}
              finalMatrix={step10Output}
            />
            <button onClick={handleReset} style={{ marginTop: '1rem' }}>
              Reset Simulator
            </button>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}

export default AesDecryptor;
