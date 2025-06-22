import { SBOX } from './constants.js';
export function subBytes(state) {
  const newState = state.map((row) =>
    row.map((byte) => {
      const byteInt = parseInt(byte, 16);
      const substituted = SBOX[byteInt] ?? 0x00;
      return substituted.toString(16).padStart(2, '0');
    })
  );
  return newState;
}
