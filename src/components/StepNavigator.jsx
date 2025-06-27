// src/components/StepNavigator.jsx
import React from 'react';

const StepNavigator = ({ currentStep, totalSteps, onStepChange }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '20px 0', justifyContent: 'center' }}>
      {[...Array(totalSteps).keys()].map(step => (
        <button
          key={step}
          onClick={() => onStepChange(step)}
          style={{
            backgroundColor: currentStep === step ? 'var(--primary-dark)' : 'var(--primary)',
            color: 'white',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Step {step}
        </button>
      ))}
    </div>
  );
};

export default StepNavigator;
