// DesDecryptor.jsx
import React, { useState } from 'react';
import '../../../styles/des.css';
import Step0DesRoundFlow from './steps/Step0DesRoundFlow';
import Step1InputPreparation from './steps/Step1InputPreparation';
import Step2InitialPermutationAndSplit from './steps/Step2InitialPermutationAndSplit';
import Step3KeySchedule from './steps/Step3KeySchedule';
import Step4Round1 from './steps/Step4Round1';
import Step5Rounds2to16 from './steps/Step5Rounds2to16';
import Step6FinalSwap from './steps/Step6FinalSwap';
import Step7FinalPermutation from './steps/Step7FinalPermutation';
import Step8CiphertextOutput from './steps/Step8CiphertextOutput';
import StepNavigator from '../../../components/StepNavigator';
import HintBox from '../../../components/HintBox';
import { AnimatePresence, motion } from 'framer-motion';
import { DesDecryption } from '../../../components/DesDecryption';

const DesDecryptor = () => {
  const [cipherText, setCipherText] = useState('');
  const [keyText, setKeyText] = useState('');
  const [step, setStep] = useState(-1);
  const [stepStatus, setStepStatus] = useState(Array(13).fill(false));
  const [state, setState] = useState({});

  const handleConvert = (e) => {
    e.preventDefault();
    try {
      const result = DesDecryption(cipherText, keyText);
      setState(result);
      setCipherText(result.paddedInput || cipherText);
      setKeyText(result.paddedKey || keyText);
      setStep(0);
      setStepStatus((prev) => {
        const updated = [...prev];
        updated[0] = true;
        return updated;
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReset = () => {
    setCipherText('');
    setKeyText('');
    setStep(-1);
    setStepStatus(Array(13).fill(false));
    setState({});
  };

  const unlockNextStep = () => {
    const next = step + 1;
    if (next < stepStatus.length && !stepStatus[next]) {
      const updated = [...stepStatus];
      updated[next] = true;
      setStepStatus(updated);
    }
  };

  return (
    <div className="des-container">
      <h2 style={{ textAlign: 'center' }}>DES Decryption</h2>

      <form onSubmit={handleConvert}>
        <div className="form-grid">
          <div className="form-left">
            <div>
              <label>Ciphertext</label>
              <input type="text" value={cipherText} onChange={(e) => setCipherText(e.target.value)} maxLength={8} placeholder="8 ASCII chars" />
            </div>
            <div>
              <label>Key</label>
              <input type="text" value={keyText} onChange={(e) => setKeyText(e.target.value)} maxLength={8} placeholder="8 ASCII chars" />
            </div>
          </div>
          <div className="form-right">
            <div>
              <label>Input (64-bit Binary)</label>
              <div className="hex-output">{state.inputMatrix?.flat().join('')}</div>
            </div>
            <div>
              <label>Key (64-bit Binary)</label>
              <div className="hex-output">{state.keyMatrix?.flat().join('')}</div>
            </div>
          </div>
        </div>

        <div className="aes-button-row">
          <button type="submit">Start</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {step >= 0 && (
        <StepNavigator currentStep={step} totalSteps={9} onStepChange={setStep} stepStatus={stepStatus} />
      )}

      <AnimatePresence mode="wait">
        {step === 0 && <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><h3>Step 0: DES Decryption Round Flow</h3><HintBox step={0} /><Step0DesRoundFlow /><button onClick={() => { unlockNextStep(); setStep(1); }} style={{ marginTop: '1rem' }}>Next Step</button></motion.div>}
        {step === 1 && <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><h3>Step 1: Input Preparation</h3><HintBox step={1} /><Step1InputPreparation inputMatrix={state.inputMatrix} keyMatrix={state.keyMatrix} /><button onClick={() => { unlockNextStep(); setStep(2); }} style={{ marginTop: '1rem' }}>Next Step</button></motion.div>}
        {step === 2 && <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><h3>Step 2: Initial Permutation and Split</h3><HintBox step={2} /><Step2InitialPermutationAndSplit inputBits={state.inputBits} permutedBits={state.permutedBits} /><button onClick={() => { unlockNextStep(); setStep(3); }} style={{ marginTop: '1rem' }}>Next Step</button></motion.div>}
        {step === 3 && <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><h3>Step 3: Key Schedule </h3><HintBox step={3} /><Step3KeySchedule keyBits={state.keyBits} /><button onClick={() => { unlockNextStep(); setStep(4); }} style={{ marginTop: '1rem' }}>Next Step</button></motion.div>}
        {step === 4 && <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><h3>Step 4: Round 1 (K₁₆)</h3><HintBox step={4} /><Step4Round1 L0Bits={state.L0} R0Bits={state.R0} K1Bits={state.roundKeys?.[0]} expandedR={state.rounds?.[0]?.expandedR} xorWithKey={state.rounds?.[0]?.xor} sboxOutput={state.rounds?.[0]?.sbox} pboxOutput={state.rounds?.[0]?.pbox} R1Bits={state.rounds?.[0]?.newR} /><button onClick={() => { unlockNextStep(); setStep(5); }} style={{ marginTop: '1rem' }}>Next Step</button></motion.div>}
        {step === 5 && <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><h3>Step 5: Rounds 2–16 (K₁₅ to K₁)</h3><HintBox step={5} /><Step5Rounds2to16 L0Bits={state.L0} R0Bits={state.R0} roundKeys={state.roundKeys} onFinalValuesCalculated={() => {}} /><button onClick={() => { unlockNextStep(); setStep(6); }} style={{ marginTop: '1rem' }}>Next Step</button></motion.div>}
        {step === 6 && <motion.div key="step6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><h3>Step 6: Final Swap</h3><HintBox step={6} /><Step6FinalSwap L16Bits={state.L16} R16Bits={state.R16} /><button onClick={() => { unlockNextStep(); setStep(7); }} style={{ marginTop: '1rem' }}>Next Step</button></motion.div>}
        {step === 7 && <motion.div key="step7" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><h3>Step 7: Final Permutation</h3><HintBox step={7} /><Step7FinalPermutation preOutputBits={state.preOutputBits} onCiphertextCalculated={() => {}} /><button onClick={() => { unlockNextStep(); setStep(8); }} style={{ marginTop: '1rem' }}>Next Step</button></motion.div>}
        {step === 8 && <motion.div key="step8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><h3>Step 8: Plaintext Output</h3><HintBox step={8} /><Step8CiphertextOutput inputBits={state.inputBits} cipherBits={state.cipherBits} keyBits={state.keyBits} asciiOutput={state.asciiOutput} /></motion.div>}
      </AnimatePresence>
    </div>
  );
};

export default DesDecryptor;