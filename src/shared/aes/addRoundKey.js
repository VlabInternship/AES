// src/shared/aes/addRoundKey.js
export function addRoundKey(state, roundKey) {
  const newState = state.map((row, i) =>
    row.map((cell, j) => {
      const sByte = parseInt(cell, 16);
      const kByte = parseInt(roundKey[i][j], 16);
      return (sByte ^ kByte).toString(16).padStart(2, '0');
    })
  );
  return newState;
}
