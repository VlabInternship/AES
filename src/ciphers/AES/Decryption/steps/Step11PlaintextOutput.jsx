import { AnimatePresence, motion } from 'framer-motion';
import MatrixTable from '../../../../components/MatrixTable';
import { matrixToHexColumnWise } from '../../../../shared/aes/toMatrix';
const Step11FinalPlaintextOutput = ({ ciphertextMatrix, keyMatrix, finalMatrix }) => {
    // Convert the final matrix to ASCII string
    // Assuming finalMatrix is a 4x4 matrix of hex values   
    // and we need to convert it to ASCII
    // Each hex value corresponds to a character in ASCII
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
                        <h4>Ciphertext Matrix (HEX)</h4>
                        <MatrixTable matrix={ciphertextMatrix} />
                    </div>
                    <div className="step-box">
                        <h4>Key Matrix (HEX)</h4>
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
                        <h4>Decrypted hex output</h4>
                        <div className="hex-output">
                            <code style={{ fontSize: '1.2rem' }}>{ matrixToHexColumnWise(finalMatrix).join(' ')}</code>

                        </div>
                    </div>

                </motion.div>

            </AnimatePresence>
        </div>
    );
};



export default Step11FinalPlaintextOutput;
