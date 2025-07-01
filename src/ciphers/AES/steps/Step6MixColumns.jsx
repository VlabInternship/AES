// src/ciphers/AES/steps/Step5MixColumns.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatrixTable from '../../../components/MatrixTable';
import { mixColumns, generateMixMatrix } from '../../../shared/aes/mixColumns';

const Step5MixColumns = ({ inputMatrix }) => {
    const mixMatrix = generateMixMatrix();
    const mixMatrixHex = mixMatrix.map(row => row.map(n => n.toString(16).padStart(2, '0')));
    const outputMatrix = mixColumns(inputMatrix, mixMatrix);

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
                    {/* Input matrix */}
                    <div className="step-box">
                        <h4 className="title">Input to MixColumns</h4>
                        <MatrixTable matrix={inputMatrix} />
                    </div>
                    {/* Output matrix */}
                    <div className="step-box">
                        <h4 className="step5-title">Output after MixColumns</h4>
                        <MatrixTable matrix={outputMatrix} />
                    </div>
                </motion.div>
                <motion.div key="step6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }} className="step-box">
                    {/* Visual explanation diagram */}

                    <h4 className="title">MixColumns Operation </h4>
                    <div className="step5-diagram-grid">
                        <div>
                            <MatrixTable matrix={inputMatrix} />
                        </div>

                        <div className="step5-diagram-symbol">×</div>
                        <div>
                            <MatrixTable matrix={mixMatrixHex} />
                        </div>

                        <div className="step5-diagram-symbol">=</div>
                        <div>
                            <MatrixTable matrix={outputMatrix} />
                        </div>

                    </div>
                    <div className="explanation-box">
                        The input matrix is multiplied by a fixed matrix using special byte-wise math. This mixes the column values to make the output more secure.
                    </div>



                </motion.div>
            </AnimatePresence>
        </div >
    );
};

export default Step5MixColumns;
