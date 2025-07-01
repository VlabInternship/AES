import React, { useMemo } from 'react';
import MatrixTable from '../../../components/MatrixTable';
import { motion, AnimatePresence } from 'framer-motion';
import { encrypt } from '../../../components/Encryption';

const Step11CiphertextOutput = ({ inputHex, keyHex }) => {
  const {
    paddedInputMatrix,
    paddedKeyMatrix,
    cipherMatrix,
    ascii
  } = useMemo(() => {
    if (inputHex.length === 16 && keyHex.length === 16) {
      return encrypt(inputHex, keyHex, true); // third arg = true for pre-padded input
    }
    return {
      paddedInputMatrix: [],
      paddedKeyMatrix: [],
      cipherMatrix: [],
      ascii: ''
    };
  }, [inputHex, keyHex]);

  return (
    <div className='aes-container'>
      <AnimatePresence mode="wait">
        <motion.div
          key="step6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="step-grid">
          {paddedInputMatrix.length > 0 && (
            <div className="step-box">
              <h4 className="title">Padded Input Matrix (HEX)</h4>
              <MatrixTable matrix={paddedInputMatrix} />
            </div>
          )}
          {paddedKeyMatrix.length > 0 && (
            <div className="step-box">
              <h4 className="title">Padded Key Matrix (HEX)</h4>
              <MatrixTable matrix={paddedKeyMatrix} />
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
          key="step6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="step-grid">
          {ascii && (
            <div className="step-box">
              <h4 className="title">Ciphertext (ASCII)</h4>
              <p className="ascii-output">{ascii}</p>
            </div>
          )}
        </motion.div>
</AnimatePresence>

    </div>
  );
};

export default Step11CiphertextOutput;
