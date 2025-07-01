import React from 'react';
import MatrixTable from '../../../components/MatrixTable';
import { motion, AnimatePresence } from 'framer-motion';

const Step1InputDisplay = ({ inputMatrix, keyMatrix }) => (
    <div className='aes-container'>
        <AnimatePresence mode="wait">
            <div className="step-grid">
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
            </div>
        </AnimatePresence>
    </div>
);

export default Step1InputDisplay;