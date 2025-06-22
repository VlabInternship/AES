import React from 'react';
import MatrixTable from '../../../components/MatrixTable';

const Step0InputDisplay = ({ inputMatrix, keyMatrix }) => (
    <div>
        <h3>Step 0: Input Preparation</h3>

        <div style={{ marginBottom: '20px' }}>
            <h4>Input Matrix:</h4>
            <MatrixTable matrix={inputMatrix} />
        </div>

        <div style={{ marginBottom: '20px' }}>
            <h4>Key Matrix:</h4>
            <MatrixTable matrix={keyMatrix} />
        </div>
    </div>
);

export default Step0InputDisplay;