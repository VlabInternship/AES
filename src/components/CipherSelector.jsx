// src/components/CipherSelector.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/global.css';

const CipherSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    navigate(e.target.value);
  };

  return (
    <div className="page-header" style={{ textAlign: 'center' }}>
     <select onChange={handleChange} value={location.pathname}>
       <option value="/aes">AES</option>
       <option value="/des">DES</option>
      </select>
    </div>
  );
};

export default CipherSelector;
