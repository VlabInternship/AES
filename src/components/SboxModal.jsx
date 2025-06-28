// src/components/SBoxModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SBOX } from '../shared/aes/constants';
import '../styles/aes.css';

const SBoxModal = ({ word, substituted, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal-content"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <h3>S-Box Substitution</h3>
          <p><strong>Input Word:</strong> {word.map(b => b.toUpperCase()).join(' ')}</p>
          <p><strong>After S-Box:</strong> {substituted.map(b => b.toUpperCase()).join(' ')}</p>

          <table className="sbox-table">
            <tbody>
              {[...Array(16)].map((_, row) => (
                <tr key={row}>
                  {[...Array(16)].map((_, col) => {
                    const val = SBOX[row * 16 + col].toString(16).toUpperCase().padStart(2, '0');
                    const isMatch = substituted.includes(val.toLowerCase());
                    return (
                      <td key={col} style={{ background: isMatch ? '#c1f0c1' : 'white', fontWeight: isMatch ? 'bold' : 'normal' }}>
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={onClose} style={{ marginTop: '1rem' }}>Close</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SBoxModal;
