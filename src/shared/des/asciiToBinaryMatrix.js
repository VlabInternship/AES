// src/shared/des/asciiToBinaryMatrix.js

/**
 * Converts an ASCII string into a 64-bit (8x8) binary matrix.
 * Pads with null bytes (\x00) if input is less than 8 characters.
 *
 * @param {string} str - ASCII string (max 8 characters)
 * @returns {number[][]} - 8x8 binary matrix (array of 8 arrays with 8 bits each)
 */
export function asciiToBinaryMatrix(str) {
  // Ensure exactly 8 characters (64 bits), pad if needed
  const padded = str.padEnd(8, '\x00').slice(0, 8);

  // Convert each char to 8-bit binary and flatten into one long bit array
  const bits = padded
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('')
    .split('')
    .map(bit => parseInt(bit, 10));

  // Reshape into 8 rows of 8 bits
  const matrix = [];
  for (let i = 0; i < 8; i++) {
    matrix.push(bits.slice(i * 8, i * 8 + 8));
  }

  return matrix;
}
