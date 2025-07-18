import React from 'react';
import MatrixTable from '../../../../components/MatrixTable';
import { motion, AnimatePresence } from 'framer-motion';

const Step1InputDisplay = ({ inputMatrix, keyMatrix }) => (
    <div className='aes-container'>
        <AnimatePresence mode="wait">
        <motion.div
          className="step-row-grid"
          key="step1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
                <div className="step-box">
                    <h4 className="title">Input Matrix</h4>
                    <div>
                        <MatrixTable matrix={inputMatrix} />
                    </div>
                </div>
                <div className="step-box">
                    <h4 className="title">Key Matrix</h4>
                    <div>
                        <MatrixTable matrix={keyMatrix} />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    </div>
);

export default Step1InputDisplay;