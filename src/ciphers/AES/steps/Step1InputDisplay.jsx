import React from 'react';
import MatrixTable from '../../../components/MatrixTable';
import { motion, AnimatePresence } from 'framer-motion';

const Step0InputDisplay = ({ inputMatrix, keyMatrix }) => (
    <div>
        <AnimatePresence mode="wait">
            <motion.div
                key="step0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="step0-grid"
            ></motion.div>
            <div className="step0-box">
                <h4 className="title">Input Matrix</h4>
                <div>                
                    <MatrixTable matrix={inputMatrix} />
                </div>
            </div>
            <div className="step0-box">
                <h4 className="title">Key Matrix</h4>
                <div>                
                    <MatrixTable matrix={keyMatrix} />
                </div>
            </div>
        </AnimatePresence>
    </div>
);

export default Step0InputDisplay;