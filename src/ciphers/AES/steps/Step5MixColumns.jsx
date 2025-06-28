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
        <div>
            <h3>Step 5: Round 1 - MixColumns</h3>
            <AnimatePresence mode="wait">
                <motion.div
                    key="step5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="step5-grid"
                >
                    {/* Input matrix */}
                    <div className="step5-box">
                        <h4 className="title">Input to MixColumns</h4>
                        <MatrixTable matrix={inputMatrix} />
                    </div>

                    {/* Visual explanation diagram */}
                    <div className="step5-box">
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
                    </div>

                    {/* Output matrix */}
                    <div className="step5-box">
                        <h4 className="step5-title">Output after MixColumns</h4>
                        <MatrixTable matrix={outputMatrix} />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Step5MixColumns;
