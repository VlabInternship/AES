import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TooltipText = ({ children, tooltip }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        cursor: 'pointer',
        textDecoration: 'underline dotted',
        color: 'var(--primary-dark)'
      }}
    >
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="tooltip-box"
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

export default TooltipText;
