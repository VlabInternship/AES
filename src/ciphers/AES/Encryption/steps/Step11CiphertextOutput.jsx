import { useMemo } from 'react';
import MatrixTable from '../../../../components/MatrixTable';
import { motion, AnimatePresence } from 'framer-motion';
import { AesEncryption } from '../../../../components/AesEncryption';
import { matrixToHexColumnWise } from '../../../../shared/aes/toMatrix';
const Step11CiphertextOutput = ({ inputHex, keyHex }) => {
  const {
    inputMatrix,
    keyMatrix,
    cipherMatrix,

  } = useMemo(() => {
    if (inputHex.length === 16 && keyHex.length === 16) {
      return AesEncryption(inputHex, keyHex, true); // third arg = true for pre-padded input
    }
    return {
      inputMatrix: [],
      keyMatrix: [],
      cipherMatrix: [],
    };
  }, [inputHex, keyHex]);

  return (
    <div className='aes-container'>
      <AnimatePresence mode="wait">
        <motion.div
          key="step11"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="step-row-grid">
          {inputMatrix.length > 0 && (
            <div className="step-box">
              <h4 className="title">Input Matrix (HEX)</h4>
              <MatrixTable matrix={inputMatrix} />
            </div>
          )}
          {keyMatrix.length > 0 && (
            <div className="step-box">
              <h4 className="title">Key Matrix (HEX)</h4>
              <MatrixTable matrix={keyMatrix} />
            </div>
          )}
          {cipherMatrix.length > 0 && (
            <div className="step-box">
              <h4 className="title">Ciphertext Matrix (HEX)</h4>
              <MatrixTable matrix={cipherMatrix} />
            </div>
          )}
        </motion.div>
        <motion.div
          key="step7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="step-grid">
          <div className="step-box">
            <h4>Ciphertext Output (HEX)</h4>
            <div className="hex-output">
              <code style={{ fontSize: '1.2rem' }}>{ matrixToHexColumnWise(cipherMatrix).join(' ')}</code>
            </div>
          </div>
</motion.div>
</AnimatePresence>

    </div>
  );
};

export default Step11CiphertextOutput;
