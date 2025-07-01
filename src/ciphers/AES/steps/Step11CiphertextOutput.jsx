import React, { useMemo } from 'react';
import MatrixTable from '../../../components/MatrixTable';
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
    <>
      {paddedInputMatrix.length > 0 && (
        <div className="step0-box">
          <h4 className="title">Padded Input Matrix (HEX)</h4>
          <MatrixTable matrix={paddedInputMatrix} />
        </div>
      )}
      {paddedKeyMatrix.length > 0 && (
        <div className="step0-box">
          <h4 className="title">Padded Key Matrix (HEX)</h4>
          <MatrixTable matrix={paddedKeyMatrix} />
        </div>
      )}
      {cipherMatrix.length > 0 && (
        <div className="step0-box">
          <h4 className="title">Ciphertext Matrix (HEX)</h4>
          <MatrixTable matrix={cipherMatrix} />
        </div>
      )}
      {ascii && (
        <div className="step0-box">
          <h4 className="title">Ciphertext (ASCII)</h4>
          <p className="ascii-output">{ascii}</p>
        </div>
      )}
    </>
  );
};

export default Step11CiphertextOutput;
