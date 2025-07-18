// src/shared/aes/invSubBytes.js
import { INV_SBOX } from './constants';

export const invSubBytes = (state) => {
  return state.map(row => row.map(byte => {
    const val = parseInt(byte, 16);
    const substituted = INV_SBOX[val] ?? 0x00;
    return substituted.toString(16).toUpperCase().padStart(2, '0');
  }));
};
