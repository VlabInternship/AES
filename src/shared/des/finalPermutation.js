// src/shared/des/finalPermutation.js

// DES Final Permutation Table (IP⁻¹)
export const FINAL_PERMUTATION_TABLE = [
  40, 8, 48, 16, 56, 24, 64, 32,
  39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30,
  37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26,
  33, 1, 41, 9, 49, 17, 57, 25
];

/**
 * Apply the DES Final Permutation (IP⁻¹) to a 64-bit binary string.
 * @param {string} bitString64 - A 64-character binary string
 * @returns {string} - Permuted 64-bit binary output
 */
export function finalPermutation(bitString64) {
  if (bitString64.length !== 64) {
    throw new Error('Expected 64-bit binary input for final permutation');
  }

  return FINAL_PERMUTATION_TABLE.map(pos => bitString64[pos - 1]).join('');
}


/**
 * Create a mapping from original bit matrix (row,col) to permuted matrix (row,col).
 * Useful for hover-based visualizations.
 * @returns {object} - e.g., { "7-1": "0-0" } maps original cell (8,2) → permuted cell (1,1)
 */
export function getPermutationCoordinateMap() {
  const map = {};
  FINAL_PERMUTATION_TABLE.forEach((originalPos, permutedPos) => {
    const fromIndex = originalPos - 1;       // where the bit comes from (original)
    const toIndex = permutedPos;             // where it goes in permuted result

    const fromKey = `${Math.floor(fromIndex / 8)}-${fromIndex % 8}`;
    const toKey = `${Math.floor(permutedPos / 8)}-${permutedPos % 8}`;

    map[fromKey] = toKey;
  });
  return map;
}

