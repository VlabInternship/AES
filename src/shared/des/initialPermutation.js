// src/shared/des/initialPermutation.js

// DES Initial Permutation Table (IP)
export const INITIAL_PERMUTATION_TABLE = [
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6,
  64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7
];

/**
 * Apply the DES Initial Permutation to a 64-bit binary string.
 * @param {string} bitString64 - A 64-character string of '0' and '1'
 * @returns {string} - Reordered 64-bit binary string after IP
 */
export function initialPermutation(bitString64) {
  if (bitString64.length !== 64) {
    throw new Error('Expected 64-bit binary input for initial permutation');
  }

  return INITIAL_PERMUTATION_TABLE.map(pos => bitString64[pos - 1]).join('');
}

/**
 * Create a mapping from original bit matrix (row,col) to permuted matrix (row,col).
 * Useful for hover-based visualizations.
 * @returns {object} - e.g., { "7-1": "0-0" } maps original cell (8,2) → permuted cell (1,1)
 */
export function getPermutationCoordinateMap() {
  const map = {};
  INITIAL_PERMUTATION_TABLE.forEach((originalPos, permutedPos) => {
    const fromIndex = originalPos - 1;       // where the bit comes from (original)
    const toIndex = permutedPos;             // where it goes in permuted result

    const fromKey = `${Math.floor(fromIndex / 8)}-${fromIndex % 8}`;
    const toKey = `${Math.floor(permutedPos / 8)}-${permutedPos % 8}`;

    map[fromKey] = toKey;
  });
  return map;
}

