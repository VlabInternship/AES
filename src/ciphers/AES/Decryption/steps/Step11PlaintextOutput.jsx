import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MatrixTable from '../../../../components/MatrixTable';

const Step11FinalPlaintextOutput = ({ ciphertextMatrix, keyMatrix, finalMatrix }) => {
    const asciiString = finalMatrix?.flat().map(hex => {
        const val = parseInt(hex, 16);
        return val >= 32 && val <= 126 ? String.fromCharCode(val) : '.';
    }).join('');

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
                    <div className="step-box">
                        <h4>Padded Ciphertext Matrix (HEX)</h4>
                        <MatrixTable matrix={ciphertextMatrix} />
                    </div>
                    <div className="step-box">
                        <h4>Padded Key Matrix (HEX)</h4>
                        <MatrixTable matrix={keyMatrix} />
                    </div>
                    <div className="step-box">
                        <h4>Final Plaintext Matrix (HEX)</h4>
                        <MatrixTable matrix={finalMatrix} />
                    </div>
                </motion.div>
                <motion.div
                    key="step6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="step-grid">
                    
                        <div className="step-box">
                            <h4>Decrypted ASCII Output</h4>
                            <div className="ascii-output">
                                <code style={{ fontSize: '1.2rem' }}>{asciiString}</code>
                            </div>
                        </div>
                        
                </motion.div>

            </AnimatePresence>
        </div>
    );
};



                export default Step11FinalPlaintextOutput;
