export function asciiToHex(input) {
  if (input.length !== 16) {
    throw new Error("Input must be exactly 16 characters (128 bits) for AES-128.");
  }

  for (let char of input) {
    const code = char.charCodeAt(0);
    if (code < 32 || code > 126) {
      throw new Error("Only printable ASCII characters (space to ~) are allowed.");
    }
  }

  return input
    .split('')
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase());
}


/**
 * Converts a hex matrix (4x4) to ASCII matrix (4x4).
 * Example: [['54', '68', ...], ...] → [['T', 'h', ...], ...]
 * @param {string[][]} hexMatrix
 * @returns {string[][]} asciiMatrix
 */
export function hexMatrixToAsciiMatrix(hexMatrix) {
  return hexMatrix.map(row =>
    row.map(h => String.fromCharCode(parseInt(h, 16)))
  );
}
