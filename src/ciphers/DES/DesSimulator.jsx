// src/ciphers/DES/DesSimulator.jsx
import React, { useState } from 'react';
import '../../styles/des.css';
import Step0DesRoundFlow from './steps/Step0DesRoundFlow';
import Step1InputPreparation from './steps/Step1InputPreparation';
import Step2InitialPermutationAndSplit from './steps/Step2InitialPermutationAndSplit';
import Step3KeySchedule from './steps/Step3KeySchedule';
import Step4Round1 from './steps/Step4Round1';
import Step5Rounds2to16 from './steps/Step5Rounds2to16';
import { asciiToBinaryMatrix } from '../../shared/des/asciiToBinaryMatrix';
import { initialPermutation } from '../../shared/des/initialPermutation';
import { expandR0, xor48, applySBoxes, pboxPermute } from '../../shared/des/round1';
import { prepareKeyScheduleMatrix } from '../../shared/des/keyScheduleHelper';
import StepNavigator from '../../components/StepNavigator';
import HintBox from '../../components/HintBox';
import { AnimatePresence, motion } from 'framer-motion';

const DesSimulator = () => {
  const [plainText, setPlainText] = useState('');
  const [keyText, setKeyText] = useState('');
  const [inputMatrix, setInputMatrix] = useState([]);
  const [keyMatrix, setKeyMatrix] = useState([]);
  const [inputBits, setInputBits] = useState([]);
  const [permutedInput, setPermutedInput] = useState([]);
  const [keyBits, setKeyBits] = useState([]);
  const [L0Bits, setL0Bits] = useState([]);
  const [R0Bits, setR0Bits] = useState([]);
  const [K1Bits, setK1Bits] = useState([]);
  const [expandedR, setExpandedR] = useState([]);
  const [xorWithKey, setXorWithKey] = useState([]);
  const [sboxOutput, setSboxOutput] = useState([]);
  const [pboxOutput, setPboxOutput] = useState([]);
  const [R1Bits, setR1Bits] = useState([]);
  const [step, setStep] = useState(-1);
  const [roundKeys, setRoundKeys] = useState([]);
  const [roundResults, setRoundResults] = useState([]);
  const [stepStatus, setStepStatus] = useState(Array(10).fill(false));

  const handleConvert = (e) => {
    e.preventDefault();
    try {
      const paddedInput = plainText.padEnd(8, '\x00');
      const paddedKey = keyText.padEnd(8, '\x00');

      const inputBinMatrix = asciiToBinaryMatrix(paddedInput);
      const keyBinMatrix = asciiToBinaryMatrix(paddedKey);

      const inputBits = inputBinMatrix.flat().join('');
      const permutedBits = initialPermutation(inputBits);

      const keyBits = keyBinMatrix.flat().join('');

      if (plainText.length > 8 || keyText.length > 8) {
        throw new Error('Plaintext and key must be at most 8 characters (64 bits)');
      }

      setInputBits(inputBits);
      setInputMatrix(inputBinMatrix);
      setKeyMatrix(keyBinMatrix);
      setPermutedInput(permutedBits);
      setKeyBits(keyBits);
      setStep(0);
      
      const L0 = permutedBits.slice(0, 32);
      const R0 = permutedBits.slice(32);
      
      // Generate the first round key
      const roundKeyMatrices = prepareKeyScheduleMatrix(keyBits);
      const K1 = roundKeyMatrices[0].flat().join('');
      
      const expanded = expandR0(R0);
      const xor = xor48(expanded, K1);
      const sbox = applySBoxes(xor);
      const pbox = pboxPermute(sbox);
      const R1 = xor48(L0, pbox);
      
      setL0Bits(L0);
      setR0Bits(R0);
      setK1Bits(K1);
      setExpandedR(expanded);
      setXorWithKey(xor);
      setSboxOutput(sbox);
      setPboxOutput(pbox);
      setR1Bits(R1);
      
      const updated = [...stepStatus];
      updated[0] = true;
      setStepStatus(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReset = () => {
    setStep(-1);
    setPlainText('');
    setKeyText('');
    setInputMatrix([]);
    setKeyMatrix([]);
    setInputBits([]);
    setPermutedInput([]);
    setKeyBits([]);
    setL0Bits([]);
    setR0Bits([]);
    setK1Bits([]);
    setExpandedR([]);
    setXorWithKey([]);
    setSboxOutput([]);
    setPboxOutput([]);
    setR1Bits([]);
    setRoundKeys([]);
    setRoundResults([]);
    setStepStatus(Array(10).fill(false));
  };

  const unlockNextStep = () => {
    const next = step + 1;
    if (next < stepStatus.length && !stepStatus[next]) {
      const updated = [...stepStatus];
      updated[next] = true;
      setStepStatus(updated);
    }
  };

  /* output consts*/
  return (
    <div className="des-container">
      <h2 style={{ textAlign: 'center' }}>DES Encryption</h2>

      <form onSubmit={handleConvert}>
        <div className="form-grid">
          {/* Form left input fields */}
          <div className="form-left">
            <div>
              <label>Plaintext</label>
              <input
                type="text"
                value={plainText}
                placeholder="8 ASCII chars"
                onChange={(e) => setPlainText(e.target.value)}
                maxLength={8}

              />
            </div>
            <div>
              <label>Key</label>
              <input
                type="text"
                value={keyText}
                placeholder="8 ASCII chars"
                onChange={(e) => setKeyText(e.target.value)}
                maxLength={8}

              />
            </div>
          </div>


          {/* Binary output display */}
          <div className="form-right">
            <div>
              <label>Input (64-bit Binary)</label>
              <div className="hex-output" >
                {inputMatrix.flat().join('')}
              </div>
            </div>
            <div>
              <label>Key (64-bit Binary)</label>
              <div className="hex-output" >
                {keyMatrix.flat().join('')}
              </div>
            </div>

          </div>
        </div>

        <div className="aes-button-row">
          <button type="submit">Start</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {/* Step navigator */}
      <div className="step-navigator">
        {step >= 0 && (
          <StepNavigator
            currentStep={step}
            totalSteps={9}
            onStepChange={(s) => setStep(s)}
            stepStatus={stepStatus}
          />
        )}
      </div>

      {/* Step 0 */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>Step 0: DES Round Structure</h3>
            <HintBox step={0} />
            <Step0DesRoundFlow />
            <button onClick={() => { unlockNextStep(); setStep(1); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}

        {/* Step 1 */}
        {step === 1 && inputMatrix.length && keyMatrix.length && (
          <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>Step 1: Input Preparation</h3>
            <HintBox step={1} />
            <Step1InputPreparation inputMatrix={inputMatrix} keyMatrix={keyMatrix} />
            <button onClick={() => { unlockNextStep(); setStep(2); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>Step 2: Initial Permutation and Split into L₀ and R₀</h3>

            <HintBox step={2} />
            <Step2InitialPermutationAndSplit inputBits={inputBits} permutedBits={permutedInput} />
            <button onClick={() => { unlockNextStep(); setStep(3); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>Step 3: Key Schedule (PC-1, C/D Halves & Round Keys)</h3>
            <HintBox step={3} />
            <Step3KeySchedule
              keyBits={keyBits}
              onKeysGenerated={(keys) => {
                setRoundKeys(keys);
              }}
            />

            <button onClick={() => { unlockNextStep(); setStep(4); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>Step 4: Round 1</h3>
            <HintBox step={4} />
            <Step4Round1 L0Bits={L0Bits} R0Bits={R0Bits} K1Bits={K1Bits} expandedR={expandedR} xorWithKey={xorWithKey} sboxOutput={sboxOutput} pboxOutput={pboxOutput} R1Bits={R1Bits} />
            <button onClick={() => { unlockNextStep(); setStep(5); }} style={{ marginTop: '1rem' }}>Next Step</button>
          </motion.div>
        )}
        {step === 5 && (
  <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h3>Step 5: Rounds 2–16</h3>
    <HintBox step={5} />
    <Step5Rounds2to16 L0Bits={L0Bits} R0Bits={R0Bits} roundKeys={roundKeys} />
    <button onClick={() => { unlockNextStep(); setStep(6); }} style={{ marginTop: '1rem' }}>Next Step</button>
  </motion.div>
)}



        {/* Further steps will go here... */}
      </AnimatePresence>
    </div>
  );
};

export default DesSimulator;
